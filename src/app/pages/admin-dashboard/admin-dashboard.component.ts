import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import type { Employee } from "../../models/employee.model"
import type { DashboardStats } from "../../models/dashboard-stats.model"

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null
  recentEmployees: Employee[] = []
  loading = true
  currentUser: any

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.currentUser = this.authService.getCurrentUser()
  }

  ngOnInit(): void {
    this.loadStats()
    this.loadRecentEmployees()
  }

  loadStats(): void {
    // Mock data - no API calls
    this.stats = {
      totalEmployees: 48,
      activeEmployees: 45,
      totalPayroll: 890000,
      totalLeaves: 12,
      totalRecruitments: 5,
      pendingLeaves: 3,
      pendingPayroll: 1,
      openPositions: 2,
      newCandidates: 5,
      recentHires: 3,
    }
  }

  loadRecentEmployees(): void {
    // Mock employees - no API calls
    this.recentEmployees = [
      {
        id: 1,
        employeeId: 1,
        userId: 1,
        firstName: "Marwan",
        lastName: "Benali",
        email: "m.benali@hrplatform.tn",
        phoneNumber: "+216 95 123 456",
        hireDate: "2021-03-15",
        jobId: "J001",
        jobTitle: "Senior Developer",
        salary: 4500,
        departmentId: 1,
        departmentName: "IT",
        cin: "12345678",
        birthDate: "1990-01-15",
        nationality: "Tunisian",
        address: "123 Rue de la Paix",
        city: "Tunis",
        postalCode: "1000",
        contractType: "CDI",
        contractStart: "2021-03-15",
        status: "active",
        createdAt: "2021-03-15T00:00:00Z",
        updatedAt: "2024-12-04T00:00:00Z",
      },
      {
        id: 2,
        employeeId: 2,
        userId: 2,
        firstName: "Fatima",
        lastName: "Oueslati",
        email: "f.oueslati@hrplatform.tn",
        phoneNumber: "+216 95 234 567",
        hireDate: "2022-06-01",
        jobId: "J002",
        jobTitle: "HR Manager",
        salary: 4000,
        departmentId: 2,
        departmentName: "HR",
        cin: "87654321",
        birthDate: "1992-05-20",
        nationality: "Tunisian",
        address: "456 Avenue Mohamed",
        city: "Ariana",
        postalCode: "2080",
        contractType: "CDI",
        contractStart: "2022-06-01",
        status: "active",
        createdAt: "2022-06-01T00:00:00Z",
        updatedAt: "2024-12-04T00:00:00Z",
      },
      {
        id: 3,
        employeeId: 3,
        userId: 3,
        firstName: "Ali",
        lastName: "Khouni",
        email: "a.khouni@hrplatform.tn",
        phoneNumber: "+216 95 345 678",
        hireDate: "2020-01-10",
        jobId: "J003",
        jobTitle: "Accountant",
        salary: 3500,
        departmentId: 3,
        departmentName: "Finance",
        cin: "11223344",
        birthDate: "1988-07-22",
        nationality: "Tunisian",
        address: "789 Rue Mongi Slim",
        city: "Ben Arous",
        postalCode: "2015",
        contractType: "CDI",
        contractStart: "2020-01-10",
        status: "active",
        createdAt: "2020-01-10T00:00:00Z",
        updatedAt: "2024-12-04T00:00:00Z",
      },
      {
        id: 4,
        employeeId: 4,
        userId: 4,
        firstName: "Sarah",
        lastName: "Ben Salah",
        email: "s.bensalah@hrplatform.tn",
        phoneNumber: "+216 95 456 789",
        hireDate: "2023-02-15",
        jobId: "J004",
        jobTitle: "Sales Manager",
        salary: 4200,
        departmentId: 4,
        departmentName: "Sales",
        cin: "55667788",
        birthDate: "1995-03-10",
        nationality: "Tunisian",
        address: "321 Boulevard de la Rép",
        city: "Sfax",
        postalCode: "3000",
        contractType: "CDI",
        contractStart: "2023-02-15",
        status: "active",
        createdAt: "2023-02-15T00:00:00Z",
        updatedAt: "2024-12-04T00:00:00Z",
      },
      {
        id: 5,
        employeeId: 5,
        userId: 5,
        firstName: "Hassan",
        lastName: "Trabelsi",
        email: "h.trabelsi@hrplatform.tn",
        phoneNumber: "+216 95 567 890",
        hireDate: "2021-09-01",
        jobId: "J005",
        jobTitle: "Operations Lead",
        salary: 3800,
        departmentId: 5,
        departmentName: "Operations",
        cin: "99001122",
        birthDate: "1989-11-30",
        nationality: "Tunisian",
        address: "654 Rue Bab Menara",
        city: "Sousse",
        postalCode: "4000",
        contractType: "CDI",
        contractStart: "2021-09-01",
        status: "active",
        createdAt: "2021-09-01T00:00:00Z",
        updatedAt: "2024-12-04T00:00:00Z",
      },
    ]
    this.loading = false
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/login"])
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  navigateTo(path: string): void {
    this.router.navigate(["/admin", path])
  }
}
