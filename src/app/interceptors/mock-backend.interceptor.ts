import { HttpInterceptorFn, HttpResponse } from "@angular/common/http"
import { of } from "rxjs"

// In-memory mock data
let users: any[] = [
  { id: 1, email: "admin@hrplatform.tn", role: "admin" as const },
  { id: 2, email: "employee@hrplatform.tn", role: "employee" as const },
  { id: 3, email: "m.benali@hrplatform.tn", role: "employee" as const },
]

let employees: any[] = [
  {
    id: 2,
    employeeId: 2,
    userId: 2,
    firstName: "Employé",
    lastName: "Démo",
    email: "employee@hrplatform.tn",
    phoneNumber: "+216 95 123 456",
    hireDate: "2022-01-15",
    jobId: "IT_PROG",
    jobTitle: "Programmeur",
    salary: 2500.0,
    departmentId: 2,
    departmentName: "Informatique",
    managerId: undefined as any,
    cin: "00000000",
    birthDate: "1990-05-20",
    nationality: "Tunisienne",
    address: "123 Rue de la Liberté",
    city: "Tunis",
    postalCode: "1000",
    contractType: "CDI" as const,
    contractStart: "2022-01-15",
    contractEnd: undefined as any,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    employeeId: 3,
    userId: 3,
    firstName: "Mohamed",
    lastName: "Ben Ali",
    email: "m.benali@hrplatform.tn",
    phoneNumber: "+216 98 765 432",
    hireDate: "2021-06-01",
    jobId: "HR_SPEC",
    jobTitle: "Spécialiste RH",
    salary: 2800.0,
    departmentId: 1,
    departmentName: "Ressources Humaines",
    managerId: undefined as any,
    cin: "87654321",
    birthDate: "1988-03-10",
    nationality: "Tunisienne",
    address: "Avenue Habib Bourguiba",
    city: "Tunis",
    postalCode: "1000",
    contractType: "CDI" as const,
    contractStart: "2021-06-01",
    contractEnd: undefined as any,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let leaves: any[] = [
  {
    id: 1,
    leaveId: 1,
    employeeId: 2,
    firstName: employees[0].firstName,
    lastName: employees[0].lastName,
    leaveType: "annual" as const,
    startDate: "2025-07-01",
    endDate: "2025-07-05",
    reason: "Vacances",
    status: "approved" as const,
    approvalDate: new Date().toISOString(),
  },
]

let absences: any[] = [
  {
    id: 1,
    employeeId: 2,
    date: "2025-06-10",
    type: "late" as const,
    reason: "Trafic",
    createdAt: new Date().toISOString(),
  },
]

let payroll: any[] = [
  {
    id: 1,
    payrollId: 1,
    employeeId: 2,
    firstName: employees[0].firstName,
    lastName: employees[0].lastName,
    month: 10,
    year: 2025,
    baseSalary: 2500,
    allowances: 200,
    deductions: 50,
    taxes: 300,
    netSalary: 2350,
    status: "paid" as const,
    paymentDate: "2025-10-30",
    currency: "TND",
  },
]

let jobOpenings: any[] = [
  { id: 1, job_opening_id: 1, jobTitle: "Développeur Angular", departmentId: 2, positionCount: 1, status: "open" },
]
let candidates: any[] = [
  { id: 1, candidate_id: 1, job_opening_id: 1, first_name: "Amira", last_name: "Trabelsi", email: "amira@example.tn", status: "submitted" },
]

function ok(body: any) {
  return of(new HttpResponse({ status: 200, body }))
}
function created(body: any) {
  return of(new HttpResponse({ status: 201, body }))
}
function notFound(body: any) {
  return of(new HttpResponse({ status: 404, body }))
}
function unauthorized(body: any) {
  return of(new HttpResponse({ status: 401, body }))
}

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url
  const method = req.method
  const body: any = (req as any).body ?? {}
  const payload: any = (body && typeof body === "object") ? body : {}

  // Only intercept API calls
  if (!url.includes("/api/")) {
    return next(req)
  }

  // AUTH
  if (url.includes("/api/auth/login") && method === "POST") {
    const emailNorm = String(payload.email || "").trim().toLowerCase()
    const pass = String(payload.password || "").trim()

    const adminEmail = "admin@hrplatform.tn"
    if (emailNorm === adminEmail && pass === "admin123") {
      return ok({ token: "mock-token-admin", user: { id: 1, email: adminEmail, role: "admin" } })
    }

    const empMap: Record<string, number> = {
      "employee@hrplatform.tn": 2,
      "m.benali@hrplatform.tn": 3,
    }
    if (emailNorm in empMap && pass === "emp123") {
      const uid = empMap[emailNorm]
      const u = users.find((u) => u.id === uid)!
      return ok({ token: "mock-token-emp", user: { id: u.id, email: u.email, role: u.role } })
    }
    return unauthorized({ error: "Email ou mot de passe incorrect" })
  }

  // EMPLOYEES
  if (url.match(/\/api\/employees$/) && method === "GET") {
    return ok(employees)
  }
  if (url.match(/\/api\/employees\/user\/(\d+)$/) && method === "GET") {
    const uid = Number(url.split("/").pop())
    const emp = employees.find((e) => e.userId === uid)
    return emp ? ok(emp) : notFound({ error: "Employé non trouvé" })
  }
  if (url.match(/\/api\/employees\/(\d+)$/) && method === "DELETE") {
    const id = Number(url.split("/").pop())
    employees = employees.filter((e) => e.id !== id)
    return ok({ message: "Supprimé" })
  }
  if (url.match(/\/api\/employees\/(\d+)$/) && method === "PUT") {
    const id = Number(url.split("/").pop())
    const idx = employees.findIndex((e) => e.id === id)
    if (idx === -1) return notFound({ error: "Employé non trouvé" })
    employees[idx] = { ...employees[idx], ...(payload || {}), updatedAt: new Date().toISOString() }
    return ok({ message: "Mis à jour" })
  }
  if (url.match(/\/api\/employees$/) && method === "POST") {
    const nextId = (employees.reduce((m, e) => Math.max(m, e.id), 0) || 1) + 1
    const emp = {
      id: nextId,
      employeeId: nextId,
      userId: nextId + 1000, // no real user linkage for mocks
      departmentName: "Informatique",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: payload.status || "active",
      ...(payload || {}),
    }
    employees.unshift(emp)
    return created({ id: nextId })
  }

  // LEAVES
  if (url.match(/\/api\/leaves$/) && method === "GET") {
    return ok(leaves)
  }
  if (url.match(/\/api\/leaves$/) && method === "POST") {
    const nextId = (leaves.reduce((m, l) => Math.max(m, l.id), 0) || 0) + 1
    const emp = employees.find((e) => e.id === payload.employeeId)
    const item: any = {
      id: nextId,
      leaveId: nextId,
      firstName: emp?.firstName || "",
      lastName: emp?.lastName || "",
      status: "pending" as const,
      ...(payload || {}),
    }
    leaves.unshift(item)
    return created({ id: nextId })
  }
  if (url.match(/\/api\/leaves\/(\d+)$/) && method === "PUT") {
    const id = Number(url.split("/").pop())
    const idx = leaves.findIndex((l) => l.id === id)
    if (idx === -1) return notFound({ error: "Congé non trouvé" })
    leaves[idx] = { ...leaves[idx], ...(payload || {}) }
    return ok({ message: "Mis à jour" })
  }
  if (url.match(/\/api\/leaves\/absences$/) && method === "GET") {
    return ok(absences)
  }
  if (url.match(/\/api\/leaves\/absences$/) && method === "POST") {
    const nextId = (absences.reduce((m, a) => Math.max(m, a.id), 0) || 0) + 1
    absences.unshift({ id: nextId, createdAt: new Date().toISOString(), ...(payload || {}) })
    return created({ id: nextId })
  }

  // PAYROLL
  if (url.match(/\/api\/payroll$/) && method === "GET") {
    const params = new URL(url, window.location.origin).searchParams
    const empId = params.get("employeeId")
    const data = empId ? payroll.filter((p) => String(p.employeeId) === empId) : payroll
    return ok(data)
  }

  // RECRUITMENT
  if (url.match(/\/api\/recruitment\/openings$/) && method === "GET") {
    return ok(jobOpenings)
  }
  if (url.match(/\/api\/recruitment\/candidates$/) && method === "GET") {
    return ok(candidates)
  }

  // DASHBOARD
  if (url.match(/\/api\/dashboard\/admin\/stats$/) && method === "GET") {
    const totalEmployees = employees.length
    const activeEmployees = employees.filter((e) => (e as any).status !== "inactive").length
    const totalPayroll = employees.reduce((s, e) => s + (Number(e.salary) || 0), 0)
    const pendingLeaves = leaves.filter((l) => l.status === "pending").length
    const openPositions = jobOpenings.length
    const newCandidates = candidates.length
    return ok({ totalEmployees, activeEmployees, totalPayroll, pendingLeaves, openPositions, newCandidates })
  }
  if (url.match(/\/api\/dashboard\/employee\/(\d+)\/stats$/) && method === "GET") {
    const empId = Number(url.split("/").slice(-2)[0])
    const leavesTaken = leaves
      .filter((l) => l.employeeId === empId && l.status === "approved")
      .reduce((n, l) => n + 1, 0)
    const remainingLeave = Math.max(0, 30 - leavesTaken)
    const lastPayroll = payroll.find((p) => p.employeeId === empId)
    return ok({ leavesTaken, remainingLeave, lastPayrollNet: lastPayroll?.netSalary || 0 })
  }

  // Default: pass through
  return next(req)
}
