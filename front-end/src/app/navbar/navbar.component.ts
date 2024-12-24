import {Component, EventEmitter, Output, Renderer2} from '@angular/core';
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {AccountDetailsComponent} from "../popup/account-details/account-details.component";
import {SavedAddressesComponent} from "../popup/saved-adresses/saved-addresses.component";
import {PaymentMethodComponent} from "../popup/payment-method/payment-method.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    NgClass,
    AccountDetailsComponent,
    SavedAddressesComponent,
    PaymentMethodComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Output() toggleCart = new EventEmitter<void>();
  isDarkMode: boolean = false;

  constructor(private renderer: Renderer2, private http: HttpClient, private router: Router) {
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
    this.toggleCart.emit();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;

    const body = document.body;
    const a=document.getElementsByClassName('aisle-link-custom');

    if (this.isDarkMode) {
      this.renderer.addClass(body, 'dark-mode');
      this.renderer.addClass(a, 'dark-mode');
      console.log('Dark mode enabled');
    } else {
      this.renderer.removeClass(body, 'dark-mode');
      this.renderer.removeClass(a, 'dark-mode');
      console.log('Dark mode disabled');
    }
  }

  logout() {
    this.http.get('http://localhost:8080/auth/logout', this.local()).subscribe(response =>{
        console.log(response);
        this.router.navigate(['/account-component'])
      },
      error => {
        console.error('Logout failed!', error);
      }
    );
  }
}
