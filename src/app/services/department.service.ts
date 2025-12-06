import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Department } from "../models/department.model"

@Injectable({
    providedIn: "root",
})
export class DepartmentService {
    private apiUrl = "/api/departments"

    constructor(private http: HttpClient) { }

    getAllDepartments(): Observable<Department[]> {
        return this.http.get<Department[]>(this.apiUrl)
    }
}
