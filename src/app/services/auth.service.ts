import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, tap } from "rxjs"
import type { AuthResponse, User, LoginRequest } from "../models/auth.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:3000/api/auth"
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage())
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient) {
    this.checkToken()
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        this.currentUserSubject.next(response.user)
      }),
    )
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUserSubject.next(null)
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === "admin"
  }

  isManager(): boolean {
    return this.currentUserSubject.value?.role === "manager"
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }

  private checkToken(): void {
    const token = this.getToken()
    if (token && this.getUserFromStorage()) {
      this.currentUserSubject.next(this.getUserFromStorage())
    }
  }
}
