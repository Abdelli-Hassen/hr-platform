export interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  totalPayroll: number
  totalLeaves: number
  totalRecruitments: number
  pendingLeaves?: number
  pendingPayroll?: number
  openPositions?: number
  newCandidates?: number
  recentHires?: number
}
