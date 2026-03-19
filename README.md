<h2 align="center"> Notes API (Local + GitHub Auth)</h2>

## Overview

A simple and secure backend API built with **Node.js, Express, and MongoDB**.
It supports **local login (email/password)** and **GitHub OAuth**, and allows users to create and manage their own private notes using JWT authentication.

---

## Setup

```bash
npm init -y
npm install express mongoose bcrypt jsonwebtoken dotenv passport passport-github2
```

### `.env`

```
PORT=3000
MONGO_URI=your_uri
JWT_SECRET=your_secret
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/users/auth/github/callback
```

---

## Structure

```
config/      → DB & Passport setup  
models/      → User, Note schemas  
routes/      → Auth & Notes APIs  
utils/       → JWT helper functions  
server.js    → App entry point  
```

---

## Models

* **User**
  * username (required, unique)
  * email (required, unique, validated)
  * password (min 5 chars, required only if no GitHub login)
  * githubId (unique, used for OAuth)

 Passwords are hashed automatically before saving using bcrypt.
A custom method is used to compare passwords during login.

* **Note**

  * title (required, trimmed)
  * content (required)
  * createdAt (default: current date)
  * user (ObjectId reference to User, required)

---

## Authentication

* **POST `/api/users/register`** → create user
* **POST `/api/users/login`** → returns JWT

JWT is used to authenticate requests for protected routes.

---

## GitHub OAuth

* **GET `/api/users/auth/github`** → redirects to GitHub
* **GET `/api/users/auth/github/callback`** → logs in user & returns JWT

Handles both existing users and new user creation.

---

## Notes API (Protected)

All routes require:

```
Authorization: Bearer <token>
```

* **POST `/api/notes`** → create note
* **GET `/api/notes`** → get user’s notes
* **GET `/api/notes/:id`** → get single note
* **PUT `/api/notes/:id`** → update note
* **DELETE `/api/notes/:id`** → delete note

Users can only access and modify their own notes.

---

## Run

```bash
npm run dev
```

Server: http://localhost:3000
