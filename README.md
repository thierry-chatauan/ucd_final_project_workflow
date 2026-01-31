# UCD Final Project – Workflow App

A fullstack web application built with **Django** (backend) and **React** (frontend), deployed on **Render**.  
The app allows users to create and complete jobs, while managers can view, edit, and delete them.

---

## 🧰 Technologies Used

- **Frontend:** React (with Vite)
- **Backend:** Django (Python)
- **Database:** PostgreSQL (hosted on Render)
- **Hosting:** Render (for both frontend and backend)

---

## 🌍 Live App

- 🔗 **Frontend:** [https://ucd-final-project-workflow.onrender.com](https://ucd-final-project-workflow.onrender.com)  
- 🔗 **Backend API:** [https://workflow-backend-1jnr.onrender.com](https://workflow-backend-1jnr.onrender.com)

---

## 🧪 Example Users & App Functionality

### 👷 Operator (Regular User)

**Capabilities:**
- Register a new account
- Start and finish jobs
- Edit profile information (e.g., icon, password)
- View only their own jobs

**Demo Credentials:**
- **Username:** `thierry`  
- **Password:** `EasyPass1234`

---

### 🧑‍💼 Manager

**Capabilities:**
- View all jobs created by any user
- Edit and delete any job
- Full admin-level access to job records

**Demo Credentials:**
- **Username:** `thycbs`  
- **Password:** `EasyPass1234`

## ☁️ Deployment Instructions (Render)

This project is deployed on [Render](https://render.com) using two separate services:

- A **Web Service** for the Django backend
- A **Static Site** for the React frontend

---

### 🔙 Backend (Django API)

1. Go to [Render.com](https://render.com) and create a **Web Service**.
2. Connect your GitHub repository and choose the `/backend` folder as the root.
3. Use the following settings:

   - **Build Command:**
     ```
     pip install -r requirements.txt && python manage.py migrate
     ```

   - **Start Command:**
     ```
     gunicorn backend.wsgi
     ```

4. Add the following **Environment Variables** (or copy from `.env.example`):

   - `SECRET_KEY=your-secret-key`
   - `DEBUG=False`
   - `DATABASE_URL=your-database-url` (if using PostgreSQL from Render)
   - `ALLOWED_HOSTS=workflow-backend-1jnr.onrender.com`

5. Once deployed, your backend will be accessible at: https://workflow-backend-1jnr.onrender.com


---

### 🌐 Frontend (React)

1. Create a **Static Site** on Render.
2. Set the root directory to `/frontend`.
3. Use the following settings:

- **Build Command:**
  ```
  npm install && npm run build
  ```

- **Publish Directory:**
  ```
  build/
  ```

4. Add the following **Environment Variable**:

- `REACT_APP_API_URL=https://workflow-backend-1jnr.onrender.com/api/`

5. Once deployed, your frontend will be accessible at: https://ucd-final-project-workflow.onrender.com

