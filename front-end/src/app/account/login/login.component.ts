import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import { firstValueFrom } from 'rxjs';

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
  // Login form fields
  logEmail: string = '';
  logPassword: string = '';
  
  // Error and validation states
  errorMessage: string = '';
  invalidCreds: boolean = false;
  loginEmailError: boolean = false;
  loginPasswordError: boolean = false;
  signUpError: boolean = false;
  
  // Registration form
  signUpForm!: FormGroup;
  passwordStrengthMessage!: string;
  showPasswordStrengthMessage: boolean = false;
  
  // UI state
  isLoading: boolean = false;

  // API endpoints
  private readonly API_BASE_URL = 'http://localhost:8080/auth';
  
  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {
    this.initSignUpForm();
  }

  private initSignUpForm(): void {
    this.signUpForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSignUp(): Promise<void> {
    if (this.isSignUpFormInvalid()) {
      return;
    }

    try {
      this.setLoadingState(true);
      this.resetErrors();

      const signUpData = this.signUpForm.value;
      console.log('Submitting', signUpData);

      const response = await firstValueFrom(this.http.post(`${this.API_BASE_URL}/register`, signUpData));
      
      if (response) {
        this.showPasswordStrengthMessage = false;
        // Auto-login after successful registration
        this.logEmail = signUpData.email;
        this.logPassword = signUpData.password;
        await this.onLogin();
      }
    } catch (error: any) {
      console.error('SignUp failed!', error);
      this.signUpError = true;
      this.errorMessage = error.error?.message || 'Email already exists.';
      this.setLoadingState(false);
    } finally {
      this.setLoadingState(false);
    }
  }

  async onLogin(): Promise<void> {
    this.loginEmailError = !this.logEmail;
    this.loginPasswordError = !this.logPassword;

    if (this.loginEmailError || this.loginPasswordError) {
      this.errorMessage = '';
      return;
    }

    const loginData = {
      email: this.logEmail,
      password: this.logPassword
    };

    try {
      this.setLoadingState(true);

      const response = await firstValueFrom(this.http.post<{ token: string }>(`${this.API_BASE_URL}/login`, loginData));
      if (response?.token) {
        localStorage.setItem('authToken', response.token);
        await this.router.navigate(['/']);
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login failed:', error);
      this.errorMessage = 'Invalid email or password. Please try again.';
      this.invalidCreds = true;
      this.loginEmailError = false;
      this.loginPasswordError = false;
      this.setLoadingState(false);
    } finally {
      this.setLoadingState(false);
    }
  }

  showRegistration(): void {
    const container = document.getElementById('container');
    container?.classList.add("active");
  }

  showLogin(): void {
    const container = document.getElementById('container');
    container?.classList.remove("active");
  }

  validatePassword(password: string): boolean {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && 
           hasUppercase && 
           hasLowercase && 
           hasNumber && 
           hasSpecialChar;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.signUpForm.get(field);
    return !!control?.invalid && (!!control.dirty || !!control.touched);
  }

  private isSignUpFormInvalid(): boolean {
    const password = this.signUpForm.get('password')?.value;
    
    if (this.signUpForm.invalid || !this.validatePassword(password)) {
      this.passwordStrengthMessage = 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.';
      this.showPasswordStrengthMessage = true;
      this.signUpForm.markAllAsTouched();
      return true;
    }
    
    return false;
  }

  private setLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.cdr.detectChanges();
  }

  private resetErrors(): void {
    this.signUpError = false;
    this.errorMessage = '';
  }
}
