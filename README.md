# visionup-site
This is where VisionUp website files are located.

## Backend setup

Backend Django project path:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a local `.env` file in the repository root. Use `.env.example` as the template:

```env
DB_NAME=visionup_site
DB_USER=visionup_site_user
DB_PASSWORD=your-local-password
DB_HOST=localhost
DB_PORT=5432
```

PostgreSQL database name:

```text
visionup_site
```

Run checks and migrations:

```bash
python manage.py check
python manage.py makemigrations
python manage.py migrate
```

Create an admin user:

```bash
python manage.py createsuperuser
```

Run the development server:

```bash
python manage.py runserver
```

## Frontend setup

Frontend project path:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Set the local API base URL in the repository root `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Run the frontend development server:

```bash
npm run dev
```

Local URLs:

```text
Frontend: http://localhost:5173
Backend: http://localhost:8000
```

Both servers must be running for the frontend to load release data and submit contact messages.

## Backend API

Local API base URL:

```text
http://localhost:8000/api/
```

Latest release endpoint:

```http
GET /api/releases/latest/
```

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

Contact endpoint:

```http
POST /api/contact/
```

Request:

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

Contact validation:

- `name`, `email`, `subject` and `message` are required.
- `name`, `email` and `message` are trimmed before saving.
- Whitespace-only values are rejected.
- `email` must be a valid email address.
- `subject` must be one of `general_question`, `bug_report`, `feature_request`, `accessibility_feedback`.
- Client-provided `status` is ignored; new messages are saved with `status=new`.

Development frontend origins are configured with:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Run API tests:

```bash
python manage.py test --keepdb
```

Release records are managed in Django admin. Create one active `Release` so the Home download button can use its `download_url`.

Contact form submissions are saved as `ContactMessage` records and can be reviewed in Django admin.
