import { Router, type Request, type Response } from "express"
import { query } from "../config/database"
import { authMiddleware, adminOnly, managerOrAdmin } from "../middleware/auth"

const router = Router()

// Get job openings
router.get("/openings", authMiddleware, async (req: Request, res: Response) => {
  try {
    const [rows] = await query(
      `SELECT jo.*, d.department_name FROM job_openings jo
       LEFT JOIN departments d ON jo.department_id = d.department_id
       ORDER BY jo.created_date DESC`,
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des offres" })
  }
})

// Create job opening
router.post("/openings", authMiddleware, adminOnly, async (req: Request, res: Response) => {
  try {
    const { jobTitle, departmentId, positionCount, requiredExperience, requiredQualifications, salaryMin, salaryMax } =
      req.body

    await query(
      `INSERT INTO job_openings 
       (job_title, department_id, position_count, required_experience, required_qualifications, salary_min, salary_max, created_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        jobTitle,
        departmentId,
        positionCount,
        requiredExperience,
        requiredQualifications,
        salaryMin,
        salaryMax,
        req.userId,
      ],
    )

    res.status(201).json({ message: "Offre créée avec succès" })
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de l'offre" })
  }
})

// Get candidates
router.get("/candidates", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { jobOpeningId } = req.query
    let sql = `SELECT c.*, jo.job_title FROM candidates c
               LEFT JOIN job_openings jo ON c.job_opening_id = jo.job_opening_id WHERE 1=1`
    const params: any[] = []

    if (jobOpeningId) {
      sql += " AND c.job_opening_id = ?"
      params.push(jobOpeningId)
    }

    const [rows] = await query(sql, params)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des candidats" })
  }
})

// Add candidate
router.post("/candidates", async (req: Request, res: Response) => {
  try {
    const { jobOpeningId, firstName, lastName, email, phone, experienceYears, currentPosition, currentCompany } =
      req.body

    await query(
      `INSERT INTO candidates 
       (job_opening_id, first_name, last_name, email, phone, experience_years, current_position, current_company, application_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [jobOpeningId, firstName, lastName, email, phone, experienceYears, currentPosition, currentCompany],
    )

    res.status(201).json({ message: "Candidature reçue" })
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la soumission" })
  }
})

// Update candidate status
router.put("/candidates/:id", authMiddleware, managerOrAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, rating, feedback, interviewDate } = req.body

    await query(
      "UPDATE candidates SET status = ?, rating = ?, feedback = ?, interview_date = ? WHERE candidate_id = ?",
      [status, rating, feedback, interviewDate || null, id],
    )

    res.json({ message: "Candidat mis à jour" })
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" })
  }
})

export default router
