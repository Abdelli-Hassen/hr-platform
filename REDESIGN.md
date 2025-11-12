# HR Platform Redesign Plan

This document defines a complete, beginner-friendly Angular + Express redesign with a unique layout, clear code structure, and a production-ready database for Tunisia (TND). It keeps admin/employee role separation (admins administer, employees self-serve read-only) and covers all HR features: Employees, Payroll, Leaves/Absences, Recruitment, and Dashboards.

## Goals
- Simple, readable structure for beginners
- Full feature coverage with no dead ends
- Unique, fresh layout (no left-only sidebar pattern)
- Clean REST API and DB schema grounded in the provided HR domain

## Monorepo Structure
```
.
├─ backend/
│  ├─ src/
│  │  ├─ server.ts
│  │  ├─ config/
│  │  │  └─ database.ts
│  │  ├─ middleware/
│  │  │  └─ auth.ts
│  │  └─ routes/
│  │     ├─ auth.ts
│  │     ├─ employees.ts
│  │     ├─ payroll.ts
│  │     ├─ leaves.ts
│  │     ├─ recruitment.ts
│  │     └─ dashboards.ts
│  └─ database/
│     ├─ redesign_init.sql  (full schema + seed for TN, TND)
│     └─ README.md          (how to apply schema)
└─ src/app/
   ├─ core/                 (guards, interceptors, layout shell services)
   ├─ shared/               (ui components, pipes, directives, models)
   └─ features/
      ├─ auth/              (login, logout)
      ├─ admin/             (admin shell + nav)
      ├─ me/                (employee self-service shell)
      ├─ employees/         (admin: list, CRUD, contracts, docs)
      ├─ payroll/           (runs, items, adjustments, slips)
      ├─ leaves/            (requests, approvals, balances, absences)
      ├─ recruitment/       (openings, candidates, pipeline)
      └─ dashboards/        (kpis, charts)
```

## Unique Layout (Workspace + Radial Command Bar)
- Header ribbon (top): app title, quick stats, user menu.
- Bottom dock (persistent): feature tabs (Employees, Payroll, Leaves, Recruitment, Dashboard) as large, tactile buttons.
- Workspace (center): card-based panels that can split horizontally/vertically (CSS Grid) for multiple views at once; commands via a radial command bar (floating button) that opens contextual actions.
- Benefits: no left-only sidebar; fast switching; multi-panel productivity.

Implementation outline:
- Two shells: AdminShellComponent and EmployeeShellComponent.
- Shell layout uses CSS Grid:
  - rows: [header 64px, 1fr, dock 72px]
  - columns: [1fr]
- A FloatingActionButtonComponent opens a CommandPaletteComponent with contextual actions per route.

## Angular Routing
- Public: /login
- Admin shell (/admin):
  - /admin/dashboard
  - /admin/employees, /admin/employees/:id, /admin/employees/:id/contracts
  - /admin/payroll, /admin/payroll/runs/:id, /admin/payroll/slips/:employeeId
  - /admin/leaves, /admin/absences
  - /admin/recruitment, /admin/recruitment/openings/:id, /admin/recruitment/candidates/:id
  - /admin/settings
- Employee shell (/me):
  - /me/profile (read-only, all info)
  - /me/contracts (read-only)
  - /me/pay (read-only salary slips)
  - /me/leaves (request/manage personal leaves)

Guards/interceptors:
- AuthGuard, AdminGuard; AuthInterceptor attaches JWT; 401 redirects to /login.

## Data Model Highlights (see SQL for full DDL)
- users (admin/employee/manager), employees (one-to-one with user where applicable)
- departments, jobs, contracts (type, start/end, salary, status)
- payroll_runs, payroll_items (earnings/deductions), salary_slips view
- leaves (requests), leave_balances, absences
- recruitment: job_openings, candidates, candidate_stages
- audit_logs, notifications
- Currency TND, country TN seeded

Admin provisioning flow:
- Admin creates Employee (all required fields).
- System also creates linked user with provided email; initial password defined by the employee on first login via a set-password link or by admin’s temporary password flow.
- Employees can view their data (read-only) and request leaves; admins approve.

Security note: If you must keep plain-text passwords for parity with the current code, maintain exact string match; otherwise switch to bcrypt ASAP.

## REST API (summary)
- POST /api/auth/login -> { token, user }
- GET /api/employees, POST /api/employees, GET/PUT /api/employees/:id
- GET/POST /api/employees/:id/contracts
- GET/POST /api/payroll/runs, POST /api/payroll/runs/:id/calculate, GET /api/payroll/slips/:employeeId
- GET/POST /api/leaves, PUT /api/leaves/:id/approve|reject
- GET/POST /api/absences
- GET/POST /api/recruitment/openings, GET/POST /api/recruitment/candidates
- GET /api/dashboards/kpis (aggregated stats)

## Getting Started
- DB: import backend/database/redesign_init.sql into MySQL (schema human_ressources).
- Backend: npx -y ts-node --transpile-only backend\src\server.ts
- Frontend: npm start (ng serve). Ensure AuthService.apiUrl = http://localhost:3000/api/auth.

## Implementation Guide (Beginner Friendly)
- Each feature has: pages (routable containers), components (dumb UI), services (HTTP), models (interfaces), and optionally state (signals/NgRx if needed).
- Keep components small, presentational; let pages orchestrate services.
- Reuse shared UI for forms, tables, pagination, date pickers.

## Done/Verification Checklist
- [ ] Admin/Employee shells render with unique layout (header + bottom dock + workspace + FAB)
- [ ] All routes reachable from dock or radial commands
- [ ] Employees CRUD incl. full info and contracts
- [ ] Payroll run calculate + slips
- [ ] Leave requests with approvals + balances
- [ ] Recruitment flow from opening to candidate stages
- [ ] Dashboards with KPIs
- [ ] Role-based access enforced
- [ ] DB seeded for TN/TND

```text
Tip: Implement feature-by-feature; use this plan to refactor without breaking existing endpoints.
```
