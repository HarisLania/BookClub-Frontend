# 📘 Book Club Frontend

A lightweight **Angular 21** frontend application for managing **Books** and **Catalogs**, built to consume a Django REST API.

---

## 🚀 Tech Stack

- Angular 21 (Standalone APIs)
- TypeScript
- Angular Signals
- ESLint
- Bootstrap
- ngx-toastr
- Font Awesome
- Ngx-bootstrap

---

## ✨ Features

- Catalog CRUD operations
- Book listing with search & catalog filter
- Modal-based UI
- Signal-based state management
- Runtime API configuration
- Clean, production-ready structure

---

## 📂 Configuration

API base URL is loaded at runtime from:
src/assets/config.json
Example:
```json
{
  "apiBaseUrl": "http://localhost:8000/api"
}
```

## Clone the repository
```bash
git clone https://github.com/HarisLania/BookClub-Frontend.git
cd BookClub-Frontend
```

## Install dependencies
```bash
npm install
```

## Run the application
```bash
ng serve
```

## Access the application
Open your browser and navigate to `http://localhost:4200/`.