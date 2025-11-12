# HR Platform (Gestion des Employés) — Full Build Specification
Date: 2025-11-12T03:48:57.118Z

This document is a turnkey blueprint to implement a complete Angular + Express HR platform for Tunisia (currency TND), with Admin and Employee roles, unique UI layout (header + bottom dock + workspace + floating command palette), and fully working features: Employees, Payroll, Leaves/Absences, Recruitment, and Dashboards.

## 1. Tech Stack
- Frontend: Angular 18+, Standalone Components, Angular Router, RxJS, Signals (optional), SCSS.
- Backend: Node.js (Express), mysql2/promise, jsonwebtoken, cors, dotenv. Keep plain-text passwords to match current project (switch to bcrypt in production).
- DB: MySQL 8, schema human_ressources.
- Tooling: TypeScript, ts-node, OpenAPI (YAML) for API contract.

## 2. Monorepo Structure
- Frontend: src/app/core, src/app/shared, src/app/features/* (auth, admin, me, employees, payroll, leaves, recruitment, dashboards)
- Backend: backend/src/config, middleware, routes; backend/database (SQL); backend/api/openapi.yaml (API contract)

## 3. Roles & Permissions
- Admin: Full CRUD on employees, contracts, payroll runs/items, leaves approvals, absences, recruitment, dashboards.
- Employee: Read-only profile, contracts, salary slips; can submit leave requests; cannot edit profile fields.
- Manager (optional): Same as Admin for team scope (out of MVP unless requested).

## 4. Unique Layout
- Header (top 64px): app title, quick KPIs, user menu.
- Workspace (center): card/grid panels; supports split views (CSS Grid gaps), list-detail, and modal sheets.
- Bottom Dock (72px): large feature tabs (Employees, Payroll, Leaves, Recruitment, Dashboard) with labels.
- Floating Action Button (FAB): opens a command palette with context-aware actions.

## 5. Navigation & Routes
- Public: /login
- Admin Shell (/admin): /admin/dashboard, /admin/employees, /admin/employees/:id, /admin/employees/:id/contracts, /admin/payroll, /admin/payroll/runs/:id, /admin/payroll/slips/:employeeId, /admin/leaves, /admin/absences, /admin/recruitment, /admin/recruitment/openings/:id, /admin/recruitment/candidates/:id, /admin/settings
- Employee Shell (/me): /me/profile, /me/contracts, /me/pay, /me/leaves
- Guards: AuthGuard, AdminGuard; Interceptor attaches Authorization: Bearer <token> and redirects 401 to /login.

## 6. Data Model (TS Interfaces)
- See src/app/shared/models/models.ts for all interfaces: User, Employee, Contract, PayrollRun, PayrollItem, LeaveBalance, Leave, Absence, JobOpening, Candidate, Notification, AuditLog, AuthResponse, LoginRequest.

## 7. Database
- Apply backend/database/redesign_init.sql to MySQL. It creates tables (users, employees, departments, jobs, contracts, payroll_runs, payroll_items, leave_balances, leaves, absences, job_openings, candidates, notifications, audit_logs) and seeds admin + sample employee.
- Admin credentials (seed): admin@hrplatform.tn / admin123 (plain text).

## 8. API Contract
- OpenAPI spec: backend/api/openapi.yaml defines all endpoints, request/response schemas, and errors.
- Auth
  - POST /api/auth/login: body LoginRequest -> 200 { token, user }, 401 invalid credentials.
- Employees
  - GET /api/employees?search=&page=&pageSize=; POST /api/employees; GET/PUT /api/employees/{id}; GET/POST /api/employees/{id}/contracts
- Payroll
  - GET/POST /api/payroll/runs; POST /api/payroll/runs/{id}/calculate; GET /api/payroll/slips/{employeeId}
- Leaves & Absences
  - GET/POST /api/leaves; PUT /api/leaves/{id}/approve|reject; GET/POST /api/absences
- Recruitment
  - GET/POST /api/recruitment/openings; GET/POST /api/recruitment/candidates
- Dashboards
  - GET /api/dashboards/kpis

## 9. Validation Rules (examples)
- Employee: first_name, last_name, email (RFC5322), hire_date (<= today), job_id (exists), department_id (exists), base_salary >= 0, currency='TND'.
- Leave: start_date <= end_date; duration against leave_balances; approvals require admin.
- Payroll: run (month 1..12, year current..current+1); calculate sets items and net_salary = base + allowances - deductions - taxes.

## 10. UI Components (Shared)
- Button, Input, Select, DatePicker, Table (sortable, pageable), Card, ModalSheet, FAB, CommandPalette, KPI Tile, Toast.
- Keep components dumb; pages orchestrate services.

## 11. i18n & UX
- Default language French; provide translation keys for major labels; date/number formats for Tunisia; currency TND.
- Consistent empty states, loading skeletons, error toasts.

## 12. Non-Functional
- Performance: lazy-load feature routes; onPush change detection; code-split heavy pages.
- Security: JWT expiry 24h; CORS allow Angular dev host; do not log passwords in prod.
- Testing: Unit tests for services and guards; e2e smoke for auth and main flows.

## 13. Environment
- Backend .env: PORT=3000, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME=human_ressources, JWT_SECRET=dev-secret.
- Frontend environment.ts: apiBase='http://localhost:3000'; endpoints composed in services.

## 14. Acceptance Criteria
- Admin can: CRUD employee, add contract, run payroll, approve leave, view KPIs.
- Employee can: login, view profile/contracts/pay, submit leave; cannot edit profile fields.
- All listed endpoints return correct data and errors; UI shows no dead-end pages; dock + FAB works across features.

## 15. Build & Run
- DB: import redesign_init.sql
- Backend: npx -y ts-node --transpile-only backend\\src\\server.ts
- Frontend: npm start; login as admin@hrplatform.tn / admin123

## 16. Delivery Checklist
- OpenAPI matches implementation; all services typed; guards enforce roles; styles responsive (>=1280px desktop focus).
- Seed data present; README includes quickstart; screenshots of key pages attached on delivery.
