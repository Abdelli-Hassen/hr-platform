import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Payroll } from "../models/payroll.model"

@Injectable({
  providedIn: "root",
})
export class PayrollService {
  private apiUrl = "http://localhost:3001/api/payroll"

  constructor(private http: HttpClient) {}

  getPayrollRecords(employeeId?: number, month?: number, year?: number): Observable<Payroll[]> {
    let params = new HttpParams()
    if (employeeId) params = params.set("employeeId", employeeId.toString())
    if (month) params = params.set("month", month.toString())
    if (year) params = params.set("year", year.toString())

    return this.http.get<Payroll[]>(this.apiUrl, { params })
  }

  createPayroll(payroll: Partial<Payroll>): Observable<any> {
    return this.http.post(this.apiUrl, payroll)
  }

  updatePayroll(id: number, updates: Partial<Payroll>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updates)
  }

  getAll(): Observable<Payroll[]> {
    return this.getPayrollRecords()
  }

  getByEmployeeId(employeeId: number): Observable<Payroll[]> {
    return this.getPayrollRecords(employeeId)
  }

  create(payroll: Partial<Payroll>): Observable<any> {
    return this.createPayroll(payroll)
  }

  update(id: number, updates: Partial<Payroll>): Observable<any> {
    return this.updatePayroll(id, updates)
  }

  approve(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/approve`, {})
  }

  pay(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/pay`, {})
  }
}
