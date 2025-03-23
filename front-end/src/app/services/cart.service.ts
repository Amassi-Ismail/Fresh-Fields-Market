import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';

export interface CartItem {
  id: number;
  item: {
    id: bigint;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
  };
  quantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8080/api/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  private cartCountSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  cart$ = this.cartSubject.asObservable();
  cartCount$ = this.cartCountSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  addToCart(itemId: bigint, quantity: number = 1): Observable<Cart> {
    this.loadingSubject.next(true);
    return this.http.post<Cart>(
      `${this.baseUrl}/add/${itemId}?quantity=${quantity}`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
        this.updateCartCount(cart);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  private loadCart(): void {
    this.loadingSubject.next(true);
    this.http.get<Cart>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe({
        next: (cart) => {
          this.cartSubject.next(cart);
          this.updateCartCount(cart);
        },
        error: (error) => console.error('Error loading cart:', error)
      });
  }

  removeFromCart(itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(
      `${this.baseUrl}/remove/${itemId}`,
      { 
        headers: this.getHeaders()
      }
    ).pipe(
      map(response => {
        this.cartSubject.next(response);
        this.updateCartCount(response);
        return response;
      })
    );
  }

  updateQuantity(itemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(
      `${this.baseUrl}/update/${itemId}?quantity=${quantity}`,
      {},
      { 
        headers: this.getHeaders()
      }
    ).pipe(
      map(response => {
        this.cartSubject.next(response);
        this.updateCartCount(response);
        return response;
      })
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/clear`,
      { 
        headers: this.getHeaders()
      }
    ).pipe(
      map(() => {
        this.cartSubject.next(null);
        this.cartCountSubject.next(0);
      })
    );
  }

  private updateCartCount(cart: Cart): void {
    if (!cart || !cart.items) {
      this.cartCountSubject.next(0);
      return;
    }
    const count = cart.items.reduce((total, item) => total + item.quantity, 0);
    this.cartCountSubject.next(count);
  }

  getCartTotal(): number {
    const cart = this.cartSubject.value;
    return cart ? cart.totalPrice : 0;
  }

  getCartItems(): CartItem[] {
    const cart = this.cartSubject.value;
    return cart ? cart.items : [];
  }

  // Add this method to help debug the response
  private logResponse(response: any, operation: string): void {
    console.group(`Cart Service - ${operation}`);
    console.log('Response:', response);
    try {
      console.log('Stringified:', JSON.stringify(response));
    } catch (e) {
      console.error('Could not stringify response:', e);
    }
    console.groupEnd();
  }

  refreshCart(): void {
    this.loadCart();
  }
}