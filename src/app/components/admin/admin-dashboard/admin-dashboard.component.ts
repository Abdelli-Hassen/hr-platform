import { Component, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../../services/auth.service"
import { EmployeeService } from "../../../services/employee.service"
import { PayrollService } from "../../../services/payroll.service"
import { LeaveService } from "../../../services/leave.service"
import { RecruitmentService } from "../../../services/recruitment.service"
import type { Employee } from "../../../models/employee.model"
import type { Payroll } from "../../../models/payroll.model"
import type { Leave } from "../../../models/leave.model"
import type { JobOpening, Candidate } from "../../../models/recruitment.model"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  currentUser: any
  activeTab = "overview"
  recruitmentTab = "openings"

  employees: Employee[] = []
  payrolls: Payroll[] = []
  leaves: Leave[] = []
  jobOpenings: JobOpening[] = []
  candidates: Candidate[] = []

  employeeCount = 0
  payrollCount = 0
  pendingLeavesCount = 0
  candidateCount = 0

  showAddEmployee = false
  showAddPayroll = false
  showAddJobOpening = false

  employeeForm!: FormGroup
  selectedMonth = ""
  selectedYear = "2024"
  selectedLeaveStatus = "pending"

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private payrollService: PayrollService,
    private leaveService: LeaveService,
    private recruitmentService: RecruitmentService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()

    this.employeeForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
      hireDate: ["", Validators.required],
      jobId: ["", Validators.required],
      departmentId: ["", Validators.required],
      salary: ["", [Validators.required, Validators.min(0)]],
    })

    this.loadData()
  }

  loadData(): void {
    this.employeeService.getAllEmployees().subscribe((data) => {
      this.employees = data
      this.employeeCount = data.length
    })

    this.payrollService.getPayrollRecords().subscribe((data) => {
      this.payrolls = data
      this.payrollCount = data.length
    })

    this.leaveService.getLeaves().subscribe((data) => {
      this.leaves = data
      this.pendingLeavesCount = data.filter((l) => l.status === "pending").length
    })

    this.recruitmentService.getJobOpenings().subscribe((data) => {
      this.jobOpenings = data
    })

    this.recruitmentService.getCandidates().subscribe((data) => {
      this.candidates = data
      this.candidateCount = data.length
    })
  }

  addEmployee(): void {
    if (this.employeeForm.invalid) {
      return
    }

    this.employeeService.createEmployee(this.employeeForm.value).subscribe({
      next: () => {
        alert("Employé créé avec succès")
        this.showAddEmployee = false
        this.employeeForm.reset()
        this.loadData()
      },
      error: (err) => {
        alert("Erreur lors de la création: " + err.error?.error)
      },
    })
  }

  editEmployee(employee: Employee): void {
    // Implement edit functionality
  }

  deleteEmployee(id: number): void {
    if (confirm("Êtes-vous sûr?")) {
      // Implement delete functionality
    }
  }

  approveLeave(leaveId: number): void {
    this.leaveService.updateLeaveStatus(leaveId, "approved").subscribe({
      next: () => {
        alert("Congé approuvé")
        this.loadData()
      },
    })
  }

  rejectLeave(leaveId: number): void {
    this.leaveService.updateLeaveStatus(leaveId, "rejected").subscribe({
      next: () => {
        alert("Congé rejeté")
        this.loadData()
      },
    })
  }

  validatePayroll(payrollId: number): void {
    this.payrollService.updatePayroll(payrollId, { status: "validated" }).subscribe({
      next: () => {
        alert("Fiche validée")
        this.loadData()
      },
    })
  }

  getLeaveTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      annual: "Congés Annuels",
      sick: "Congés Maladie",
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

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/login"])
  }
}
