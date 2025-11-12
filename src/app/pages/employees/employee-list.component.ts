import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { Employee } from "../../models/employee.model"
import { EmployeeService } from "../../services/employee.service"

@Component({
  selector: "app-employee-list",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = []
  filteredEmployees: Employee[] = []
  showForm = false
  editingId: number | null = null
  loading = false
  searchText = ""
  filterDepartment = ""
  filterStatus = ""

  employeeForm: FormGroup

  departments = ["IT", "RH", "Finance", "Ventes", "Marketing", "Opérations"]
  contractTypes = ["CDI", "CDD", "Stage"]
  statuses = ["active", "inactive", "on_leave"]

  constructor(
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
  ) {
    this.employeeForm = this.createForm()
  }

  ngOnInit(): void {
    this.loadEmployees()
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", Validators.required],
      address: ["", Validators.required],
      cin: ["", Validators.required],
      birthDate: ["", Validators.required],
      hireDate: ["", Validators.required],
      jobTitle: ["", Validators.required],
      departmentId: ["", Validators.required],
      salary: ["", [Validators.required, Validators.min(0)]],
      contractType: ["CDI", Validators.required],
      status: ["active", Validators.required],
    })
  }

  loadEmployees(): void {
    this.loading = true
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data
        this.applyFilters()
        this.loading = false
      },
      error: (error) => {
        console.error("Erreur lors du chargement des employés:", error)
        this.loading = false
      },
    })
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter((emp) => {
      const matchSearch =
        emp.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        emp.email.toLowerCase().includes(this.searchText.toLowerCase())

      const matchDept = !this.filterDepartment || emp.departmentId.toString() === this.filterDepartment
      const matchStatus = !this.filterStatus || emp.status === this.filterStatus

      return matchSearch && matchDept && matchStatus
    })
  }

  onSearchChange(): void {
    this.applyFilters()
  }

  onFilterChange(): void {
    this.applyFilters()
  }

  openForm(employee?: Employee): void {
    this.showForm = true
    if (employee) {
      this.editingId = employee.id
      this.employeeForm.patchValue(employee)
    } else {
      this.employeeForm.reset({ status: "active", contractType: "CDI" })
      this.editingId = null
    }
  }

  closeForm(): void {
    this.showForm = false
    this.employeeForm.reset()
    this.editingId = null
  }

  saveEmployee(): void {
    if (this.employeeForm.invalid) {
      return
    }

    this.loading = true
    const formValue = this.employeeForm.value

    if (this.editingId) {
      this.employeeService.update(this.editingId, formValue).subscribe({
        next: () => {
          this.loadEmployees()
          this.closeForm()
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour:", error)
          this.loading = false
        },
      })
    } else {
      this.employeeService.create(formValue).subscribe({
        next: () => {
          this.loadEmployees()
          this.closeForm()
        },
        error: (error) => {
          console.error("Erreur lors de la création:", error)
          this.loading = false
        },
      })
    }
  }

  deleteEmployee(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé?")) {
      this.loading = true
      this.employeeService.delete(id).subscribe({
        next: () => {
          this.loadEmployees()
        },
        error: (error) => {
          console.error("Erreur lors de la suppression:", error)
          this.loading = false
        },
      })
    }
  }

  getStatusBadgeClass(status: string): string {
    return `badge badge-${status}`
  }

  formatSalary(salary: number): string {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(salary)
  }
}
