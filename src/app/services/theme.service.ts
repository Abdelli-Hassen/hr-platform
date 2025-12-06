import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'app-theme';
    private themeSubject: BehaviorSubject<Theme>;
    public theme$: Observable<Theme>;

    constructor() {
        const savedTheme = this.getSavedTheme();
        this.themeSubject = new BehaviorSubject<Theme>(savedTheme);
        this.theme$ = this.themeSubject.asObservable();
        this.applyTheme(savedTheme);
    }

    private getSavedTheme(): Theme {
        const saved = localStorage.getItem(this.THEME_KEY);
        return (saved === 'dark' || saved === 'light') ? saved : 'light';
    }

    getCurrentTheme(): Theme {
        return this.themeSubject.value;
    }

    toggleTheme(): void {
        const newTheme: Theme = this.themeSubject.value === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme: Theme): void {
        this.themeSubject.next(theme);
        localStorage.setItem(this.THEME_KEY, theme);
        this.applyTheme(theme);
    }

    private applyTheme(theme: Theme): void {
        document.documentElement.setAttribute('data-theme', theme);
    }
}
