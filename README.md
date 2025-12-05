## Smart Expense Tracker (MERN)

Smart Expense Tracker is a production-style MERN app to track daily expenses with authentication, CRUD, filters, and analytics charts.

### Tech Stack
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt, CORS, morgan
- **Frontend**: React (Vite), React Router, Tailwind CSS, Recharts, Axios, react-hot-toast

---

### 1. Project Structure

- `server/` – Express API
  - `config/db.js` – MongoDB connection
  - `models/User.js`, `models/Expense.js`
  - `controllers/authController.js`, `controllers/expenseController.js`
  - `routes/authRoutes.js`, `routes/expenseRoutes.js`
  - `middleware/authMiddleware.js`, `middleware/errorMiddleware.js`
  - `server.js`
- `client/` – React frontend (Vite)
  - `src/pages` – `Login`, `Register`, `Dashboard`
  - `src/components` – `Navbar`, `ExpenseForm`, `ExpenseTable`, `ChartsSection`, `Spinner`
  - `src/context` – `AuthContext`
  - `src/utils` – `api.js`

---

### 2. Environment Variables

Create a `.env` file **in `server/`**:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB_NAME=smart-expense-tracker
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Create a `.env` file **in `client/`**:

```bash
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Install & Run

From the project root (`/home/pritam/Desktop/exp`):

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (in a new terminal)
cd client
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

### 4. MongoDB Schemas (Examples)

**User**

```js
{
  name: String,
  email: String, // unique
  password: String, // hashed with bcrypt
  createdAt: Date,
  updatedAt: Date
}
```

**Expense**

```js
{
  title: String,
  amount: Number,
  category: 'Food' | 'Travel' | 'Shopping' | 'Bills' | 'Other',
  date: Date,
  note: String,
  userId: ObjectId, // ref: 'User'
  createdAt: Date,
  updatedAt: Date
}
```

---

### 5. API Summary

Base URL (dev): `http://localhost:5000/api`

- **Auth**
  - `POST /auth/register` – body: `{ name, email, password }` → `{ user, token }`
  - `POST /auth/login` – body: `{ email, password }` → `{ user, token }`
  - `GET /auth/me` – header: `Authorization: Bearer <token>` → `{ user }`
- **Expenses** (all require `Authorization: Bearer <token>`)
  - `GET /expenses?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&category=Food|...|All`
  - `POST /expenses` – `{ title, amount, category, date, note }`
  - `PUT /expenses/:id` – same fields as POST (partial allowed)
  - `DELETE /expenses/:id`
  - `GET /expenses/analytics?month=MM&year=YYYY` – returns totals, category breakdown, and monthly trend.

---

### 6. Notes

- JWT is stored in `localStorage` on the client and sent via `Authorization: Bearer` header.
- Protected routes on frontend use `AuthContext` and a `ProtectedRoute` wrapper in `App.jsx`.
- UI is responsive with Tailwind and includes toasts, loading spinner, charts, modal form, and sortable table.


