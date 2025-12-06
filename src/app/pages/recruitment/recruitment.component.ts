import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { JobOpening, Candidate } from "../../models/recruitment.model"
import type { Department } from "../../models/department.model"
import { CountPipe } from "../../pipes/count.pipe"
import { RecruitmentService } from "../../services/recruitment.service"
import { DepartmentService } from "../../services/department.service"

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
  departments: Department[] = []
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
    private formBuilder: FormBuilder,
    private recruitmentService: RecruitmentService,
    private departmentService: DepartmentService
  ) {
    this.jobForm = this.createJobForm()
  }

  createJobForm(): FormGroup {
    return this.formBuilder.group({
      jobTitle: ["", Validators.required],
      departmentId: ["", Validators.required],
      salaryMin: ["", [Validators.required, Validators.min(0)]],
      salaryMax: ["", [Validators.required, Validators.min(0)]],
      description: ["", Validators.required],
      requirements: ["", Validators.required],
      status: ["open", Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadJobs()
    this.loadCandidates()
    this.loadDepartments()
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data
      },
      error: (error) => {
        console.error('Error loading departments', error)
      }
    })
  }

  loadJobs(): void {
    this.loading = true
    this.recruitmentService.getJobOpenings().subscribe({
      next: (data) => {
        this.jobs = data
        this.loading = false
      },
      error: (error) => {
        console.error('Error loading jobs', error)
        this.loading = false
      }
    })
  }

  loadCandidates(): void {
    this.recruitmentService.getCandidates().subscribe({
      next: (data) => {
        this.candidates = data
        this.applyFilters()
      },
      error: (error) => {
        console.error('Error loading candidates', error)
      }
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
      // Use _id or id depending on what backend returns. 
      // Mongoose returns _id, but frontend model might expect id.
      // Assuming we handle this or use _id if available.
      const jobId = (this.selectedJob as any)._id || this.selectedJob.id || this.selectedJob.jobOpeningId
      filtered = filtered.filter((c) => c.jobOpeningId === jobId || (c as any).jobOpeningId?._id === jobId)
    }

    this.selectedJobCandidates = filtered
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

    // Add default values required by backend if missing
    const newJob: Partial<JobOpening> = {
      ...formValue,
      departmentName: "IT", // This should probably come from a department selection or lookup
      positionCount: 1,
      requiredExperience: 3,
      currency: "TND"
    }

    this.recruitmentService.createJobOpening(newJob).subscribe({
      next: () => {
        this.loadJobs()
        this.closeJobForm()
      },
      error: (error) => {
        console.error('Error creating job', error)
        this.loading = false
      }
    })
  }

  closeJob(id: any): void {
    if (confirm("Êtes-vous sûr de vouloir fermer cette offre?")) {
      this.loading = true
      this.recruitmentService.closeJob(id).subscribe({
        next: () => {
          this.loadJobs()
        },
        error: (error) => {
          console.error('Error closing job', error)
          this.loading = false
        }
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
        this.loading = false
      },
      error: (error) => {
        console.error('Error updating candidate status', error)
        this.loading = false
      }
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
          this.loading = false
        },
        error: (error) => {
          console.error('Error hiring candidate', error)
          this.loading = false
        }
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

  getJobTitle(jobId: any): string {
    // jobId might be populated object or ID
    if (jobId && typeof jobId === 'object') {
      return jobId.jobTitle || jobId.title || "Inconnu"
    }
    const job = this.jobs.find((j) => j.id === jobId || (j as any)._id === jobId)
    return job ? job.jobTitle || (job as any).title || "Inconnu" : "Inconnu"
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
