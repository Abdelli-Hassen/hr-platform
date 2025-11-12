import { Router, type Request, type Response } from "express"
import { query } from "../config/database"
import { authMiddleware, managerOrAdmin } from "../middleware/auth"

const router = Router()

// Get leaves
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.query
    let sql = `SELECT l.*, e.first_name, e.last_name FROM leaves l
               LEFT JOIN employees e ON l.employee_id = e.employee_id WHERE 1=1`
    const params: any[] = []

    if (employeeId) {
      sql += " AND l.employee_id = ?"
      params.push(employeeId)
    }

    const [rows] = await query(sql, params)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des congés" })
  }
})

// Request leave
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body

    await query(
      `INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [employeeId, leaveType, startDate, endDate, reason],
    )

    res.status(201).json({ message: "Demande de congé créée" })
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la demande" })
  }
})

// Approve/Reject leave
router.put("/:id", authMiddleware, managerOrAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, rejectionReason } = req.body

    await query("UPDATE leaves SET status = ?, rejection_reason = ?, approval_date = NOW() WHERE leave_id = ?", [
      status,
      rejectionReason || null,
      id,
    ])

    res.json({ message: "Congé mis à jour" })
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" })
  }
})

export default router
