# VisionUp Site Frontend

VisionUp Site is the static frontend for the VisionUp accessibility project.
Its purpose is to present the desktop app, explain how it helps low-vision
users, and prepare the website UI for a later Django backend integration.

## Pages

- Home
- Guide
- About
- Contact

## Frontend Stack

- React
- TypeScript
- Vite
- Oxlint
- CSS modules are not used; shared styling lives in `src/App.css` and global
  tokens live in `src/index.css`.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## v0.1 Current Status

The v0.1 frontend includes a static Home page, Guide page, About page, and
Contact page. The UI uses a dark, high-contrast style with large controls,
visible focus states, reusable components, and hash-based navigation.

The backend integration has not been implemented yet. There is no Django API,
database connection, email sending, or download backend logic in this frontend
version.

## Placeholders

- Screenshots are loaded from `image/visionup1.png`, `image/visionup2.png`, and
  `image/visionup3.png`. Replace those files with real app screenshots later.
- Download configuration is stored in `src/data/siteData.ts`. The current
  download URL is a placeholder.
- Contact form validation works in the browser, but form submission is static.
  The API request should be added later in `src/pages/Contact.tsx`.
- Guide content is stored in `src/data/guideData.ts` so real product details and
  keyboard shortcuts can be updated without changing layout code.
