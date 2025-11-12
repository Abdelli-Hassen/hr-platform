export interface Employee {
  id: number
  employeeId: number
  userId: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  hireDate: string
  jobId: string
  jobTitle: string
  salary: number
  commissionPct?: number
  departmentId: number
  departmentName: string
  managerId?: number
  cin: string
  birthDate: string
  nationality: string
  address: string
  city: string
  postalCode: string
  contractType: "CDI" | "CDD" | "Stage"
  contractStart: string
  contractEnd?: string
  status?: string
  createdAt: string
  updatedAt: string
}
