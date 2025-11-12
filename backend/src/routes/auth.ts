import { Router, type Request, type Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "../config/database"

const router = Router()

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const [rows]: any = await query("SELECT * FROM users WHERE email = ?", [email])

    if (!rows.length) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" })
    }

    const user = rows[0]
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" })
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    // Get employee info if exists
    const [empRows]: any = await query("SELECT employee_id, first_name, last_name FROM employees WHERE user_id = ?", [
      user.user_id,
    ])

    res.json({
      token,
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role,
        employee: empRows.length ? {
          employee_id: empRows[0].employee_id,
          first_name: empRows[0].first_name,
          last_name: empRows[0].last_name,
        } : null,
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
})

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    await query("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)", [email, hashedPassword, "employee"])

    res.status(201).json({ message: "Utilisateur créé avec succès" })
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du compte" })
  }
})

export default router
