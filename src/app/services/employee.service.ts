import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Employee } from "../models/employee.model"

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private apiUrl = "http://localhost:3000/api/employees"

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl)
  }

  getByUserId(userId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/user/${userId}`)
  }

  getByEmployeeId(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${employeeId}`)
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl)
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`)
  }

  create(employee: Partial<Employee>): Observable<any> {
    return this.http.post(this.apiUrl, employee)
  }

  createEmployee(employee: Partial<Employee>): Observable<any> {
    return this.http.post(this.apiUrl, employee)
  }

  update(id: number, employee: Partial<Employee>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, employee)
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, employee)
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
}
