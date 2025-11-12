import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { JobOpening, Candidate } from "../models/recruitment.model"

@Injectable({
  providedIn: "root",
})
export class RecruitmentService {
  private apiUrl = "http://localhost:3001/api/recruitment"

  constructor(private http: HttpClient) {}

  getJobOpenings(): Observable<JobOpening[]> {
    return this.http.get<JobOpening[]>(`${this.apiUrl}/openings`)
  }

  createJobOpening(opening: Partial<JobOpening>): Observable<any> {
    return this.http.post(`${this.apiUrl}/openings`, opening)
  }

  getCandidates(jobOpeningId?: number): Observable<Candidate[]> {
    let params = new HttpParams()
    if (jobOpeningId) params = params.set("jobOpeningId", jobOpeningId.toString())

    return this.http.get<Candidate[]>(`${this.apiUrl}/candidates`, { params })
  }

  submitApplication(candidate: Partial<Candidate>): Observable<any> {
    return this.http.post(`${this.apiUrl}/candidates`, candidate)
  }

  updateCandidate(id: number, updates: Partial<Candidate>): Observable<any> {
    return this.http.put(`${this.apiUrl}/candidates/${id}`, updates)
  }

  getJobs(): Observable<JobOpening[]> {
    return this.getJobOpenings()
  }

  getCandidatesList(): Observable<Candidate[]> {
    return this.getCandidates()
  }

  createJob(job: Partial<JobOpening>): Observable<any> {
    return this.createJobOpening(job)
  }

  closeJob(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/openings/${id}/close`, {})
  }

  updateCandidateStatus(id: number, status: string): Observable<any> {
    return this.updateCandidate(id, { status: status as any })
  }

  hireCandidate(id: number): Observable<any> {
    return this.updateCandidate(id, { status: "hired" as any })
  }
}
