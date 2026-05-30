# Task Manager DevOps Microservices Project

Ye project ek full stack Task Manager application hai jisme frontend, backend microservices, Docker, Prometheus, Grafana, Jenkins aur Kubernetes ka use kiya gaya hai.

## Project Mein Kya Use Kiya Hai

| Technology | Use |
| --- | --- |
| React + Vite | Frontend UI banane ke liye |
| Spring Boot | Backend microservices banane ke liye |
| H2 Database | Task service ke andar temporary/in-memory database |
| Docker | Har service ko container mein run karne ke liye |
| Docker Compose | Saari services ko ek command se start karne ke liye |
| Prometheus | Microservices ke metrics collect/scrape karne ke liye |
| Grafana | Metrics ko dashboard mein visualize karne ke liye |
| Jenkins | CI/CD pipeline ke liye |
| Kubernetes | Deployment manifests ke liye |
| Maven | Spring Boot services build karne ke liye |
| npm | Frontend dependencies/build ke liye |

## Microservices

| Service | Folder | Port | Kaam |
| --- | --- | --- | --- |
| Frontend | `frontend` | `5173` | Task Manager UI |
| Task Service | `backend` | `8085` | Task add, view, update, delete |
| Analytics Service | `analytics-service` | `8086` | Total, pending, completed, progress count |
| Notification Service | `notification-service` | `8087` | Pending tasks ke reminders |
| Prometheus | `monitoring/prometheus` | `9090` | Metrics scraping |
| Grafana | `monitoring/grafana` | `3000` | Monitoring dashboard |
| PostgreSQL | Docker image | `5432` | Database container demo |
| pgAdmin | Docker image | `5050` | PostgreSQL admin UI |

## Project Run Karne Ki Commands

### 1. Full Project Docker Compose Se Run Karna

```powershell
docker compose up --build
```

Is command se frontend, backend, analytics service, notification service, Prometheus, Grafana, PostgreSQL aur pgAdmin sab start ho jayenge.

### 2. Background Mein Run Karna

```powershell
docker compose up -d
```

Ye command containers ko background mein start karti hai.

### 3. Containers Check Karna

```powershell
docker ps
```

Isse pata chalega kaun-kaun se containers running hain.

### 4. Project Stop Karna

```powershell
docker compose down
```

Ye command saare project containers stop/remove kar deti hai.

## Kaunsa URL Kya Open Karega

| URL | Kya Open Hoga |
| --- | --- |
| `http://localhost:5173` | Task Manager frontend UI |
| `http://localhost:8085/tasks` | Task Service API |
| `http://localhost:8085/health` | Task Service health check |
| `http://localhost:8086/analytics/summary` | Analytics summary API |
| `http://localhost:8086/analytics/health` | Analytics Service health check |
| `http://localhost:8087/notifications/reminders` | Notification reminders API |
| `http://localhost:8087/notifications/health` | Notification Service health check |
| `http://localhost:9090` | Prometheus UI |
| `http://localhost:3000` | Grafana dashboard UI |
| `http://localhost:5050` | pgAdmin UI |

## Grafana Login

```text
Username: admin
Password: admin
```

Grafana mein dashboard ka naam:

```text
Task Manager Microservices
```

Direct dashboard URL:

```text
http://localhost:3000/d/task-manager-microservices/task-manager-microservices
```

## Prometheus Monitoring

Prometheus URL:

```text
http://localhost:9090
```

Prometheus ye services scrape karta hai:

| Job | Metrics URL |
| --- | --- |
| task-service | `http://task-service:8085/actuator/prometheus` |
| analytics-service | `http://analytics-service:8086/actuator/prometheus` |
| notification-service | `http://notification-service:8087/actuator/prometheus` |
| prometheus | `http://prometheus:9090/metrics` |

Browser se host machine par actuator metrics check karne ke URLs:

```text
http://localhost:8085/actuator/prometheus
http://localhost:8086/actuator/prometheus
http://localhost:8087/actuator/prometheus
```

Prometheus mein target status check karne ke liye:

1. `http://localhost:9090` open karo
2. Status menu mein jao
3. Targets par click karo
4. `task-service`, `analytics-service`, `notification-service` sab `UP` dikhne chahiye

## Grafana Dashboard Mein Kya Dikhega

Grafana dashboard mein ye monitoring panels hain:

- Service Health
- Requests Per Second
- Average Request Duration
- JVM Memory Used
- JVM GC Pause Rate

In panels se teacher ko dikha sakte ho ki microservices live monitor ho rahi hain.

## API Demo Commands

### Task Add Karna

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8085/tasks -ContentType "application/json" -Body '{"title":"Demo Task","date":"2026-05-31","time":"10:00","priority":"High","completed":false}'
```

### Saare Tasks Dekhna

```powershell
Invoke-RestMethod http://localhost:8085/tasks
```

### Analytics Check Karna

```powershell
Invoke-RestMethod http://localhost:8086/analytics/summary
```

### Notification Check Karna

```powershell
Invoke-RestMethod http://localhost:8087/notifications/reminders
```

## Local Development Commands

### Backend Run

```powershell
cd backend
mvn spring-boot:run
```

### Analytics Service Run

```powershell
cd analytics-service
mvn spring-boot:run
```

### Notification Service Run

```powershell
cd notification-service
mvn spring-boot:run
```

### Frontend Run

```powershell
cd frontend
npm install
npm run dev
```

## Build/Test Commands

### Spring Boot Services Build

```powershell
cd backend
mvn package

cd ../analytics-service
mvn package

cd ../notification-service
mvn package
```

### Frontend Build

```powershell
cd frontend
npm run build
```

## Kubernetes Commands

Kubernetes manifests `k8s` folder mein hain.

```powershell
kubectl apply -f k8s/
```

Resources check karne ke liye:

```powershell
kubectl get pods
kubectl get services
```

## Jenkins

Jenkins pipeline file:

```text
Jenkinsfile
```

Iska use CI/CD pipeline ke liye kiya gaya hai, jisme project build/test/deploy steps define kiye ja sakte hain.

## Teacher Ko Explain Karne Ke Points

1. Ye ek Task Manager microservices project hai.
2. Frontend React + Vite mein bana hai.
3. Backend Spring Boot mein multiple services ke form mein divided hai.
4. Task Service main CRUD API provide karta hai.
5. Analytics Service Task Service se data lekar summary banata hai.
6. Notification Service pending tasks ke reminders generate karta hai.
7. Docker Compose se saari services ek saath run hoti hain.
8. Prometheus microservices ke actuator endpoints se metrics collect karta hai.
9. Grafana Prometheus ka data dashboard mein show karta hai.
10. Kubernetes manifests deployment ke liye ready hain.
11. Jenkinsfile CI/CD pipeline ke liye included hai.

## Quick Demo Flow

1. Command run karo:

```powershell
docker compose up -d
```

2. Frontend open karo:

```text
http://localhost:5173
```

3. Ek task add karo.

4. Analytics API open karo:

```text
http://localhost:8086/analytics/summary
```

5. Notification API open karo:

```text
http://localhost:8087/notifications/reminders
```

6. Prometheus targets open karo:

```text
http://localhost:9090
```

7. Grafana dashboard open karo:

```text
http://localhost:3000
```

8. Dashboard `Task Manager Microservices` dikhao.

## Short Explanation

Ye project DevOps concepts ko demonstrate karta hai: microservices architecture, containerization with Docker, service orchestration with Docker Compose, monitoring with Prometheus and Grafana, CI/CD with Jenkins, aur Kubernetes deployment manifests.
