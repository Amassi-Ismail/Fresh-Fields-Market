import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly AUTH_API = 'http://localhost:8080/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check authentication status on service initialization
    this.checkAuthStatus();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.AUTH_API}/login`, 
      { email, password },
      { 
        withCredentials: true // Important for cookies
      }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.AUTH_API}/register`, 
      userData,
      { 
        withCredentials: true 
      }
    );
  }

  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.AUTH_API}/logout`, {},
      { 
        withCredentials: true 
      }
    ).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login']);
      })
    );
  }

  private checkAuthStatus(): void {
    this.http.get<AuthResponse>(`${this.AUTH_API}/status`, 
      { 
        withCredentials: true 
      }
    ).subscribe({
      next: (response) => {
        this.isAuthenticatedSubject.next(response.success);
      },
      error: () => {
        this.isAuthenticatedSubject.next(false);
      }
    });
  }
}