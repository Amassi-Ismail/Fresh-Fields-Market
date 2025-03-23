import { Component, EventEmitter, Output, Renderer2 } from '@angular/core';
import { NgClass, NgIf, NgOptimizedImage } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    NgClass,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
onOrderHisClick() {
this.router.navigate(['/order-history']);
}
onProfileClick() {
this.router.navigate(['/profile']);
}
  @Output() toggleCart = new EventEmitter<void>();
  isDarkMode: boolean = false;
  cartItemCount: number = 0;

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {
    // Load dark mode preference from localStorage
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.applyTheme();
    this.cartService.cartCount$.subscribe(
      count => this.cartItemCount = count
    );
  }

  local(){
    const token : string = localStorage.getItem('authToken') || '';
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+ token});

    const httpOptions = {
      headers: headers_object
    };

    return httpOptions;
  }

  onCartClick() {
    this.router.navigate(['/cart']);
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyTheme();
  }

  private applyTheme(): void {
    const body = document.body;
    if (this.isDarkMode) {
      this.renderer.addClass(body, 'dark-mode');
    } else {
      this.renderer.removeClass(body, 'dark-mode');
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  navigateToLogin(): void {
    this.router.navigate(['/account-component']);
  }
}
