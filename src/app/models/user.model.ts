export interface User {
  id: number
  email: string
  role: "admin" | "employee" | "manager"
  firstName: string
  lastName: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}
