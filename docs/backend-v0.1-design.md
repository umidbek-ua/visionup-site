# VisionUp Site Backend v0.1 Design

Change ID: `api1`

## 1. V0.1 Backend Maqsadi

VisionUp Site v0.1 backend faqat ikki vazifani qo'llab-quvvatlaydi:

1. Saytning Home sahifasidagi download qismi uchun oxirgi active release ma'lumotini berish.
2. Contact sahifasidagi formadan kelgan xabarni qabul qilish, validation qilish va database'da saqlash.

Bu bosqich faqat API contract va PostgreSQL database model design uchun. Django model, migration, table va endpoint implementation kiritilmaydi.

## 2. Mavjud Loyiha Holati

Tekshiruv natijasi:

- Frontend mavjud: `frontend/src`.
- Home download qismi `frontend/src/components/DownloadButton.tsx` orqali render qilinadi.
- Download data hozir `frontend/src/data/siteData.ts` ichidagi `downloadInfo` objectidan olinadi.
- Contact sahifasi `frontend/src/pages/Contact.tsx` ichida joylashgan.
- Contact form fieldlari: `name`, `email`, `subject`, `message`.
- Contact validation hozir frontendda `frontend/src/utils/contactValidation.ts` orqali bajariladi.
- Subject label variantlari hozir `frontend/src/data/contactData.ts` ichida saqlanadi.
- Backend Django skeleti mavjud: `backend/manage.py`, `backend/config`, `backend/core`.
- `backend/core/models.py` hozir model yozilmagan holatda.
- Backend config hozir default SQLite sozlamasida; PostgreSQL ulanishi hali implementatsiya qilinmagan.

## 3. API Endpointlar

### GET `/api/releases/latest/`

Oxirgi active VisionUp desktop release ma'lumotini qaytaradi.

Talablar:

- Faqat `is_active = true` bo'lgan release qaytariladi.
- Active release topilmasa `404 Not Found` qaytariladi.
- v0.1 uchun faqat `macOS` platformasi va `Apple Silicon` architecture qo'llab-quvvatlanadi.
- `download_url` haqiqiy DMG fayl URL manzili bo'lishi kerak.
- Agar bir nechta active release bo'lishi design constraint orqali taqiqlanadi.

Successful response:

```json
{
  "id": 1,
  "version": "0.1.0",
  "platform": "macOS",
  "architecture": "Apple Silicon",
  "download_url": "https://example.com/visionup-0.1.0.dmg",
  "file_size": "25 MB",
  "released_at": "2026-07-31T00:00:00Z"
}
```

Not found response:

```json
{
  "detail": "Active release not found."
}
```

### POST `/api/contact/`

Contact form xabarini qabul qiladi va database'da `ContactMessage` sifatida saqlaydi.

Request body:

```json
{
  "name": "Umid",
  "email": "example@email.com",
  "subject": "accessibility_feedback",
  "message": "Message text"
}
```

Successful response:

```json
{
  "message": "Your message has been received.",
  "id": 1
}
```

Invalid request response:

```json
{
  "errors": {
    "email": ["Enter a valid email address."],
    "message": ["This field may not be blank."]
  }
}
```

## 4. Validation Qoidalari

### Release

- `version` required.
- `download_url` required.
- `download_url` valid URL bo'lishi kerak.
- `download_url` DMG faylga olib borishi kerak; v0.1 uchun URL `.dmg` bilan tugashi tavsiya qilinadi.
- `released_at` required.
- `platform` default: `macOS`.
- `architecture` default: `Apple Silicon`.
- `is_active` default: `false`.
- Bir vaqtda faqat bitta active release bo'lishi mumkin.

### Contact

- `name` required.
- `email` required.
- `email` valid email formatida bo'lishi kerak.
- `subject` required.
- `subject` faqat ruxsat berilgan variantlardan biri bo'lishi kerak.
- `message` required.
- Bo'sh yoki faqat space'dan iborat `name`, `email`, `subject`, `message` qabul qilinmaydi.
- Saqlashdan oldin string fieldlar trim qilinadi.

## 5. Release Model Design

Model nomi: `Release`

