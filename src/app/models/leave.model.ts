export interface Leave {
  id: number
  leaveId: number
  employeeId: number
  firstName: string
  lastName: string
  leaveType: "annual" | "sick" | "unpaid" | "maternity" | "special"
  startDate: string
  endDate: string
  reason?: string
  status: "pending" | "approved" | "rejected" | "cancelled"
  approvalDate?: string
  rejectionReason?: string
}

export interface Absence {
  id: number
  employeeId: number
  date: string
  type: "absent" | "late" | "excused"
  reason?: string
  createdAt: string
}
