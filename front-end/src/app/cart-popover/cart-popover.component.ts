import {Component, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import { CartService } from '../service/cart.service';
import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import {animate, state, style, transition, trigger,} from '@angular/animations';
import { LocationFormComponent } from '../location-form/location-form.component';
import { PaymentCardFormComponent } from '../payment-card-form/payment-card-form.component';
import {DeliveryAddress} from "../model/DeliveryAddress";
import {PaymentMethod} from "../model/paymentMethod";
import {OrderRequest} from "../model/OrderRequest";

@Component({
  selector: 'app-cart-popover',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    DecimalPipe,
    LocationFormComponent,
    PaymentCardFormComponent
  ],
  templateUrl: './cart-popover.component.html',
  styleUrl: './cart-popover.component.css',
  animations: [
    trigger('popoverState', [
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'scale(1)',
        })
      ),
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(0.8)',
        })
      ),
      transition('void => visible', [animate('200ms ease-out')]),
      transition('visible => void', [animate('200ms ease-in')]),
    ]),
  ],
})
export class CartPopoverComponent {
  cartItems: any[] = [];
  cartTotal: number = 0;
  popoverState = 'visible';
  currentStep: 'cart' | 'delivery' | 'payment' = 'cart';
  deliveryAddress!: DeliveryAddress;
  paymentMethod!: PaymentMethod;

  @Output() close = new EventEmitter<void>();
  @Output() orderSubmitted = new EventEmitter<void>();

  constructor(private cartService: CartService) {
    this.updateCart();
  }

  updateCart() {
    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = this.cartService.getCartTotal();
  }

  closePopover() {
    this.popoverState = 'void';
    setTimeout(() => {
      this.close.emit();
    }, 200); // This should match the duration of the 'visible = void' transition
  }

  public checkout() {
    this.currentStep = 'delivery';
  }

  handleLocationSubmission(address: DeliveryAddress) {
    this.deliveryAddress = address;
    this.showPaymentCardForm();  // Advance to the payment step
  }

  handlePaymentSubmission(payment: PaymentMethod) {
    this.paymentMethod = payment;
    this.processOrder();
  }

  processOrder() {
    const orderRequest: OrderRequest = {
      items: this.cartItems,
      totalPrice: this.cartTotal,
      deliveryAddress: this.deliveryAddress,
      paymentMethod: this.paymentMethod
    };

    this.cartService.checkout(orderRequest).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.cartItems = [];
        this.cartTotal = 0;
        this.currentStep = 'cart';
        this.orderSubmitted.emit();
      },
      error: (err) => {
        console.error('Error creating order:', err);
      }
    });
  }


  closeDeliveryForm() {
    this.currentStep = 'cart';
  }

  showPaymentCardForm() {
    this.currentStep = 'payment';
  }

  incrementQuantity(item: any) {
    item.quantity++;
    this.updateCart();
  }

  decrementQuantity(item: any) {
    item.quantity--;
    if (item.quantity <= 0) {
      this.removeItem(item);
    } else {
      this.updateCart();
    }
  }

  removeItem(item: any) {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
    this.updateCart();
  }



}
