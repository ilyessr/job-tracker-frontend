# Job Tracker Frontend

Frontend for the Job Tracker app: login, protected dashboard, stats, and job applications management.  
It connects to a production backend I built here: https://github.com/ilyessr/job-tracker-backend

Live demo: https://ilyessr.github.io/job-tracker-frontend/login

## Demo Account

Use the demo credentials to explore the app:

- Email: `demo@jobtracker.dev`
- Password: `password123`

## Notable React Packages

- `react-router-dom` for routing and protected routes
- `@tanstack/react-query` for data fetching and caching
- `react-hook-form` for forms and validation
- `axios` for API calls
- `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop ordering
- `react-icons` for icons
- `tailwindcss` for styling

## Setup

1. Install dependencies:

```
npm install
```

2. Create a `.env` file and set:

```
VITE_API_URL=http://localhost:3000
```

3. Start the dev server:

```
npm run dev
```
