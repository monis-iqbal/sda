# FixMate - Installation & Setup Guide

## Requirements

Install the following software:

- Node.js (LTS Version)
- Java 17
- PostgreSQL
- Git
- VS Code

Verify installation:

```bash
node -v
npm -v
java -version
```

Expected Java Version:

```txt
openjdk version "17"
```

---

# Project Structure

```txt
fixmate
├── frontend
└── fixmate-backend
```

---

# Clone Project

```bash
git clone YOUR_REPOSITORY_URL
cd fixmate
```

---

# PostgreSQL Setup

Open pgAdmin or SQL Shell and create a database:

```sql
CREATE DATABASE fixmate_db;
```

---

# Backend Configuration

Open:

```txt
fixmate-backend/src/main/resources/application.properties
```

Update:

```properties
spring.application.name=fixmate-backend
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/fixmate_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

---

# Run Backend

Open terminal:

```bash
cd fixmate-backend
```

Clean old build:

```bash
./mvnw.cmd clean
```

Run application:

```bash
./mvnw.cmd spring-boot:run
```

Backend URL:

```txt
https://sda-production-4678.up.railway.app
```

Verify:

```txt
https://sda-production-4678.up.railway.app/api/users
```

If JSON appears, backend is working.

---

# Run Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```txt
http://localhost:3000
```

---

# Database Seeder

When backend starts for the first time, sample data is inserted automatically.

Default users:

Admin:

```txt
Email: admin@fixmate.com
Password: admin123
```

Worker:

```txt
Email: worker@fixmate.com
Password: worker123
```

Clients can register through the website.

---

# Application Flow

## Client

1. Register/Login
2. Book Service
3. Track Request Status

Status flow:

```txt
PENDING
↓
ASSIGNED
↓
IN_PROGRESS
↓
COMPLETED
```

---

## Admin

1. Login
2. View Requests
3. View Workers
4. Assign Worker
5. Track Status

---

## Worker

1. Login
2. View Assigned Jobs
3. Start Work
4. Mark Job Completed

---

# API Endpoints

## Authentication

```txt
POST /api/auth/login
```

## Users

```txt
POST /api/users
GET /api/users
GET /api/users/{id}
DELETE /api/users/{id}
```

## Services

```txt
POST /api/services
GET /api/services
GET /api/services/{id}
DELETE /api/services/{id}
```

## Requests

```txt
POST /api/requests
GET /api/requests
GET /api/requests/{id}
GET /api/requests/client/{clientId}
PUT /api/requests/{id}/status
```

## Assignments

```txt
POST /api/assignments
GET /api/assignments
GET /api/assignments/worker/{workerId}
```

---

# Full Testing Flow

Step 1:

```txt
Login as Client
```

Step 2:

```txt
Create Service Request
```

Step 3:

```txt
Login as Admin
```

Step 4:

```txt
Assign Worker
```

Step 5:

```txt
Login as Worker
```

Step 6:

```txt
Start Work
```

Status becomes:

```txt
IN_PROGRESS
```

Step 7:

```txt
Mark Completed
```

Status becomes:

```txt
COMPLETED
```

Step 8:

```txt
Login as Client
```

Step 9:

```txt
Verify Updated Status
```

---

# Common Issues

## Maven Not Found

Use:

```bash
./mvnw.cmd spring-boot:run
```

instead of:

```bash
mvn spring-boot:run
```

---

## Java Version Error

Use Java 17.

Check:

```bash
java -version
```

Then clean and rebuild:

```bash
./mvnw.cmd clean
./mvnw.cmd spring-boot:run
```

---

## PostgreSQL Connection Error

Verify:

- PostgreSQL service is running
- Database exists
- Username/password are correct

---

# Project Summary

FixMate is a role-based home service management platform.

Client:
- Creates service requests

Admin:
- Assigns workers

Worker:
- Completes jobs

The project demonstrates:

- Spring Boot Backend
- PostgreSQL Database
- Next.js Frontend
- REST APIs
- Role-Based Dashboards
- 7 Software Design Patterns
