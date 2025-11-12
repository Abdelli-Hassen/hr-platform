import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"

declare global {
  namespace Express {
    interface Request {
      user?: any
      userId?: number
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Token non fourni" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    req.user = decoded
    req.userId = (decoded as any).user_id
    next()
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" })
  }
}

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Accès administrateur requis" })
  }
  next()
}

export const managerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!["admin", "manager"].includes(req.user?.role)) {
    return res.status(403).json({ error: "Accès refusé" })
  }
  next()
}
