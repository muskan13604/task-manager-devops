# Task Manager Microservices

This project now runs as four services:

| Service | Path | Port | Responsibility |
| --- | --- | --- | --- |
| Frontend | `frontend` | `5173` | React UI for managing tasks |
| Task Service | `backend` | `8085` | Task CRUD API and H2 persistence |
| Analytics Service | `analytics-service` | `8086` | Dashboard totals, progress, and priority counts |
| Notification Service | `notification-service` | `8087` | Reminder messages for pending tasks |

## Local Docker Compose

```powershell
docker compose up --build
```

Useful endpoints:

- `http://localhost:8085/tasks`
- `http://localhost:8086/analytics/summary`
- `http://localhost:8087/notifications/reminders`
- `http://localhost:5173`

## Kubernetes

Apply all manifests from the `k8s` folder:

```powershell
kubectl apply -f k8s/
```

The analytics and notification services call the task service through the internal Kubernetes URL `http://task-service:8085/tasks`.
