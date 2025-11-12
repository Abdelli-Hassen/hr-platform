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
    this.authService.login({ email: this.f["email"].value, password: this.f["password"].value }).subscribe({
      next: (response) => {
        const user = response.user
        if (user.role === "admin") {
          this.router.navigate(["/admin"])
        } else if (user.role === "employee") {
          this.router.navigate(["/employee"])
        }
      },
      error: (error) => {
        this.error = "Email ou mot de passe incorrect"
        this.loading = false
      },
    })
  }
}
