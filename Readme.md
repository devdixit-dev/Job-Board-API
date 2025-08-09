# Job Board API
A backend API for user authentication and account management, built for a job board application.

📦 Installation
```bash
npm install
```

▶️ Running the Server
```bash
npm run dev
```

📡 API Base URL
``` bash
http://localhost:7000/api/v1/auth
```

| Method | Endpoint          | Description                 |
| ------ | ----------------- | --------------------------- |
| POST   | `/register`       | Register a new user         |
| POST   | `/verification`   | Send verification email/OTP |
| POST   | `/login`          | User login                  |
| POST   | `/verify-email`   | Verify email address        |
| POST   | `/verify-otp`     | Verify OTP code             |
| POST   | `/reset-password` | Reset account password      |
| POST   | `/logout`         | Logout user                 |