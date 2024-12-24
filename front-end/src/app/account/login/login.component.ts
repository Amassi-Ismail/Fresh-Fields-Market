import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  logEmail: string = '';
  logPassword: string = '';
  errorMessage: string = '';
  invalidCreds: boolean = false;
  loginEmailError: boolean = false;
  loginPasswordError: boolean = false;
  signUpForm!: FormGroup;
  passwordStrengthMessage!: string;
  showPasswordStrengthMessage: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {

    this.signUpForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSignUp() {
    if (this.signUpForm.invalid || !this.validatePassword(this.signUpForm.get('password')?.value)) {
      this.passwordStrengthMessage = 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.';
      this.showPasswordStrengthMessage = true;
      this.signUpForm.markAllAsTouched();  // Mark all fields as touched for validation feedback
      return;
    }

    const signUpData = this.signUpForm.value;
    console.log('Submitting', signUpData);


    this.http.post('http://localhost:8080/auth/register', signUpData).subscribe(response => {
        console.log(response);
        this.showPasswordStrengthMessage = false;
      },
      error => {
        console.error('SignUp failed!', error);
        this.errorMessage = 'Email already exists.';
      }
    );
  }

  onLogin() {
    this.loginEmailError = !this.logEmail;
    this.loginPasswordError = !this.logPassword;

    if (this.loginEmailError || this.loginPasswordError) {
      this.errorMessage = '';
      return;
    }

    const loginData = {
      email: this.logEmail,
      password:this.logPassword
    };

    this.http.post<{ token: string }>('http://localhost:8080/auth/login', loginData).subscribe(response => {
      localStorage.setItem('authToken', response.token);
      this.router.navigate(['/home-component']);
    },
    error => {
      this.errorMessage = 'Invalid email or password. Please try again.';
      this.invalidCreds = true;
      this.loginEmailError = false;
      this.loginPasswordError = false;
    }
  );
  }

  // Method to show registration form
  showRegistration() {
    const container = document.getElementById('container') as HTMLElement;
    if (container) {
      container.classList.add("active");
    }
  }

  // Method to show login form

  showLogin() {
    const container = document.getElementById('container') as HTMLElement;
    if (container) {
      container.classList.remove("active");
    }
  }


  validatePassword(password: string): boolean {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  }

  isFieldInvalid(field: string): false | true | undefined {
    const control = this.signUpForm.get(field);
    return control?.invalid && (control.dirty || control.touched);
  }

}
