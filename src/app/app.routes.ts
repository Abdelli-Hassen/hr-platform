import type { Routes } from "@angular/router"
import { AuthGuard } from "./guards/auth.guard"
import { LoginComponent } from "./pages/login/login.component"
import { AdminDashboardComponent } from "./pages/admin-dashboard/admin-dashboard.component"
import { EmployeeDashboardComponent } from "./pages/employee-dashboard/employee-dashboard.component"
import { EmployeeListComponent } from "./pages/employees/employee-list.component"
import { PayrollListComponent } from "./pages/payroll/payroll-list.component"
import { LeaveListComponent } from "./pages/leaves/leave-list.component"
import { RecruitmentComponent } from "./pages/recruitment/recruitment.component"
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component"

export const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    path: "admin",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: "admin" },
    children: [
      { path: "", component: AdminDashboardComponent },
      { path: "employees", component: EmployeeListComponent },
      { path: "payroll", component: PayrollListComponent },
      { path: "leaves", component: LeaveListComponent },
      { path: "recruitment", component: RecruitmentComponent },
    ],
  },
  {
    path: "employee",
    canActivate: [AuthGuard],
    data: { role: "employee" },
    component: EmployeeDashboardComponent,
  },
  { path: "**", redirectTo: "login" },
]
