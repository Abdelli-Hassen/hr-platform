export interface Payroll {
  id: number
  payrollId: number
  employeeId: number
  firstName: string
  lastName: string
  month: number
  year: number
  baseSalary: number
  allowances: number
  deductions: number
  taxes: number
  netSalary: number
  status: "pending" | "calculated" | "validated" | "paid"
  paymentDate?: string
  currency: string
  notes?: string
}
