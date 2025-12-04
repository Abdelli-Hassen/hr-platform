import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { Leave, Absence } from "../../models/leave.model"
import type { Employee } from "../../models/employee.model"
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

  private mockLeaves: Leave[] = [
    {
      id: 1,
      leaveId: 1,
      employeeId: 1,
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
      firstName: "Fatima",
      lastName: "Oueslati",
      leaveType: "sick",
      startDate: "2024-12-15",
      endDate: "2024-12-16",
      reason: "Medical",
      status: "pending",
    },
  ]

  private mockAbsences: Absence[] = [
    {
      id: 1,
      employeeId: 1,
      date: "2024-12-05",
      type: "late",
      reason: "Traffic",
      createdAt: "2024-12-05T09:30:00Z",
    },
  ]

  constructor(
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
    // Load mock leaves
    this.leaves = this.mockLeaves
    this.applyFilters()
    this.loading = false
  }

  loadAbsences(): void {
    // Load mock absences
    this.absences = this.mockAbsences
  }

  loadEmployees(): void {
    // No employees needed for now
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
    const formValue = this.leaveForm.value
    const newLeave: Leave = {
      ...formValue,
      id: Math.max(...this.mockLeaves.map((l) => l.id), 0) + 1,
      leaveId: Math.max(...this.mockLeaves.map((l) => l.leaveId), 0) + 1,
    }
    this.mockLeaves.push(newLeave)
    this.loadLeaves()
    this.closeLeaveForm()
  }

  saveAbsence(): void {
    if (this.absenceForm.invalid) {
      return
    }

    this.loading = true
    const formValue = this.absenceForm.value
    const newAbsence: Absence = {
      ...formValue,
      id: Math.max(...this.mockAbsences.map((a) => a.id), 0) + 1,
      createdAt: new Date().toISOString(),
    }
    this.mockAbsences.push(newAbsence)
    this.loadAbsences()
    this.closeAbsenceForm()
  }

  approveLeave(id: number): void {
    this.loading = true
    // Mock approve
    const leave = this.mockLeaves.find((l) => l.id === id)
    if (leave) {
      leave.status = "approved"
      leave.approvalDate = new Date().toISOString().split("T")[0]
    }
    this.loadLeaves()
  }

  rejectLeave(id: number): void {
    this.loading = true
    // Mock reject
    const leave = this.mockLeaves.find((l) => l.id === id)
    if (leave) {
      leave.status = "rejected"
    }
    this.loadLeaves()
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
