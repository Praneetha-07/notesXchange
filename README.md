# NotesXchange — Student Notes Exchange Portal

A full-stack MERN web app for students to upload, browse, search, and vote on study materials.

---

## Project Structure

```
notes-exchange/
├── backend/
│   ├── models/         # Mongoose schemas (User, Note, Vote)
│   ├── routes/         # Express routes (auth, notes, votes)
│   ├── middleware/     # JWT auth + Multer file upload
│   ├── uploads/        # Uploaded files stored here
│   ├── server.js       # Entry point
│   ├── .env.example    # Environment variable template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/            # Axios instance
    │   ├── components/     # Navbar, NoteCard
    │   ├── context/        # AuthContext (global user state)
    │   ├── pages/          # BrowsePage, UploadPage, LoginPage, RegisterPage, createNote, noteFeed, viewNote
    │   ├── App.js          # Routes
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm

---

## Setup & Run

### 1. Backend

```bash
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET

# Create uploads folder
mkdir -p uploads

# Start the backend (development)
npm run dev

# Or production
npm start
```

Backend runs on: `http://localhost:5001`

---

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the React dev server
npm start
```

Frontend runs on: `http://localhost:3000`
The `"proxy": "http://localhost:5001"` in `package.json` routes `/api` calls to the backend automatically.

---

## Environment Variables (backend/.env)

| Variable   | Description                       | Example                                  |
| ---------- | --------------------------------- | ---------------------------------------- |
| PORT       | Port the server runs on           | 5000                                     |
| MONGO_URI  | MongoDB connection string         | mongodb://localhost:27017/notes-exchange |
| JWT_SECRET | Secret key for signing JWT tokens | change_this_to_a_long_random_string      |
| NODE_ENV   | Environment                       | development                              |

---

## API Endpoints

### Auth

| Method | Endpoint           | Description      | Auth |
| ------ | ------------------ | ---------------- | ---- |
| POST   | /api/auth/register | Create account   | No   |
| POST   | /api/auth/login    | Login            | No   |
| GET    | /api/auth/me       | Get current user | Yes  |

### Notes

| Method | Endpoint       | Description                             | Auth |
| ------ | -------------- | --------------------------------------- | ---- |
| GET    | /api/notes     | Browse notes (search, filter, paginate) | No   |
| GET    | /api/notes/:id | Get single note                         | No   |
| POST   | /api/notes     | Upload a note (multipart/form-data)     | Yes  |
| DELETE | /api/notes/:id | Delete your own note                    | Yes  |

**GET /api/notes query params:**

- `search` — text search across title, subject, subject code
- `semester` — filter by semester (e.g. `Sem 3`)
- `branch` — filter by branch (e.g. `CSE`)
- `sort` — `votes` (default) or `newest`
- `page` — page number (default: 1)
- `limit` — results per page (default: 20)

### Votes

| Method | Endpoint           | Description        | Auth |
| ------ | ------------------ | ------------------ | ---- |
| POST   | /api/votes/:noteId | Upvote or downvote | Yes  |

Body: `{ "voteType": "upvote" }` or `{ "voteType": "downvote" }`
Voting the same type again toggles it off. Switching type updates accordingly.

---

## Database Collections (MongoDB)

### Users

```json
{ "_id", "name", "email", "password" (hashed), "branch", "semester", "createdAt" }
```

### Notes

```json
{ "_id", "title", "subject", "subjectCode", "semester", "branch", "fileUrl", "fileType", "uploadedBy", "voteCount", "createdAt" }
```

### Votes

```json
{ "_id", "userId", "noteId", "voteType" }
```

Unique index on `(userId, noteId)` — one vote per user per note.

---

## Features

- JWT authentication (register, login, protected routes)
- File upload — PDF and images (Multer, 10MB limit)
- Browse and filter by semester, branch
- Search by title, subject, subject code
- Upvote / downvote with toggle (one vote per user per note)
- Pagination
- Responsive, clean UI

---

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 18, React Router v6           |
| Styling  | Plain CSS-in-JS (no library needed) |
| HTTP     | Axios                               |
| Backend  | Node.js, Express.js                 |
| Auth     | JWT + bcryptjs                      |
| Uploads  | Multer                              |
| Database | MongoDB + Mongoose                  |
