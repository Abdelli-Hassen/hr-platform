import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { JobOpening, Candidate } from "../../models/recruitment.model"
import { RecruitmentService } from "../../services/recruitment.service"
import { CountPipe } from "../../pipes/count.pipe"

@Component({
  selector: "app-recruitment",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CountPipe],
  templateUrl: "./recruitment.component.html",
  styleUrls: ["./recruitment.component.css"],
})
export class RecruitmentComponent implements OnInit {
  jobs: JobOpening[] = []
  candidates: Candidate[] = []
  selectedJob: JobOpening | null = null
  selectedJobCandidates: Candidate[] = []

  showJobForm = false
  showCandidateDetail = false
  selectedCandidate: Candidate | null = null
  loading = false
  activeTab: "jobs" | "candidates" = "jobs"
  searchText = ""
  filterStatus = ""

  jobForm: FormGroup
  candidateStatuses = ["submitted", "reviewed", "interview", "offered", "hired", "rejected"]

  constructor(
    private recruitmentService: RecruitmentService,
    private formBuilder: FormBuilder,
  ) {
    this.jobForm = this.createJobForm()
  }

  createJobForm(): FormGroup {
    return this.formBuilder.group({
      jobTitle: ["", Validators.required],
      departmentId: ["", Validators.required],
      requiredQualifications: ["", Validators.required],
      salaryMin: ["", [Validators.required, Validators.min(0)]],
      salaryMax: ["", [Validators.required, Validators.min(0)]],
      status: ["open", Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadJobs()
    this.loadCandidates()
  }

  loadJobs(): void {
    this.loading = true
    this.recruitmentService.getJobs().subscribe({
      next: (data) => {
        this.jobs = data
        this.loading = false
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.loading = false
      },
    })
  }

  loadCandidates(): void {
    this.recruitmentService.getCandidates().subscribe({
      next: (data) => {
        this.candidates = data
        this.applyFilters()
      },
      error: (error) => {
        console.error("Erreur:", error)
      },
    })
  }

  applyFilters(): void {
    let filtered = this.candidates

    if (this.searchText) {
      filtered = filtered.filter(
        (c) =>
          c.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          c.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          c.email.toLowerCase().includes(this.searchText.toLowerCase()),
      )
    }

    if (this.filterStatus) {
      filtered = filtered.filter((c) => c.status === this.filterStatus)
    }

    if (this.selectedJob) {
      this.selectedJobCandidates = filtered.filter((c) => c.jobOpeningId === this.selectedJob?.id)
    }
  }

  switchTab(tab: "jobs" | "candidates"): void {
    this.activeTab = tab
    this.showJobForm = false
  }

  selectJob(job: JobOpening): void {
    this.selectedJob = job
    this.applyFilters()
  }

  openJobForm(): void {
    this.showJobForm = true
    this.jobForm.reset({ status: "open" })
  }

  closeJobForm(): void {
    this.showJobForm = false
    this.jobForm.reset()
  }

  saveJob(): void {
    if (this.jobForm.invalid) {
      return
    }

    this.loading = true
    this.recruitmentService.createJob(this.jobForm.value).subscribe({
      next: () => {
        this.loadJobs()
        this.closeJobForm()
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.loading = false
      },
    })
  }

  closeJob(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir fermer cette offre?")) {
      this.loading = true
      this.recruitmentService.closeJob(id).subscribe({
        next: () => {
          this.loadJobs()
        },
        error: (error) => {
          console.error("Erreur:", error)
          this.loading = false
        },
      })
    }
  }

  updateCandidateStatus(candidateId: number, status: string): void {
    this.loading = true
    this.recruitmentService.updateCandidateStatus(candidateId, status).subscribe({
      next: () => {
        this.loadCandidates()
        if (this.selectedJob) {
          this.applyFilters()
        }
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.loading = false
      },
    })
  }

  hireCandidate(candidateId: number): void {
    if (confirm("Êtes-vous sûr de vouloir embaucher ce candidat?")) {
      this.loading = true
      this.recruitmentService.hireCandidate(candidateId).subscribe({
        next: () => {
          this.loadCandidates()
          if (this.selectedJob) {
            this.applyFilters()
          }
        },
        error: (error) => {
          console.error("Erreur:", error)
          this.loading = false
        },
      })
    }
  }

  viewCandidateDetail(candidate: Candidate): void {
    this.selectedCandidate = candidate
    this.showCandidateDetail = true
  }

  closeCandidateDetail(): void {
    this.showCandidateDetail = false
    this.selectedCandidate = null
  }

  getJobTitle(jobId: number): string {
    const job = this.jobs.find((j) => j.id === jobId)
    return job ? job.jobTitle || job.title || "Inconnu" : "Inconnu"
  }

  getStatusBadgeClass(status: string): string {
    return `badge badge-${status}`
  }

  formatCurrency(salary: number): string {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(salary)
  }
}
