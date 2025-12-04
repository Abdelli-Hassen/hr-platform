import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { JobOpening, Candidate } from "../../models/recruitment.model"
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

  private mockJobs: JobOpening[] = [
    {
      id: 1,
      jobOpeningId: 1,
      jobTitle: "Senior Angular Developer",
      departmentId: 1,
      departmentName: "IT",
      positionCount: 2,
      requiredExperience: 5,
      requiredQualifications: "5+ years Angular experience",
      salaryMin: 4000,
      salaryMax: 6000,
      currency: "TND",
      status: "open",
      createdDate: "2024-11-01",
    },
    {
      id: 2,
      jobOpeningId: 2,
      jobTitle: "Product Manager",
      departmentId: 3,
      departmentName: "Product",
      positionCount: 1,
      requiredExperience: 3,
      requiredQualifications: "3+ years PM experience",
      salaryMin: 5000,
      salaryMax: 7000,
      currency: "TND",
      status: "open",
      createdDate: "2024-11-15",
    },
  ]

  private mockCandidates: Candidate[] = [
    {
      id: 1,
      candidateId: 1,
      jobOpeningId: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+216 95 111 222",
      status: "interview",
      experienceYears: 6,
      currentPosition: "Developer",
      currentCompany: "Tech Corp",
      applicationDate: "2024-11-20",
      rating: 4.5,
    },
    {
      id: 2,
      candidateId: 2,
      jobOpeningId: 1,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "+216 95 333 444",
      status: "submitted",
      experienceYears: 4,
      currentPosition: "Senior Developer",
      currentCompany: "Dev Solutions",
      applicationDate: "2024-11-22",
      rating: 4,
    },
  ]

  constructor(private formBuilder: FormBuilder) {
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
    // Load mock jobs
    this.jobs = this.mockJobs
    this.loading = false
  }

  loadCandidates(): void {
    // Load mock candidates
    this.candidates = this.mockCandidates
    this.applyFilters()
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
    const formValue = this.jobForm.value
    const newJob: JobOpening = {
      ...formValue,
      id: Math.max(...this.mockJobs.map((j) => j.id), 0) + 1,
      jobOpeningId: Math.max(...this.mockJobs.map((j) => j.jobOpeningId), 0) + 1,
      departmentName: "IT",
      positionCount: 1,
      requiredExperience: 3,
      currency: "TND",
      createdDate: new Date().toISOString().split("T")[0],
    }
    this.mockJobs.push(newJob)
    this.loadJobs()
    this.closeJobForm()
  }

  closeJob(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir fermer cette offre?")) {
      this.loading = true
      // Mock close
      const job = this.mockJobs.find((j) => j.id === id)
      if (job) {
        job.status = "closed"
        job.closingDate = new Date().toISOString().split("T")[0]
      }
      this.loadJobs()
    }
  }

  updateCandidateStatus(candidateId: number, status: string): void {
    this.loading = true
    // Mock update
    const candidate = this.mockCandidates.find((c) => c.id === candidateId)
    if (candidate) {
      candidate.status = status as "submitted" | "reviewed" | "interview" | "offered" | "rejected" | "hired"
    }
    this.loadCandidates()
    if (this.selectedJob) {
      this.applyFilters()
    }
  }

  hireCandidate(candidateId: number): void {
    if (confirm("Êtes-vous sûr de vouloir embaucher ce candidat?")) {
      this.loading = true
      // Mock hire
      const candidate = this.mockCandidates.find((c) => c.id === candidateId)
      if (candidate) {
        candidate.status = "hired"
      }
      this.loadCandidates()
      if (this.selectedJob) {
        this.applyFilters()
      }
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
