import { Component } from "@angular/core"
import { NgIf } from "@angular/common"
import { RouterOutlet, RouterLink, Router } from "@angular/router"
import { AuthService } from "./services/auth.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: "./app.component.html",
})

export class AppComponent {
  title = "HR Platform"
  constructor(private auth: AuthService, public router: Router) {}
  onLogout() {
    this.auth.logout()
    this.router.navigate(["/login"]) 
  }
}
