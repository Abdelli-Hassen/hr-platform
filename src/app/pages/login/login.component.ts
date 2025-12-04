import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginForm: FormGroup
  loading = false
  submitted = false
  error = ""

  // Mock accounts - no API needed
  private mockAccounts = {
    "admin@hrplatform.tn": {
      password: "admin123",
      role: "admin" as const,
      firstName: "Admin",
      lastName: "User",
    },
    "m.benali@hrplatform.tn": {
      password: "employee123",
      role: "employee" as const,
      firstName: "Marwan",
      lastName: "Benali",
    },
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  get f() {
    return this.loginForm.controls
  }

  onSubmit(): void {
    this.submitted = true
    this.error = ""

    if (this.loginForm.invalid) {
      return
    }

    this.loading = true
    const email = String(this.f["email"].value || "").trim()
    const password = String(this.f["password"].value || "").trim()

    // Mock authentication
    const account = this.mockAccounts[email as keyof typeof this.mockAccounts]
    if (!account || account.password !== password) {
      this.error = "Invalid credentials"
      this.loading = false
      return
    }

    // Store mock user
    const mockUser = {
      id: email === "admin@hrplatform.tn" ? 1 : 2,
      email,
      role: account.role,
      employee: {
        employee_id: email === "admin@hrplatform.tn" ? 101 : 102,
        first_name: account.firstName,
        last_name: account.lastName,
      },
    }

    localStorage.setItem("token", "mock_token_" + Date.now())
    localStorage.setItem("user", JSON.stringify(mockUser))

    // Navigate based on role
    if (mockUser.role === "admin") {
      this.router.navigate(["/admin"])
    } else if (mockUser.role === "employee") {
      this.router.navigate(["/employee"])
    }
  }
}
