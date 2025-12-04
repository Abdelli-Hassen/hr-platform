export interface User {
  id: number
  email: string
  role: "admin" | "employee" | "manager"
  employee?: Employee
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface Employee {
  employee_id: number
  first_name: string
  last_name: string
}
