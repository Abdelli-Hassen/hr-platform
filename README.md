# HR Platform - Plateforme RH

A modern, full-stack Human Resources Management System built with Angular and Node.js, featuring a beautiful Glassmorphism UI design with dark mode support.

![Angular](https://img.shields.io/badge/Angular-18-DD0031?style=flat&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)

## ✨ Features

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Premium aesthetic with frosted glass effects
- **Dark Mode** - Seamless theme switching with localStorage persistence
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Enhanced user experience with fluid transitions

### 👥 Employee Management
- Complete CRUD operations for employee records
- Automatic user account creation with password management
- Department and position tracking
- Employee status monitoring (active, on leave, inactive)

### 💰 Payroll Management
- Payroll calculation and tracking
- Multiple status workflow (pending, validated, paid)
- Salary breakdown and deductions
- Payment history and records

### 📅 Leave Management
- Leave request submission and approval workflow
- Multiple leave types (vacation, sick, personal)
- Automatic employee status updates
- Leave balance tracking
- Absence monitoring

### 💼 Recruitment
- Job opening management
- Candidate tracking system
- Application status workflow
- Interview scheduling
- Hiring process management

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Employee)
- Secure password handling with bcrypt
- Protected routes and API endpoints

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular 18
- **Language**: TypeScript
- **Styling**: CSS with CSS Variables
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Forms**: Reactive Forms

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for cross-origin requests

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Abdelli-Hassen/platform_rh.git
cd platform_rh
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hr_platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 5. Seed the Database (Optional)
```bash
cd backend
npm run seed
```

This will create:
- Admin user: `admin@hrplatform.tn` / `admin123`
- Sample employees and data

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
npm start
# or
ng serve
```
Frontend runs on `http://localhost:4200`

### Production Build

**Frontend:**
```bash
ng build --configuration production
```

**Backend:**
```bash
cd backend
npm start
```

## 📁 Project Structure

```
platform_rh/
├── src/                          # Angular frontend source
│   ├── app/
│   │   ├── components/          # Reusable components
│   │   ├── layouts/             # Layout components (admin, employee)
│   │   ├── models/              # TypeScript interfaces
│   │   ├── pages/               # Page components
│   │   ├── services/            # Angular services
│   │   └── styles/              # Global styles and variables
│   └── ...
├── backend/                      # Node.js backend
│   ├── src/
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Express middleware
│   │   ├── scripts/             # Utility scripts (seed, etc.)
│   │   └── server.ts            # Express server entry point
│   └── ...
└── ...
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Payroll
- `GET /api/payroll` - Get all payroll records
- `POST /api/payroll` - Create payroll
- `PUT /api/payroll/:id` - Update payroll status

### Leaves
- `GET /api/leaves` - Get all leave requests
- `POST /api/leaves` - Create leave request
- `PATCH /api/leaves/:id/approve` - Approve leave
- `PATCH /api/leaves/:id/reject` - Reject leave

### Recruitment
- `GET /api/recruitment/openings` - Get job openings
- `POST /api/recruitment/openings` - Create job opening
- `GET /api/recruitment/candidates` - Get candidates
- `POST /api/recruitment/candidates` - Add candidate
- `PATCH /api/recruitment/candidates/:id/status` - Update candidate status

## 🎨 Design System

### Color Palette
- **Primary**: Indigo to Pink gradient (`#6366f1` → `#ec4899`)
- **Success**: Green (`#22c55e`)
- **Warning**: Amber (`#f59e0b`)
- **Danger**: Red (`#ef4444`)

### Dark Mode
The application features a comprehensive dark mode that affects:
- All page backgrounds
- Cards and containers
- Tables and forms
- Modals and overlays
- Navigation elements

Toggle dark mode using the moon/sun icon in the admin sidebar.

## 👤 Default Credentials

After running the seed script:

**Admin Account:**
- Email: `admin@hrplatform.tn`
- Password: `admin123`

**Employee Account:**
- Email: `employee@hrplatform.tn`
- Password: `emp123`

> ⚠️ **Important**: Change these credentials in production!

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes with middleware
- Role-based access control
- CORS configuration
- Input validation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Abdelli Hassen**

## 🙏 Acknowledgments

- Angular team for the amazing framework
- MongoDB for the flexible database solution
- The open-source community for inspiration and tools
