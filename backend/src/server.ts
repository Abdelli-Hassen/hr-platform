import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth"
import employeeRoutes from "./routes/employees"
import payrollRoutes from "./routes/payroll"
import leaveRoutes from "./routes/leaves"
import recruitmentRoutes from "./routes/recruitment"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/employees", employeeRoutes)
app.use("/api/payroll", payrollRoutes)
app.use("/api/leaves", leaveRoutes)
app.use("/api/recruitment", recruitmentRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
