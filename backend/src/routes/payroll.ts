import { Router, type Request, type Response } from "express"
import { query } from "../config/database"
import { authMiddleware, adminOnly } from "../middleware/auth"

const router = Router()

// Get payroll records
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { employeeId, month, year } = req.query
    let sql = `SELECT p.*, e.first_name, e.last_name FROM payroll p
               LEFT JOIN employees e ON p.employee_id = e.employee_id WHERE 1=1`
    const params: any[] = []

    if (employeeId) {
      sql += " AND p.employee_id = ?"
      params.push(employeeId)
    }
    if (month) {
      sql += " AND p.month = ?"
      params.push(month)
    }
    if (year) {
      sql += " AND p.year = ?"
      params.push(year)
    }

    const [rows] = await query(sql, params)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des fiches de paie" })
  }
})

// Create payroll
router.post("/", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { employeeId, month, year, baseSalary, allowances, deductions, taxes } = req.body
    const netSalary = baseSalary + allowances - deductions - taxes

    await query(
      `INSERT INTO payroll (employee_id, month, year, base_salary, allowances, deductions, taxes, net_salary, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'calculated')`,
      [employeeId, month, year, baseSalary, allowances, deductions, taxes, netSalary],
    )

    res.status(201).json({ message: "Fiche de paie créée avec succès" })
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la fiche de paie" })
  }
})

// Update payroll status
router.put("/:id", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, paymentDate } = req.body

    await query("UPDATE payroll SET status = ?, payment_date = ? WHERE payroll_id = ?", [
      status,
      paymentDate || null,
      id,
    ])

    res.json({ message: "Fiche de paie mise à jour" })
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" })
  }
})

export default router
