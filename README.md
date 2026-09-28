# Task Manager Web App

A modern, full-stack task management application built with **Django REST Framework** on the backend and **React.js** (Vite) on the frontend. Features a minimalist, modern UI built with **Tailwind CSS v4** and **shadcn/ui**, complete with light/dark theme switching, an interactive 750ms hold-to-delete mechanism with a circular progress ring, task filtering, instant search, and completion progress tracking.

---

## 📁 Repository Structure

```
/backend/         # Django project (Python 3.10+)
  ├── manage.py
  ├── requirements.txt
  ├── task_manager/       # Django project settings & root URL config
  │   ├── __init__.py
  │   ├── settings.py
  │   ├── urls.py
  │   └── wsgi.py
  └── tasks/              # Django app
      ├── __init__.py
      ├── admin.py
      ├── apps.py
      ├── models.py
      ├── serializers.py
      ├── tests.py
      ├── urls.py
      └── views.py

/frontend/        # React.js project (Node 18+)
  ├── index.html
  ├── package.json
  ├── vite.config.js
  ├── jsconfig.json
  └── src/
      ├── main.jsx
      ├── App.jsx
      ├── api.js
      ├── index.css
      ├── hooks/
      │   ├── useHoldProgress.js
      │   ├── useTaskFilter.js
      │   └── useTasks.js
      └── components/
          ├── EditDialog.jsx
          ├── HoldDeleteButton.jsx
          ├── TaskForm.jsx
          ├── TaskItem.jsx
          ├── TaskList.jsx
          ├── ThemeToggle.jsx
          └── ui/              # shadcn/ui components (Nova preset)
              ├── badge.jsx
              ├── button.jsx
              ├── card.jsx
              ├── checkbox.jsx
              ├── dialog.jsx
              ├── input.jsx
              ├── label.jsx
              ├── separator.jsx
              ├── sonner.jsx
              └── textarea.jsx

README.md         # This file
```

---

## 🚀 Backend Setup (Django)

### Prerequisites
- Python **3.10+**
- `pip` (bundled with Python)

### Steps

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create & activate a virtual environment
python -m venv venv

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# macOS / Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run database migrations
python manage.py makemigrations tasks
python manage.py migrate

# 5. (Optional) Create a superuser for the Django admin
python manage.py createsuperuser

# 6. Start the development server
python manage.py runserver

# 7. Run automated test suite
python manage.py test tasks
```

The API will be available at **http://localhost:8000**.
The automated test suite verifies all CRUD endpoints, serialization validation, and status codes.

---

## 🖥️ Frontend Setup (React + Vite)

### Prerequisites
- Node.js **18+**
- npm **9+**

### Steps

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

The app will open at **http://localhost:5173**. Make sure the Django backend is running simultaneously on port 8000.

---

## 🔌 API Endpoints

| Method   | Endpoint          | Description                          | Request Body                                    |
|----------|-------------------|--------------------------------------|-------------------------------------------------|
| `GET`    | `/tasks/`         | List all tasks (newest first)        | —                                               |
| `POST`   | `/tasks/`         | Create a new task                    | `{ "title": "...", "description": "..." }`      |
| `GET`    | `/tasks/{id}/`    | Retrieve a single task by ID         | —                                               |
| `PUT`    | `/tasks/{id}/`    | Update title & description only      | `{ "title": "...", "description": "..." }`      |
| `PATCH`  | `/tasks/{id}/`    | Toggle `completed` status only       | `{ "completed": true/false }`                   |
| `DELETE` | `/tasks/{id}/`    | Delete a task                        | —                                               |

### Response Codes

| Code  | Meaning                      |
|-------|------------------------------|
| `200` | Success (list / retrieve / update) |
| `201` | Created (new task)           |
| `204` | No Content (delete)          |
| `400` | Bad Request (validation)     |
| `404` | Not Found                    |

---

## 📝 Notes & Assumptions

### Explicit `ViewSet` (not `ModelViewSet`)

As required, the backend uses `viewsets.ViewSet` — **not** `ModelViewSet`. Every CRUD method (`list`, `create`, `retrieve`, `update`, `partial_update`, `destroy`) is manually implemented with explicit queryset handling, serializer selection, and response construction.

### Isolated PATCH Logic

The `PATCH` endpoint is strictly limited to toggling the `completed` field. It uses a dedicated `TaskToggleSerializer` that only exposes the `completed` field, ensuring no other fields can be modified through this route. This is a deliberate design decision to separate "editing content" (`PUT`) from "changing status" (`PATCH`).

### Purpose-Built Serializers

Four serializers serve distinct roles:
- **`TaskSerializer`** — read-only output (all fields)
- **`TaskCreateSerializer`** — creation (title + description)
- **`TaskUpdateSerializer`** — full update (title + description)
- **`TaskToggleSerializer`** — partial update (completed only)

### CORS Configuration

`django-cors-headers` is installed and configured in `settings.py`. Only the Vite dev server origins (`localhost:5173` / `127.0.0.1:5173`) are allowed. For production, update `CORS_ALLOWED_ORIGINS` accordingly.

### Frontend Error & Loading States

Every API interaction surfaces explicit loading indicators (spinners inline with buttons and list items) and error messages (toast notifications, inline field errors, and a full-screen retry state when the initial fetch fails).

### Database

SQLite is used as the default database for simplicity. The database file (`db.sqlite3`) is created automatically upon running migrations. For production, swap to PostgreSQL or another database in `settings.py`.

### Automated Test Suite
An automated test suite is provided in [`backend/tasks/tests.py`](file:///backend/tasks/tests.py). It tests all 6 ViewSet actions:
- `test_list_tasks`: verifies listing all tasks with 200 OK
- `test_create_task`: verifies task creation and 201 Created
- `test_create_task_validation_error`: verifies 400 Bad Request when required title is missing
- `test_retrieve_task`: verifies single task retrieval by ID
- `test_update_task`: verifies PUT updates title and description
- `test_toggle_task_completed`: verifies PATCH toggles completed boolean
- `test_delete_task`: verifies task deletion and 204 No Content

Run with: `python manage.py test tasks`

### Interactive 750ms Hold-to-Delete
To protect against accidental task deletions without cumbersome confirmation dialog popups, the task delete button requires a deliberate **750ms hold**:
- 750ms provides an intentional, comfortable threshold that completely prevents accidental clicks while allowing the user to watch the circular progress ring sweep around.
- An animated circular SVG progress ring sweeps 360° around the trash icon as the user holds down (via mouse, touch, or Space/Enter).
- Releasing early (<750ms) instantly cancels deletion and snaps the ring back to 0.
- Completing the 750ms hold triggers immediate deletion, complete with an optional subtle haptic tick.
- Action buttons are vertically centered within each task card for clean visual balance.

### Light & Dark Theme Toggle
The application supports seamless switching between light and dark themes via `next-themes`:
- The theme toggle button is located in the header with animated Sun/Moon transitions.
- The user's theme selection is stored in `localStorage` and persists across sessions.

---

## 🛠️ Tech Stack Summary

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Backend    | Django 4.2, Django REST Framework             |
| Database   | SQLite (default)                              |
| Frontend   | React 19, Vite 8, Axios                       |
| UI / Styles| Tailwind CSS v4, shadcn/ui (Nova preset)      |
| Components | Radix UI primitives, Lucide Icons, Sonner     |
| Typography | Geist Variable Font                           |
| Themes     | `next-themes` (light / dark toggle)           |
| CORS       | django-cors-headers                           |

---

## License

This project is provided as-is for operational testing purposes.
