import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { Leave, Absence } from "../../models/leave.model"
import type { Employee } from "../../models/employee.model"
import { LeaveService } from "../../services/leave.service"
import { EmployeeService } from "../../services/employee.service"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-leave-list",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./leave-list.component.html",
  styleUrls: ["./leave-list.component.css"],
})
export class LeaveListComponent implements OnInit {
  leaves: Leave[] = []
  filteredLeaves: Leave[] = []
  absences: Absence[] = []
  employees: Employee[] = []

  showLeaveForm = false
  showAbsenceForm = false
  loading = false
  searchText = ""
  filterStatus = ""
  filterType = ""
  activeTab: "leaves" | "absences" = "leaves"

  leaveForm: FormGroup
  absenceForm: FormGroup

  leaveTypes = ["annual", "sick", "unpaid", "maternity", "special"]
  leaveStatuses = ["pending", "approved", "rejected"]
  absenceTypes = ["absent", "late", "excused"]

  currentUser: any = null

  constructor(
    private leaveService: LeaveService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.currentUser = this.authService.getCurrentUser()
    this.leaveForm = this.createLeaveForm()
    this.absenceForm = this.createAbsenceForm()
  }

  createLeaveForm(): FormGroup {
    return this.formBuilder.group({
      employeeId: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      leaveType: ["annual", Validators.required],
      reason: ["", Validators.required],
      status: ["pending", Validators.required],
    })
  }

  createAbsenceForm(): FormGroup {
    return this.formBuilder.group({
      employeeId: ["", Validators.required],
      date: ["", Validators.required],
      type: ["absent", Validators.required],
      reason: [""],
    })
  }

  ngOnInit(): void {
    this.loadLeaves()
    this.loadAbsences()
    this.loadEmployees()
  }

  loadLeaves(): void {
    this.loading = true
    this.leaveService.getLeaves().subscribe({
      next: (data) => {
        this.leaves = data
        this.applyFilters()
        this.loading = false
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.loading = false
      },
    })
  }

  loadAbsences(): void {
    this.leaveService.getAbsences().subscribe({
      next: (data) => {
        this.absences = data
      },
      error: (error) => {
        console.error("Erreur:", error)
      },
    })
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data
      },
      error: (error) => {
        console.error("Erreur:", error)
      },
    })
  }

  applyFilters(): void {
    this.filteredLeaves = this.leaves.filter((leave) => {
      const employee = this.employees.find((e) => e.id === leave.employeeId)
      const empName = employee ? `${employee.firstName} ${employee.lastName}` : ""

      const matchSearch = empName.toLowerCase().includes(this.searchText.toLowerCase())
      const matchStatus = !this.filterStatus || leave.status === this.filterStatus
      const matchType = !this.filterType || leave.leaveType === this.filterType

      return matchSearch && matchStatus && matchType
    })
  }

  onFilterChange(): void {
    this.applyFilters()
  }

  switchTab(tab: "leaves" | "absences"): void {
    this.activeTab = tab
    this.showLeaveForm = false
    this.showAbsenceForm = false
  }

  openLeaveForm(): void {
    this.showLeaveForm = true
    if (this.currentUser?.role === "employee") {
      const employee = this.employees.find((e) => e.userId === this.currentUser?.id)
      if (employee) {
        this.leaveForm.patchValue({ employeeId: employee.id, status: "pending" })
      }
    }
  }

  closeLeaveForm(): void {
    this.showLeaveForm = false
    this.leaveForm.reset({ status: "pending", leaveType: "annual" })
  }

  openAbsenceForm(): void {
    this.showAbsenceForm = true
  }

  closeAbsenceForm(): void {
    this.showAbsenceForm = false
    this.absenceForm.reset()
  }

  saveLeave(): void {
    if (this.leaveForm.invalid) {
      return
    }

    this.loading = true
    this.leaveService.createLeave(this.leaveForm.value).subscribe({
      next: () => {
        this.loadLeaves()
        this.closeLeaveForm()
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.loading = false
      },
    })
  }

  saveAbsence(): void {
    if (this.absenceForm.invalid) {
      return
    }

    this.loading = true
    this.leaveService.recordAbsence(this.absenceForm.value).subscribe({
      next: () => {
        this.loadAbsences()
        this.closeAbsenceForm()
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.loading = false
      },
    })
  }

  approveLeave(id: number): void {
    this.loading = true
    this.leaveService.approveLeave(id).subscribe({
      next: () => {
        this.loadLeaves()
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.loading = false
      },
    })
  }

  rejectLeave(id: number): void {
    this.loading = true
    this.leaveService.rejectLeave(id).subscribe({
      next: () => {
        this.loadLeaves()
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.loading = false
      },
    })
  }

  getEmployeeName(employeeId: number): string {
    const employee = this.employees.find((e) => e.id === employeeId)
    return employee ? `${employee.firstName} ${employee.lastName}` : "Inconnu"
  }

  getStatusBadgeClass(status: string): string {
    return `badge badge-${status}`
  }

  calculateDays(start: string, end: string): number {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }
}
