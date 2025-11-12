import { Injectable } from "@angular/core"
import type { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"
import { Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(["/login"])
      return false
    }

    const requiredRole = route.data["role"]
    if (requiredRole && !this.hasRole(requiredRole)) {
      this.router.navigate(["/unauthorized"])
      return false
    }

    return true
  }

  private hasRole(role: string): boolean {
    const user = this.authService.getCurrentUser()
    return user?.role === role
  }
}
