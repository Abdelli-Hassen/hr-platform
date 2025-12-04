import { Injectable } from "@angular/core"
import { type User, type LoginRequest } from "../models/auth.model"
import { Observable, of, throwError } from "rxjs"

/**
 * Pure mock authentication - no API calls
 * Credentials:
 * - admin@hrplatform.tn / admin123 → /admin
 * - m.benali@hrplatform.tn / employee123 → /employee
 */
@Injectable({
  providedIn: "root",
})
export class MockAuthService {
  private mockUsers: Record<string, { password: string; user: User }> = {
    "admin@hrplatform.tn": {
      password: "admin123",
      user: {
        id: 1,
        email: "admin@hrplatform.tn",
        role: "admin",
        employee: {
          employee_id: 101,
          first_name: "Admin",
          last_name: "User",
        },
      },
    },
    "m.benali@hrplatform.tn": {
      password: "employee123",
      user: {
        id: 2,
        email: "m.benali@hrplatform.tn",
        role: "employee",
        employee: {
          employee_id: 102,
          first_name: "Marwan",
          last_name: "Benali",
        },
      },
    },
  }

  login(credentials: LoginRequest): Observable<{ token: string; user: User }> {
    const mockUser = this.mockUsers[credentials.email]

    if (!mockUser || mockUser.password !== credentials.password) {
      return throwError(() => new Error("Invalid credentials"))
    }

    return of({
      token: "mock_jwt_token_" + Date.now(),
      user: mockUser.user,
    })
  }
}
