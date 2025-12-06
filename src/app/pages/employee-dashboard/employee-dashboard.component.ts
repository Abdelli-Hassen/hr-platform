import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import type { Employee } from "../../models/employee.model"
import type { Payroll } from "../../models/payroll.model"
import type { Leave } from "../../models/leave.model"
import { AuthService } from "../../services/auth.service"
import { EmployeeService } from "../../services/employee.service"
import { PayrollService } from "../../services/payroll.service"
import { LeaveService } from "../../services/leave.service"

@Component({
  selector: "app-employee-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./employee-dashboard.component.html",
  styleUrls: ["./employee-dashboard.component.css"],
})
export class EmployeeDashboardComponent implements OnInit {
  currentUser: any = null
  employee: Employee | null = null
  payrolls: Payroll[] = []
  leaves: Leave[] = []
  loading = true
  activeTab: "profile" | "payroll" | "leaves" = "profile"

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private payrollService: PayrollService,
    private leaveService: LeaveService,
    private router: Router,
  ) {
    this.currentUser = this.authService.getCurrentUser()
  }

  ngOnInit(): void {
    if (this.currentUser) {
      this.loadEmployeeData()
    }
  }

  loadEmployeeData(): void {
    // We need to find the employee record for this user
    // The auth service might have it, or we fetch by user ID
    if (this.currentUser.employee) {
      // If we have employee details in user object
      this.employeeService.getEmployeeById(this.currentUser.employee.employee_id || this.currentUser.employee._id).subscribe({
        next: (emp) => {
          this.employee = emp
          this.loadPayrolls(emp.id)
          this.loadLeaves(emp.id)
          this.loading = false
        },
        error: (err) => {
          console.error("Error loading employee", err)
          this.loading = false
        }
      })
    } else {
      // Fallback if no employee link in user object (shouldn't happen with latest auth fix)
      this.loading = false
    }
  }

  loadPayrolls(employeeId: number): void {
    this.payrollService.getByEmployeeId(employeeId).subscribe({
      next: (data) => {
        this.payrolls = data
      },
      error: (err) => console.error("Error loading payrolls", err)
    })
  }

  loadLeaves(employeeId: number): void {
    this.leaveService.getLeavesByEmployeeId(employeeId).subscribe({
      next: (data) => {
        this.leaves = data
      },
      error: (err) => console.error("Error loading leaves", err)
    })
  }

  switchTab(tab: "profile" | "payroll" | "leaves"): void {
    this.activeTab = tab
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/login"])
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-TN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}
