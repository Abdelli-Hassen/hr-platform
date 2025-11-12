import { Component, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../../services/auth.service"
import { EmployeeService } from "../../../services/employee.service"
import { PayrollService } from "../../../services/payroll.service"
import { LeaveService } from "../../../services/leave.service"
import type { Employee } from "../../../models/employee.model"
import type { Payroll } from "../../../models/payroll.model"
import type { Leave } from "../../../models/leave.model"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-employee-dashboard",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./employee-dashboard.component.html",
  styleUrls: ["./employee-dashboard.component.css"],
})
export class EmployeeDashboardComponent implements OnInit {
  currentUser: any
  activeTab = "overview"

  employeeData: Employee | null = null
  myPayrolls: Payroll[] = []
  myLeaves: Leave[] = []

  showRequestLeave = false
  leaveForm!: FormGroup

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private payrollService: PayrollService,
    private leaveService: LeaveService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()

    this.leaveForm = this.fb.group({
      leaveType: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      reason: [""],
    })

    this.loadEmployeeData()
  }

  loadEmployeeData(): void {
    const employeeId = this.currentUser?.employee?.employee_id

    if (employeeId) {
      this.employeeService.getEmployeeById(employeeId).subscribe((data) => {
        this.employeeData = data
      })

      this.payrollService.getPayrollRecords(employeeId).subscribe((data) => {
        this.myPayrolls = data
      })

      this.leaveService.getLeaves(employeeId).subscribe((data) => {
        this.myLeaves = data
      })
    }
  }

  requestLeave(): void {
    if (this.leaveForm.invalid) {
      return
    }

    const employeeId = this.currentUser?.employee?.employee_id
    const leaveRequest = {
      ...this.leaveForm.value,
      employeeId,
    }

    this.leaveService.requestLeave(leaveRequest).subscribe({
      next: () => {
        alert("Demande de congé soumise")
        this.showRequestLeave = false
        this.leaveForm.reset()
        this.loadEmployeeData()
      },
      error: (err) => {
        alert("Erreur: " + err.error?.error)
      },
    })
  }

  getYearsOfService(): number {
    if (!this.employeeData?.hireDate) return 0
    const hireDate = new Date(this.employeeData.hireDate)
    const now = new Date()
    return Math.floor((now.getTime() - hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  }

  getMonthName(month: number): string {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"]
    return months[month - 1] || ""
  }

  getDaysDifference(startDate: string, endDate: string): number {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1
  }

  getLeaveTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      annual: "Congés Annuels",
      sick: "Maladie",
      unpaid: "Non Payé",
      maternity: "Maternité",
      special: "Spécial",
    }
    return labels[type] || type
  }

  getLeaveStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pending: "En Attente",
      approved: "Approuvé",
      rejected: "Rejeté",
      cancelled: "Annulé",
    }
    return labels[status] || status
  }

  getPayrollStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pending: "En Attente",
      calculated: "Calculée",
      validated: "Validée",
      paid: "Payée",
    }
    return labels[status] || status
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/login"])
  }
}
