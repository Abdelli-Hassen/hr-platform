import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import type { Employee } from "../../models/employee.model"
import type { Payroll } from "../../models/payroll.model"
import type { Leave } from "../../models/leave.model"
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
    // Mock employee data - no API calls
    this.employee = {
      id: 2,
      employeeId: 2,
      userId: 2,
      firstName: "Marwan",
      lastName: "Benali",
      email: "m.benali@hrplatform.tn",
      phoneNumber: "+216 95 123 456",
      hireDate: "2021-03-15",
      jobId: "J001",
      jobTitle: "Senior Developer",
      salary: 4500,
      departmentId: 1,
      departmentName: "IT",
      cin: "12345678",
      birthDate: "1990-01-15",
      nationality: "Tunisian",
      address: "123 Rue de la Paix",
      city: "Tunis",
      postalCode: "1000",
      contractType: "CDI",
      contractStart: "2021-03-15",
      status: "active",
      createdAt: "2021-03-15T00:00:00Z",
      updatedAt: "2024-12-04T00:00:00Z",
    }
    this.loadPayrolls()
    this.loadLeaves()
  }

  loadPayrolls(): void {
    // Mock payroll data - no API calls
    this.payrolls = [
      {
        id: 1,
        payrollId: 1,
        employeeId: 2,
        firstName: "Marwan",
        lastName: "Benali",
        month: 12,
        year: 2024,
        baseSalary: 4500,
        allowances: 200,
        deductions: 850,
        taxes: 200,
        netSalary: 3650,
        status: "paid",
        paymentDate: "2024-12-31",
        currency: "TND",
      },
      {
        id: 2,
        payrollId: 2,
        employeeId: 2,
        firstName: "Marwan",
        lastName: "Benali",
        month: 11,
        year: 2024,
        baseSalary: 4500,
        allowances: 200,
        deductions: 850,
        taxes: 200,
        netSalary: 3650,
        status: "paid",
        paymentDate: "2024-11-30",
        currency: "TND",
      },
      {
        id: 3,
        payrollId: 3,
        employeeId: 2,
        firstName: "Marwan",
        lastName: "Benali",
        month: 10,
        year: 2024,
        baseSalary: 4500,
        allowances: 200,
        deductions: 850,
        taxes: 200,
        netSalary: 3650,
        status: "paid",
        paymentDate: "2024-10-31",
        currency: "TND",
      },
    ]
  }

  loadLeaves(): void {
    // Mock leave data - no API calls
    this.leaves = [
      {
        id: 1,
        leaveId: 1,
        employeeId: 2,
        firstName: "Marwan",
        lastName: "Benali",
        leaveType: "annual",
        startDate: "2024-12-20",
        endDate: "2024-12-25",
        reason: "Holiday",
        status: "approved",
        approvalDate: "2024-12-10",
      },
      {
        id: 2,
        leaveId: 2,
        employeeId: 2,
        firstName: "Marwan",
        lastName: "Benali",
        leaveType: "sick",
        startDate: "2024-11-10",
        endDate: "2024-11-11",
        reason: "Medical appointment",
        status: "approved",
        approvalDate: "2024-11-09",
      },
    ]
    this.loading = false
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
