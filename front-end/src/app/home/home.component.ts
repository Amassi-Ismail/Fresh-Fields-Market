import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToShop() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/shop-component']);
    } else {
      this.router.navigate(['/account-component']);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/account-component']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
