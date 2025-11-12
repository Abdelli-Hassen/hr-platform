import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import type { Employee } from "../../models/employee.model"
import type { Payroll } from "../../models/payroll.model"
import type { Leave } from "../../models/leave.model"
import { EmployeeService } from "../../services/employee.service"
import { PayrollService } from "../../services/payroll.service"
import { LeaveService } from "../../services/leave.service"
import { AuthService } from "../../services/auth.service"

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
    private employeeService: EmployeeService,
    private payrollService: PayrollService,
    private leaveService: LeaveService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.currentUser = this.authService.getCurrentUser()
  }

  ngOnInit(): void {
    if (this.currentUser?.id) {
      this.loadEmployeeData()
    }
  }

  loadEmployeeData(): void {
    this.employeeService.getByUserId(this.currentUser!.id).subscribe({
      next: (data) => {
        this.employee = data
        this.loadPayrolls()
        this.loadLeaves()
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.loading = false
      },
    })
  }

  loadPayrolls(): void {
    if (this.employee) {
      this.payrollService.getByEmployeeId(this.employee.id).subscribe({
        next: (data) => {
          this.payrolls = data
        },
        error: (error) => {
          console.error("Erreur:", error)
        },
      })
    }
  }

  loadLeaves(): void {
    if (this.employee) {
      this.leaveService.getLeavesByEmployeeId(this.employee.id).subscribe({
        next: (data) => {
          this.leaves = data
          this.loading = false
        },
        error: (error) => {
          console.error("Erreur:", error)
          this.loading = false
        },
      })
    }
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
