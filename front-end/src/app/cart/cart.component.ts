import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { item } from '../model/item';
import { CartService } from '../services/cart.service';
import { CartItem } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (cart) => {
        this.cartItems = cart?.items || [];
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.error = 'Failed to load cart items';
        this.cdr.markForCheck();
      }
    });

    this.cartService.loading$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(loading => {
      this.isLoading = loading;
      this.cdr.markForCheck();
    });

    // Initial load
    this.cartService.refreshCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async updateQuantity(itemId: number, quantity: number): Promise<void> {
    try {
      this.isLoading = true;
      await this.cartService.updateQuantity(itemId, quantity).toPromise();
      this.error = null;
      await this.cartService.refreshCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      this.error = 'Failed to update quantity';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  async removeItem(itemId: number): Promise<void> {
    try {
      this.isLoading = true;
      await this.cartService.removeFromCart(itemId).toPromise();
      this.error = null;
      await this.cartService.refreshCart();
    } catch (error) {
      console.error('Error removing item:', error);
      this.error = 'Failed to remove item';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  getTotalPrice(): number {
    return this.cartService.getCartTotal();
  }

  getItemCount(): number {
    return this.cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  goBack(): void {
    this.router.navigate(['/shop-component']);
  }

  async clearCart(): Promise<void> {
    try {
      this.isLoading = true;
      await this.cartService.clearCart().toPromise();
      this.error = null;
      await this.cartService.refreshCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      this.error = 'Failed to clear cart';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }
}