import { Router, type Request, type Response } from "express"
import jwt from "jsonwebtoken"
import { query } from "../config/database"

const router = Router()

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@hrplatform.tn"
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin123"
    if (email === defaultEmail && password === defaultPassword) {
      const token = jwt.sign(
        { user_id: 1, email: defaultEmail, role: "admin" },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" },
      )
      return res.json({
        token,
        user: {
          id: 1,
          email: defaultEmail,
          role: "admin",
          employee: null,
        },
      })
    }

    const [rows]: any = await query("SELECT * FROM users WHERE email = ?", [email])

    if (!rows.length) {
      console.log('LOGIN NOT FOUND',{ email })
      return res.status(401).json({ error: "Email ou mot de passe incorrect" })
    }

    const user = rows[0]
    console.log('LOGIN ATTEMPT',{ inputEmail: email, dbEmail: user.email })
    console.log('DEBUG PASS', {
      inputPass: password,
      dbPass: user.password_hash,
      inputLen: String(password).length,
      dbLen: String(user.password_hash).length,
      inputHex: Buffer.from(String(password), 'utf8').toString('hex'),
      dbHex: Buffer.from(String(user.password_hash), 'utf8').toString('hex')
    })
    // Plain text password comparison (exact)
    if (user.password_hash !== password) {
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

    // Store plain text password (no hashing)
    await query("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)", [email, password, "employee"])

    res.status(201).json({ message: "Utilisateur créé avec succès" })
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du compte" })
  }
})

export default router
