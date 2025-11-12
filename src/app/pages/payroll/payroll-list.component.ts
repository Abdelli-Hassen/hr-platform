import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { Payroll } from "../../models/payroll.model"
import type { Employee } from "../../models/employee.model"
import { PayrollService } from "../../services/payroll.service"
import { EmployeeService } from "../../services/employee.service"

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

  constructor(
    private payrollService: PayrollService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
  ) {
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
    this.payrollService.getAll().subscribe({
      next: (data) => {
        this.payrolls = data
        this.applyFilters()
        this.loading = false
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.loading = false
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
      this.payrollService.update(this.editingId, formValue).subscribe({
        next: () => {
          this.loadPayrolls()
          this.closeForm()
        },
        error: (error) => {
          console.error("Erreur:", error)
          this.loading = false
        },
      })
    } else {
      this.payrollService.create(formValue).subscribe({
        next: () => {
          this.loadPayrolls()
          this.closeForm()
        },
        error: (error) => {
          console.error("Erreur:", error)
          this.loading = false
        },
      })
    }
  }

  approvePayroll(id: number): void {
    this.loading = true
    this.payrollService.approve(id).subscribe({
      next: () => {
        this.loadPayrolls()
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.loading = false
      },
    })
  }

  payPayroll(id: number): void {
    this.loading = true
    this.payrollService.pay(id).subscribe({
      next: () => {
        this.loadPayrolls()
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.loading = false
      },
    })
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
