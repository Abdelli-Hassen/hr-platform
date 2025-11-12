import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { DashboardService } from "../../services/dashboard.service"
import { AuthService } from "../../services/auth.service"
import { EmployeeService } from "../../services/employee.service"
import type { Employee } from "../../models/employee.model"
import type { DashboardStats } from "../../models/dashboard-stats.model" // Declared the DashboardStats variable

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
  currentUser: any // Updated type to any for demonstration purposes

  constructor(
    private dashboardService: DashboardService,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.currentUser = this.authService.getCurrentUser() // Moved inside constructor
  }

  ngOnInit(): void {
    this.loadStats()
    this.loadRecentEmployees()
  }

  loadStats(): void {
    this.dashboardService.getAdminStats().subscribe({
      next: (data) => {
        this.stats = data
      },
      error: (error) => {
        console.error("Erreur:", error)
      },
    })
  }

  loadRecentEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.recentEmployees = data.slice(0, 5)
        this.loading = false
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.loading = false
      },
    })
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
