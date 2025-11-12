import { Router, type Request, type Response } from "express"

const router = Router()

router.get("/admin/stats", async (_req: Request, res: Response) => {
  try {
    res.json({ employees: 0, departments: 0, pendingLeaves: 0, openJobs: 0 })
  } catch (_) {
    res.json({ employees: 0, departments: 0, pendingLeaves: 0, openJobs: 0 })
  }
})

router.get("/employee/:employeeId/stats", async (_req: Request, res: Response) => {
  try {
    res.json({ leavesTaken: 0, remainingLeave: 0, lastPayrollNet: 0 })
  } catch (_) {
    res.json({ leavesTaken: 0, remainingLeave: 0, lastPayrollNet: 0 })
  }
})

export default router
