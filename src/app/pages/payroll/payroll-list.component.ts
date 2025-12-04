import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { Payroll } from "../../models/payroll.model"
import type { Employee } from "../../models/employee.model"

@Component({
  selector: "app-payroll-list",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./payroll-list.component.html",
  styleUrls: ["./payroll-list.component.css"],
})
export class PayrollListComponent implements OnInit {
  payrolls: Payroll[] = []
  filteredPayrolls: Payroll[] = []
  employees: Employee[] = []
  showForm = false
  editingId: number | null = null
  loading = false
  searchText = ""
  filterStatus = ""
  filterMonth = new Date().getMonth() + 1
  filterYear = new Date().getFullYear()

  payrollForm: FormGroup
  statuses = ["pending", "approved", "paid"]

  private mockPayrolls: Payroll[] = [
    {
      id: 1,
      payrollId: 1,
      employeeId: 1,
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
      firstName: "Fatima",
      lastName: "Oueslati",
      month: 12,
      year: 2024,
      baseSalary: 4000,
      allowances: 150,
      deductions: 750,
      taxes: 180,
      netSalary: 3220,
      status: "paid",
      paymentDate: "2024-12-31",
      currency: "TND",
    },
    {
      id: 3,
      payrollId: 3,
      employeeId: 1,
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
  ]

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
  ]

  constructor(private formBuilder: FormBuilder) {
    this.payrollForm = this.createForm()
  }

  ngOnInit(): void {
    this.loadPayrolls()
    this.loadEmployees()
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      employeeId: ["", Validators.required],
      month: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]],
      baseSalary: ["", [Validators.required, Validators.min(0)]],
      allowances: [0, [Validators.required, Validators.min(0)]],
      deductions: [0, [Validators.required, Validators.min(0)]],
      status: ["pending", Validators.required],
    })
  }

  loadPayrolls(): void {
    this.loading = true
    // Load mock payrolls
    this.payrolls = this.mockPayrolls
    this.applyFilters()
    this.loading = false
  }

  loadEmployees(): void {
    // Load mock employees
    this.employees = this.mockEmployees
  }

  applyFilters(): void {
    this.filteredPayrolls = this.payrolls.filter((payroll) => {
      const employee = this.employees.find((e) => e.id === payroll.employeeId)
      const empName = employee ? `${employee.firstName} ${employee.lastName}` : ""

      const matchSearch = empName.toLowerCase().includes(this.searchText.toLowerCase())
      const matchStatus = !this.filterStatus || payroll.status === this.filterStatus
      const matchMonth = this.filterMonth === 0 || payroll.month === this.filterMonth
      const matchYear = this.filterYear === 0 || payroll.year === this.filterYear

      return matchSearch && matchStatus && matchMonth && matchYear
    })
  }

  onFilterChange(): void {
    this.applyFilters()
  }

  getEmployeeName(employeeId: number): string {
    const employee = this.employees.find((e) => e.id === employeeId)
    return employee ? `${employee.firstName} ${employee.lastName}` : "Inconnu"
  }

  openForm(payroll?: Payroll): void {
    this.showForm = true
    if (payroll) {
      this.editingId = payroll.id
      this.payrollForm.patchValue(payroll)
    } else {
      this.payrollForm.reset({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        status: "pending",
        allowances: 0,
        deductions: 0,
      })
      this.editingId = null
    }
  }

  closeForm(): void {
    this.showForm = false
    this.payrollForm.reset()
    this.editingId = null
  }

  savePayroll(): void {
    if (this.payrollForm.invalid) {
      return
    }

    this.loading = true
    const formValue = this.payrollForm.value
    formValue.netSalary = formValue.baseSalary + formValue.allowances - formValue.deductions

    if (this.editingId) {
      // Mock update
      const index = this.mockPayrolls.findIndex((p) => p.id === this.editingId)
      if (index !== -1) {
        this.mockPayrolls[index] = { ...this.mockPayrolls[index], ...formValue }
      }
    } else {
      // Mock create
      const newPayroll: Payroll = {
        ...formValue,
        id: Math.max(...this.mockPayrolls.map((p) => p.id)) + 1,
        payrollId: Math.max(...this.mockPayrolls.map((p) => p.payrollId)) + 1,
        currency: "TND",
      }
      this.mockPayrolls.push(newPayroll)
    }

    this.loadPayrolls()
    this.closeForm()
  }

  approvePayroll(id: number): void {
    this.loading = true
    // Mock approve
    const payroll = this.mockPayrolls.find((p) => p.id === id)
    if (payroll) {
      payroll.status = "validated"
    }
    this.loadPayrolls()
  }

  payPayroll(id: number): void {
    this.loading = true
    // Mock pay
    const payroll = this.mockPayrolls.find((p) => p.id === id)
    if (payroll) {
      payroll.status = "paid"
      payroll.paymentDate = new Date().toISOString().split("T")[0]
    }
    this.loadPayrolls()
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  getStatusClass(status: string): string {
    return `status-${status}`
  }
}
