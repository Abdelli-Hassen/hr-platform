import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { DashboardService } from "../../services/dashboard.service"
import { EmployeeService } from "../../services/employee.service"
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
    private dashboardService: DashboardService,
    private employeeService: EmployeeService,
    private router: Router,
  ) {
    this.currentUser = this.authService.getCurrentUser()
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
        console.error('Error loading stats', error)
      }
    })
  }

  loadRecentEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        // Get last 5 employees
        this.recentEmployees = data.slice(0, 5)
        this.loading = false
      },
      error: (error) => {
        console.error('Error loading recent employees', error)
        this.loading = false
      }
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
