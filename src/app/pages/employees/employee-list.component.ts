import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { Employee } from "../../models/employee.model"
import type { Department } from "../../models/department.model"
import { EmployeeService } from "../../services/employee.service"
import { DepartmentService } from "../../services/department.service"

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
  departments: Department[] = []
  showForm = false
  editingId: any = null
  loading = false
  searchText = ""
  filterDepartment = ""
  filterStatus = ""

  employeeForm: FormGroup

  contractTypes = ["CDI", "CDD", "Stage"]
  statuses = ["active", "inactive", "on_leave"]

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {
    this.employeeForm = this.createForm()
  }

  ngOnInit(): void {
    this.loadEmployees()
    this.loadDepartments()
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
      password: [""] // Optional, only for creation
    })
  }

  visiblePasswords: Set<string> = new Set();

  togglePassword(id: any): void {
    if (this.visiblePasswords.has(id)) {
      this.visiblePasswords.delete(id);
    } else {
      this.visiblePasswords.add(id);
    }
  }

  isPasswordVisible(id: any): boolean {
    return this.visiblePasswords.has(id);
  }

  loadEmployees(): void {
    this.loading = true
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data
        this.applyFilters()
        this.loading = false
      },
      error: (error) => {
        console.error('Error loading employees', error)
        this.loading = false
      }
    })
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data
      },
      error: (error) => {
        console.error('Error loading departments', error)
      }
    })
  }

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter((emp) => {
      const matchSearch =
        emp.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        emp.email.toLowerCase().includes(this.searchText.toLowerCase())

      // Check against department ID or populated department object
      const empDeptId = typeof emp.departmentId === 'object' ? (emp.departmentId as any)._id : emp.departmentId
      const matchDept = !this.filterDepartment || empDeptId === this.filterDepartment

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
      this.editingId = employee._id || employee.id
      // Handle departmentId for form population
      const formValue = { ...employee }
      if (typeof formValue.departmentId === 'object' && formValue.departmentId !== null) {
        formValue.departmentId = (formValue.departmentId as any)._id
      }

      // Format dates for input type="date" (YYYY-MM-DD)
      if (formValue.birthDate) {
        formValue.birthDate = new Date(formValue.birthDate).toISOString().split('T')[0];
      }
      if (formValue.hireDate) {
        formValue.hireDate = new Date(formValue.hireDate).toISOString().split('T')[0];
      }

      // Don't populate password in form, keep it empty for updates
      formValue.password = '';

      this.employeeForm.patchValue(formValue)
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
      this.employeeService.updateEmployee(this.editingId, formValue).subscribe({
        next: () => {
          this.loadEmployees()
          this.closeForm()
        },
        error: (error) => {
          console.error('Error updating employee', error)
          this.loading = false
        }
      })
    } else {
      this.employeeService.createEmployee(formValue).subscribe({
        next: () => {
          this.loadEmployees()
          this.closeForm()
        },
        error: (error) => {
          console.error('Error creating employee', error)
          this.loading = false
        }
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
          console.error('Error deleting employee', error)
          this.loading = false
        }
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
