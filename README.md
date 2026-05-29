# RoutineX

RoutineX is a full-stack routine and habit tracker application with a React + Vite frontend and a Spring Boot backend. It allows users to authenticate, create/manage routines, mark tasks complete, and view progress with dashboard statistics.

## Project Structure

- `Backend/` - Spring Boot REST API server
- `Frontend/` - React application built with Vite
- `AI_services/` - supplemental services or AI-related tooling (not covered in this README)

## Key Features

- User registration, login, and secure JWT authentication
- Routine/task creation, update, deletion, and replacement
- Daily task completion tracking with history
- Dashboard-ready statistics for consistency, breakdowns, and heatmap activity
- Backend security with JWT, token blacklisting, and CORS rules
- Frontend state management via Zustand and drag/drop UI interactions

## Tech Stack

### Backend
- Spring Boot 4.0.3
- Java 25
- PostgreSQL (runtime dependency)
- Redis (runtime dependency via Spring Data Redis)
- JWT authentication using `io.jsonwebtoken`
- Lombok for boilerplate reduction
- Maven build system

### Frontend
- React 19
- Vite
- Tailwind CSS
- Zustand
- React Router DOM
- Recharts
- Axios
- Framer Motion
- @hello-pangea/dnd for drag-and-drop

## Setup

### Prerequisites

- Java 25 or Amazon Corretto 25
- Maven
- Node.js 20+ and npm
- PostgreSQL database
- Redis instance

### Backend Setup

1. Open a terminal in `Backend/`
2. Configure your database and Redis in `src/main/resources/application.properties`
3. Build the backend:

```bash
cd Backend
./mvnw clean package
```

4. Run the backend locally:

```bash
./mvnw spring-boot:run
```

### Frontend Setup

1. Open a terminal in `Frontend/`
2. Install dependencies:

```bash
cd Frontend
npm install
```

3. Start the frontend dev server:

```bash
npm run dev
```

4. Open the app in your browser at the URL shown by Vite.

## Running the Full Application

1. Start the backend server
2. Start the frontend dev server
3. Use the frontend UI to register, log in, and manage routines

> The configured backend CORS policy allows requests from `http://localhost:3000`, `http://localhost:5173`, and `https://routineX10.vercel.app`.

## Backend API Overview

### Authentication
- `POST /api/auth/register` - register a new user
- `POST /api/auth/login` - authenticate and obtain JWT
- `POST /api/auth/logout` - blacklist the current token
- `POST /api/auth/check` - verify token validity and return user profile

### Task Management
- `POST /api/task/create-task` - create one or more routines/tasks
- `PUT /api/task/update/{taskId}` - update a specific task
- `PUT /api/task/update` - replace the current task set
- `DELETE /api/task/delete/{taskId}` - delete a specific task
- `DELETE /api/task/delete` - remove all user routines

### Task Completion
- `GET /api/task-completion/check/{taskId}` - toggle today's completion state
- `GET /api/task-completion/history` - fetch task completion history
- `GET /api/task-completion/stats` - fetch dashboard stats

## Environment Configuration

Update `Backend/src/main/resources/application.properties` with the correct values for:

- datasource URL, username, password
- Redis host and port
- JWT secret and expiration settings
- any other runtime options required by the backend

## Build and Deployment

### Backend Docker

A `Dockerfile` exists in `Backend/` to build and run the backend as a container. It packages the Spring Boot application into the final JAR named `RoutineX10`.

### Frontend Production

Build the frontend for production with:

```bash
cd Frontend
npm run build
```

Then serve the generated static assets with any static host or integrate them into a deployment pipeline.

## Notes

- The backend final JAR output is named `RoutineX10`.
- The frontend currently uses a Vite-based React template and a customized widget/dashboard interface.
- If you add a custom environment or CI/CD pipeline, make sure the frontend and backend base URLs match and that JWT cookies or headers are configured consistently.

## Recommended Workflow

1. Configure backend properties and start PostgreSQL + Redis
2. Run `Backend/mvnw spring-boot:run`
3. Run `Frontend/npm install` and `Frontend/npm run dev`
4. Access the app in the browser, then sign up and begin tracking routines

## License

Add your preferred license here, or remove this section if not needed.
