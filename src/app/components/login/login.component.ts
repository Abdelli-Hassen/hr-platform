import { Component, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  loading = false
  error = ""

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return
    }

    this.loading = true
    this.error = ""

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        const user = response.user
        if (user.role === "admin") {
          this.router.navigate(["/admin/dashboard"])
        } else {
          this.router.navigate(["/employee/dashboard"])
        }
      },
      error: (err) => {
        this.loading = false
        this.error = err.error?.error || "Erreur de connexion"
      },
    })
  }
}
