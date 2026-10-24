# courselling-backend

A course-selling platform backend built with Node.js, Express, and MongoDB. It supports user and admin authentication with JWTs, course creation and management, and course purchasing.

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB (via Mongoose 8) |
| Authentication | JSON Web Tokens (`jsonwebtoken`) — separate secrets for users and admins |
| Password hashing | `bcrypt` |
| Validation | `zod` |
| Environment config | `dotenv` |
| Development | `nodemon` |

## Project Structure

```
courselling-backend/
├── index.js            # App entry point — connects to MongoDB and starts the server
├── config.js           # Reads JWT secrets from environment variables
├── db.js               # Mongoose models: User, Admin, Course, Purchase
├── middleware/
│   ├── user.js         # userAuth — verifies user JWT from the `token` header
│   └── admin.js        # adminAuth — verifies admin JWT from the `token` header
├── routes/
│   ├── user.js         # User sign-up, sign-in, purchased courses
│   ├── courses.js      # Course preview and purchasing
│   └── admin.js        # Admin sign-up, sign-in, course CRUD
└── package.json
```

## Getting Started

### Prerequisites

- Node.js
- A running MongoDB instance (local or hosted, e.g. MongoDB Atlas)

### Installation

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with the following variables:

   ```env
   MONGO_URL=mongodb://localhost:27017/courselling
   JWT_userSECRET=your_user_jwt_secret
   JWT_adminSECRET=your_admin_jwt_secret
   ```

   > Use different values for `JWT_userSECRET` and `JWT_adminSECRET` so user tokens and admin tokens are not interchangeable.

### Running the Server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

The server listens on **port 3000** and connects to MongoDB on startup.

## API Reference

All request and response bodies are JSON. User tokens and admin tokens are sent in the **`token` header** (not `Authorization`).

### User Routes (`/user`)

#### `POST /user/sign-up` — Public

Registers a new user.

```json
{
  "email": "jane@example.com",
  "password": "secret123",
  "fname": "Jane",
  "lname": "Doe"
}
```

Validation rules: valid email, password between 5 and 20 characters, first/last name at least 2 characters.

- `200` → `{ "message": "sign up successful" }`
- `400` → validation error
- `409` → `{ "message": "Email already registered" }`
- `500` → server error

#### `POST /user/sign-in` — Public

Authenticates a user and returns a JWT.

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

- `200` → `{ "token": "<jwt>", "message": "Sign in successful" }`
- `400` → validation error
- `401` → `{ "message": "Invalid credentials" }`

#### `GET /user/purchase-course` — Requires user token

Returns all courses the authenticated user has purchased.

```
token: <user_jwt>
```

- `200` → array of purchases and their corresponding courses:

```json
{
  "purchases": [ { "_id": "...", "userId": "...", "courseId": "..." } ],
  "courses":   [ { "_id": "...", "title": "...", "description": "...", "imageUrl": "...", "price": 499, "creatorid": "..." } ]
}
```

### Course Routes (`/courses`)

#### `POST /courses/purchase-course` — Requires user token

Purchases a course for the authenticated user.

```
token: <user_jwt>
```

```json
{
  "courseId": "665f1c2a9d3b4a5e6f7a8b9c"
}
```

- `200` → `Purchase successful`
- `400` → validation error (courseId must be a 24-character ObjectId string)
- `404` → `{ "message": "Course not found" }`
- `409` → `{ "message": "Course already purchased" }`
- `500` → server error

#### `GET /courses/preview` — Public

Lists all available courses.

- `200` → array of all course documents

### Admin Routes (`/admin`)

#### `POST /admin/admin-signup` — Public

Registers a new admin. Same validation rules as user sign-up:

```json
{
  "email": "admin@example.com",
  "password": "adminpass",
  "fname": "Ada",
  "lname": "Admin"
}
```

- `200` → `{ "message": "Sign up successful" }`
- `400` → validation error
- `409` → `{ "message": "Email already registered" }`

#### `POST /admin/admin-signin` — Public

Authenticates an admin and returns a JWT signed with the admin secret.

```json
{
  "email": "admin@example.com",
  "password": "adminpass"
}
```

- `200` → `{ "token": "<jwt>", "message": "Sign in successful" }`
- `400` → validation error
- `401` → `{ "message": "Invalid credentials" }`

#### `POST /admin/create-course` — Requires admin token

Creates a new course. The creator is recorded from the token.

```
token: <admin_jwt>
```

```json
{
  "title": "Intro to Node.js",
  "description": "Learn Node.js fundamentals",
  "price": 499,
  "imageUrl": "https://example.com/node-course.png"
}
```

- `200` → `{ "message": "Course created successfully", "creatorid": "<course_id>" }`

#### `PUT /admin/create-course` — Requires admin token

Updates an existing course. Only the admin who created the course can update it.

```
token: <admin_jwt>
```

```json
{
  "courseId": "665f1c2a9d3b4a5e6f7a8b9c",
  "title": "Intro to Node.js (updated)",
  "description": "Updated description",
  "price": 599,
  "imageUrl": "https://example.com/node-course-v2.png"
}
```

- `200` → `{ "message": "Course updated successfully", "courseId": "<course_id>" }`

#### `GET /admin/create-course/all-courses` — Requires admin token

Lists all courses created by the authenticated admin.

```
token: <admin_jwt>
```

- `200` → `{ "message": "All Courses fetched successfully", "course": [ ... ] }`

## Data Models

Defined in `db.js`:

| Model | Fields |
|---|---|
| **User** | `fname`, `lname`, `email` (unique), `password` (bcrypt-hashed) |
| **Admin** | `email` (unique), `fname`, `lname`, `password` (bcrypt-hashed) |
| **Course** | `title`, `description`, `imageUrl`, `price`, `creatorid` (references the admin who created it) |
| **Purchase** | `userId` (ref `User`), `courseId` (ref `Course`) |

## Notes

- Protected routes read the JWT from the `token` request header; invalid or missing tokens result in a `401 Unauthorized` response.
- Passwords are hashed with bcrypt before being stored; plain-text passwords are never persisted.
- The port (`3000`) is currently hardcoded in `index.js`.
- The MongoDB connection uses the `MONGO_URL` environment variable.
