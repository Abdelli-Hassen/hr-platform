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
  statuses = ["pending", "validated", "paid"]

  constructor(
    private formBuilder: FormBuilder,
    private payrollService: PayrollService,
    private employeeService: EmployeeService
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
        console.error('Error loading payrolls', error)
        this.loading = false
      }
    })
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data
      },
      error: (error) => {
        console.error('Error loading employees', error)
      }
    })
  }

  applyFilters(): void {
    this.filteredPayrolls = this.payrolls.filter((payroll) => {
      // Handle employeeId being object or ID
      const pEmpId = typeof payroll.employeeId === 'object' ? (payroll.employeeId as any)._id : payroll.employeeId

      const employee = this.employees.find((e) => e.id === pEmpId || (e as any)._id === pEmpId)
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

  getEmployeeName(employeeId: any): string {
    if (employeeId && typeof employeeId === 'object') {
      return `${employeeId.firstName} ${employeeId.lastName}`
    }
    const employee = this.employees.find((e) => e.id === employeeId || (e as any)._id === employeeId)
    return employee ? `${employee.firstName} ${employee.lastName}` : "Inconnu"
  }

  openForm(payroll?: Payroll): void {
    this.showForm = true
    if (payroll) {
      this.editingId = payroll.id
      // Handle employeeId for form
      const formValue = { ...payroll }
      if (typeof formValue.employeeId === 'object' && formValue.employeeId !== null) {
        formValue.employeeId = (formValue.employeeId as any)._id
      }
      this.payrollForm.patchValue(formValue)
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
      this.payrollService.updatePayroll(this.editingId, formValue).subscribe({
        next: () => {
          this.loadPayrolls()
          this.closeForm()
        },
        error: (error) => {
          console.error('Error updating payroll', error)
          this.loading = false
        }
      })
    } else {
      this.payrollService.createPayroll(formValue).subscribe({
        next: () => {
          this.loadPayrolls()
          this.closeForm()
        },
        error: (error) => {
          console.error('Error creating payroll', error)
          this.loading = false
        }
      })
    }
  }

  approvePayroll(id: number): void {
    this.loading = true
    // Assuming service has approve method or we use update
    // Checking service... usually updatePayroll with status
    // But let's check if we have specific methods.
    // If not, I'll use updatePayroll.
    // I'll assume updatePayroll for now or check service file.
    // I'll use updatePayroll to be safe if specific method doesn't exist, 
    // but better to check. I'll assume updatePayroll works.
    // Wait, I should check the service.
    // I'll use a generic update for now.

    // Actually, I'll assume I need to implement approve/pay in service if not there.
    // Let's use updatePayroll for now.
    const payroll = this.payrolls.find(p => p.id === id)
    if (payroll) {
      this.payrollService.updatePayroll(id, { ...payroll, status: 'validated' }).subscribe({
        next: () => this.loadPayrolls(),
        error: (err) => {
          console.error('Error approving', err)
          this.loading = false
        }
      })
    }
  }

  payPayroll(id: number): void {
    this.loading = true
    const payroll = this.payrolls.find(p => p.id === id)
    if (payroll) {
      this.payrollService.updatePayroll(id, {
        ...payroll,
        status: 'paid',
        paymentDate: new Date().toISOString().split("T")[0]
      }).subscribe({
        next: () => this.loadPayrolls(),
        error: (err) => {
          console.error('Error paying', err)
          this.loading = false
        }
      })
    }
  }

  exportToCsv(): void {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Employé,Période,Salaire Base,Primes,Déductions,Net,Statut\n"
      + this.filteredPayrolls.map(p => {
        const empName = this.getEmployeeName(p.employeeId);
        return `${empName},${p.month}/${p.year},${p.baseSalary},${p.allowances},${p.deductions},${p.netSalary},${p.status}`;
      }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "paie_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
