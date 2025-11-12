import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Leave } from "../models/leave.model"

@Injectable({
  providedIn: "root",
})
export class LeaveService {
  private apiUrl = "http://localhost:3000/api/leaves"

  constructor(private http: HttpClient) {}

  getLeaves(employeeId?: number): Observable<Leave[]> {
    let params = new HttpParams()
    if (employeeId) params = params.set("employeeId", employeeId.toString())

    return this.http.get<Leave[]>(this.apiUrl, { params })
  }

  requestLeave(leave: Partial<Leave>): Observable<any> {
    return this.http.post(this.apiUrl, leave)
  }

  updateLeaveStatus(id: number, status: string, rejectionReason?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { status, rejectionReason })
  }

  getAll(): Observable<Leave[]> {
    return this.getLeaves()
  }

  getLeavesByEmployeeId(employeeId: number): Observable<Leave[]> {
    return this.getLeaves(employeeId)
  }

  getAbsences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/absences`)
  }

  createLeave(leave: Partial<Leave>): Observable<any> {
    return this.requestLeave(leave)
  }

  recordAbsence(absence: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/absences`, absence)
  }

  approveLeave(id: number): Observable<any> {
    return this.updateLeaveStatus(id, "approved")
  }

  rejectLeave(id: number): Observable<any> {
    return this.updateLeaveStatus(id, "rejected")
  }
}
