# Task Manager Frontend

React + Vite frontend for the Task Manager microservices project.

## Local Development

```powershell
npm install
npm run dev
```

The app defaults to:

- Task API: `http://localhost:8085/tasks`
- Analytics API: `http://localhost:8086/analytics`
- Notification API: `http://localhost:8087/notifications`

You can override them with:

```powershell
$env:VITE_API_URL="http://localhost:8085/tasks"
$env:VITE_ANALYTICS_URL="http://localhost:8086/analytics"
$env:VITE_NOTIFICATION_URL="http://localhost:8087/notifications"
npm run dev
```

## Production Build

```powershell
npm run build
npm run preview
```
