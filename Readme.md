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

📡 API Base URL
``` bash
http://localhost:7000/api/v2/job
```

| Method | Endpoint          | Description                 | Access Granted |
| ------ | ----------------- | --------------------------- | -------------- |
| GET    | `/all`            | See all posted jobs         | Employee       |
| POST   | `/post-job`       | Post new job                | Employer       |
| POST   | `/update/id`      | Update job info by Job ID   | Employer       |
| POST   | `/remove/id`      | Remove job by ID            | Employer       |
| POST   | `/my-posted-job`  | See all posted job          | Employer       |
| POST   | `/job-details/id` | See job details by Job ID   | All            |
| POST   | `/received-apps`  | See all users that applied  | Employer       |