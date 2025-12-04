export interface JobOpening {
  id: number
  jobOpeningId: number
  jobTitle: string
  departmentId: number
  departmentName: string
  positionCount: number
  requiredExperience: number
  requiredQualifications: string
  salaryMin: number
  salaryMax: number
  currency: string
  status: "open" | "closed" | "on_hold"
  title?: string
  createdDate: string
  closingDate?: string
}

export interface Candidate {
  id: number
  candidateId: number
  jobOpeningId: number
  firstName: string
  lastName: string
  email: string
  phone: string
  cvPath?: string
  coverLetter?: string
  experienceYears: number
  currentPosition: string
  currentCompany: string
  applicationDate: string
  status: "submitted" | "reviewed" | "interview" | "offered" | "rejected" | "hired"
  interviewDate?: string
  feedback?: string
  rating: number
}