| Field | PostgreSQL type | Django field tavsiyasi | Required | Default | Izoh |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigserial primary key` | `BigAutoField` | ha | auto | Primary key |
| `version` | `varchar(32)` | `CharField(max_length=32)` | ha | yo'q | Masalan, `0.1.0` |
| `platform` | `varchar(32)` | `CharField(max_length=32)` | ha | `macOS` | v0.1 faqat macOS |
| `architecture` | `varchar(32)` | `CharField(max_length=32)` | ha | `Apple Silicon` | v0.1 faqat Apple Silicon |
| `download_url` | `varchar(2048)` | `URLField(max_length=2048)` | ha | yo'q | DMG fayl URL manzili |
| `file_size` | `varchar(32)` | `CharField(max_length=32, blank=True)` | yo'q | empty string | Display uchun, masalan `25 MB` |
| `is_active` | `boolean` | `BooleanField` | ha | `false` | Latest endpoint uchun |
| `released_at` | `timestamptz` | `DateTimeField` | ha | yo'q | Release sanasi |
| `created_at` | `timestamptz` | `DateTimeField(auto_now_add=True)` | ha | auto | Record yaratilgan vaqt |
| `updated_at` | `timestamptz` | `DateTimeField(auto_now=True)` | ha | auto | Record yangilangan vaqt |

## 6. Release Constraintlari

- `version` empty yoki whitespace-only bo'lmasin.
- `download_url` empty yoki whitespace-only bo'lmasin.
- `released_at` null bo'lmasin.
- Active release uchun partial unique constraint rejalashtiriladi:

```sql
CREATE UNIQUE INDEX one_active_release
ON releases_release (is_active)
WHERE is_active = true;
```

Implementation vaqtida Django `UniqueConstraint(condition=Q(is_active=True))` ishlatilishi mumkin.

## 7. ContactMessage Model Design

Model nomi: `ContactMessage`

| Field | PostgreSQL type | Django field tavsiyasi | Required | Default | Izoh |
| --- | --- | --- | --- | --- | --- |
| `id` | `bigserial primary key` | `BigAutoField` | ha | auto | Primary key |
| `name` | `varchar(120)` | `CharField(max_length=120)` | ha | yo'q | Sender name |
| `email` | `varchar(254)` | `EmailField(max_length=254)` | ha | yo'q | Sender email |
| `subject` | `varchar(40)` | `CharField(max_length=40, choices=...)` | ha | yo'q | Message category |
| `message` | `text` | `TextField` | ha | yo'q | Message body |
| `status` | `varchar(20)` | `CharField(max_length=20, choices=...)` | ha | `new` | Processing status |
| `created_at` | `timestamptz` | `DateTimeField(auto_now_add=True)` | ha | auto | Record yaratilgan vaqt |
| `updated_at` | `timestamptz` | `DateTimeField(auto_now=True)` | ha | auto | Record yangilangan vaqt |

## 8. ContactMessage Variantlari Va Constraintlari

Subject values:

| API value | Frontend label |
| --- | --- |
| `general_question` | `General Question` |
| `bug_report` | `Bug Report` |
| `feature_request` | `Feature Request` |
| `accessibility_feedback` | `Accessibility Feedback` |

Status values:

| Value | Izoh |
| --- | --- |
| `new` | Yangi kelgan xabar |
| `read` | Ko'rilgan xabar |
| `resolved` | Yopilgan yoki javob berilgan xabar |

Constraintlar:

- `status` default `new`.
- `status` faqat `new`, `read`, `resolved` bo'lishi mumkin.
- `subject` faqat `general_question`, `bug_report`, `feature_request`, `accessibility_feedback` bo'lishi mumkin.
- `name`, `email`, `subject`, `message` whitespace-only bo'lmasin.
- `created_at` va `updated_at` timezone-aware timestamp bo'lishi kerak.

## 9. Frontend Integration Nuqtalari

### Home Download

Hozirgi frontend holati:

- `DownloadButton.tsx` `downloadInfo.href`, `downloadInfo.label`, `downloadInfo.meta` qiymatlaridan foydalanadi.
- `downloadInfo.href` hozir `#`.
- `downloadInfo.meta` hozir `['Version 0.1', 'macOS', 'Apple Silicon', 'DMG']`.

Keyingi implementatsiyada:

- Frontend `GET /api/releases/latest/` chaqiradi.
- `download_url` button `href` qiymatiga ulanadi.
- `version`, `platform`, `architecture`, `file_size` download meta sifatida ko'rsatiladi.
- Active release topilmasa button disabled yoki unavailable state ko'rsatishi kerak.

### Contact Form

Hozirgi frontend holati:

- Form fieldlari: `name`, `email`, `subject`, `message`.
- Submit hozir backendga yubormaydi; browser validationdan keyin local success message ko'rsatadi.
- Subject label qiymatlari frontendda human-readable ko'rinishda.

Keyingi implementatsiyada:

- Frontend `POST /api/contact/` chaqiradi.
- Subject label API value'ga map qilinadi.
- Backenddan kelgan `400` field errorlar formadagi mos fieldlarda ko'rsatiladi.
- Successful response kelganda hozirgi success state backend response message bilan almashtiriladi.

## 10. Keyingi Implementatsiya Bosqichlari

1. PostgreSQL connection sozlamalarini alohida environment variables orqali rejalashtirish.
2. Django app ownership qarori: mavjud `core` ichida yozish yoki alohida `releases` va `contact` applar yaratish.
3. `Release` va `ContactMessage` Django modellari yozish.
4. Model constraintlari va migrations yaratish.
5. Admin paneldan release va contact message boshqaruvini qo'shish.
6. `GET /api/releases/latest/` endpointini implementatsiya qilish.
7. `POST /api/contact/` endpointini implementatsiya qilish.
8. Serializer yoki manual validation formatini tanlash.
9. Frontendni endpointlarga ulash.
10. API tests va validation tests yozish.

## 11. Hozircha Qaror Qilinmagan Masalalar

- API framework: Django REST Framework qo'shiladimi yoki dependency qo'shmasdan plain Django views ishlatiladimi.
- PostgreSQL database name, user, host, port va deployment environment qiymatlari.
- Release DMG fayli qayerda host qilinadi: CDN, object storage yoki boshqa static hosting.
- `file_size` human-readable string sifatida qoladimi yoki bytes integer sifatida saqlanadimi.
- Contact xabarlari uchun email notification kerakmi yoki faqat database saqlash yetarlimi.
- Rate limiting, spam protection va CAPTCHA v0.1 ichiga kiradimi yoki keyingi bosqichga qoldiriladimi.

## 12. Implementation Chegarasi

Bu hujjat doirasida quyidagilar bajarilmadi:

- Django model yozilmadi.
- Migration yaratilmadi.
- PostgreSQL table yaratilmadi.
- API endpoint implementatsiya qilinmadi.
- Frontend kodi o'zgartirilmadi.
- Yangi dependency qo'shilmadi.
- VisionUp desktop loyihasi yoki uning database'iga tegilmadi.
