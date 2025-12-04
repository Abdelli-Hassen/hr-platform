import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { Employee } from "../../models/employee.model"

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

  private mockEmployees: Employee[] = [
    {
      id: 1,
      employeeId: 1,
      userId: 1,
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
    },
    {
      id: 2,
      employeeId: 2,
      userId: 2,
      firstName: "Fatima",
      lastName: "Oueslati",
      email: "f.oueslati@hrplatform.tn",
      phoneNumber: "+216 95 234 567",
      hireDate: "2022-06-01",
      jobId: "J002",
      jobTitle: "HR Manager",
      salary: 4000,
      departmentId: 2,
      departmentName: "RH",
      cin: "87654321",
      birthDate: "1992-05-20",
      nationality: "Tunisian",
      address: "456 Avenue Mohamed",
      city: "Ariana",
      postalCode: "2080",
      contractType: "CDI",
      contractStart: "2022-06-01",
      status: "active",
      createdAt: "2022-06-01T00:00:00Z",
      updatedAt: "2024-12-04T00:00:00Z",
    },
    {
      id: 3,
      employeeId: 3,
      userId: 3,
      firstName: "Ali",
      lastName: "Khouni",
      email: "a.khouni@hrplatform.tn",
      phoneNumber: "+216 95 345 678",
      hireDate: "2020-01-10",
      jobId: "J003",
      jobTitle: "Accountant",
      salary: 3500,
      departmentId: 3,
      departmentName: "Finance",
      cin: "11223344",
      birthDate: "1988-07-22",
      nationality: "Tunisian",
      address: "789 Rue Mongi Slim",
      city: "Ben Arous",
      postalCode: "2015",
      contractType: "CDI",
      contractStart: "2020-01-10",
      status: "active",
      createdAt: "2020-01-10T00:00:00Z",
      updatedAt: "2024-12-04T00:00:00Z",
    },
    {
      id: 4,
      employeeId: 4,
      userId: 4,
      firstName: "Sarah",
      lastName: "Ben Salah",
      email: "s.bensalah@hrplatform.tn",
      phoneNumber: "+216 95 456 789",
      hireDate: "2023-02-15",
      jobId: "J004",
      jobTitle: "Sales Manager",
      salary: 4200,
      departmentId: 4,
      departmentName: "Ventes",
      cin: "55667788",
      birthDate: "1995-03-10",
      nationality: "Tunisian",
      address: "321 Boulevard de la Rép",
      city: "Sfax",
      postalCode: "3000",
      contractType: "CDI",
      contractStart: "2023-02-15",
      status: "active",
      createdAt: "2023-02-15T00:00:00Z",
      updatedAt: "2024-12-04T00:00:00Z",
    },
    {
      id: 5,
      employeeId: 5,
      userId: 5,
      firstName: "Hassan",
      lastName: "Trabelsi",
      email: "h.trabelsi@hrplatform.tn",
      phoneNumber: "+216 95 567 890",
      hireDate: "2021-09-01",
      jobId: "J005",
      jobTitle: "Operations Lead",
      salary: 3800,
      departmentId: 5,
      departmentName: "Opérations",
      cin: "99001122",
      birthDate: "1989-11-30",
      nationality: "Tunisian",
      address: "654 Rue Bab Menara",
      city: "Sousse",
      postalCode: "4000",
      contractType: "CDI",
      contractStart: "2021-09-01",
      status: "active",
      createdAt: "2021-09-01T00:00:00Z",
      updatedAt: "2024-12-04T00:00:00Z",
    },
  ]

  constructor(private formBuilder: FormBuilder) {
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
    // Load mock employees - no API calls
    this.employees = this.mockEmployees
    this.applyFilters()
    this.loading = false
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
      // Mock update
      const index = this.mockEmployees.findIndex((emp) => emp.id === this.editingId)
      if (index !== -1) {
        this.mockEmployees[index] = { ...this.mockEmployees[index], ...formValue }
      }
    } else {
      // Mock create
      const newEmployee: Employee = {
        ...formValue,
        id: Math.max(...this.mockEmployees.map((e) => e.id)) + 1,
        employeeId: Math.max(...this.mockEmployees.map((e) => e.employeeId)) + 1,
        userId: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      this.mockEmployees.push(newEmployee)
    }

    this.loadEmployees()
    this.closeForm()
  }

  deleteEmployee(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé?")) {
      this.loading = true
      // Mock delete
      this.mockEmployees = this.mockEmployees.filter((emp) => emp.id !== id)
      this.loadEmployees()
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
