import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { DashboardStats } from "../models/dashboard-stats.model"

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private apiUrl = "http://localhost:3001/api/dashboard"

  constructor(private http: HttpClient) {}

  getAdminStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/admin/stats`)
  }

  getEmployeeStats(employeeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employee/${employeeId}/stats`)
  }
}
