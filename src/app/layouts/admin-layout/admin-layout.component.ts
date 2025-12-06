import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
    isDarkMode = false;

    constructor(
        private auth: AuthService,
        private router: Router,
        private themeService: ThemeService
    ) {
        this.isDarkMode = this.themeService.getCurrentTheme() === 'dark';
        this.themeService.theme$.subscribe(theme => {
            this.isDarkMode = theme === 'dark';
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}
