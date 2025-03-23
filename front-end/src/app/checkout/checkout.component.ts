import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Add these interfaces
interface OrderItem {
  item: {
    id: bigint;
    name: string;
    price: number;
  };
  quantity: number;
  priceAtTime: number;
}

interface Order {
  id: bigint;
  orderDate: string;
  totalPrice: number;
  status: string;
  items: OrderItem[];
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartTotal: number = 0;
  isLoading: boolean = false;
  currentStep: number = 1;
  addressSuggestions: any[] = [];
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private http: HttpClient
  ) {
    this.checkoutForm = this.fb.group({
      // Delivery Details
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postcode: ['', Validators.required],
      // Payment Details
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  ngOnInit(): void {
    this.cartTotal = this.cartService.getCartTotal();
    this.setupAddressAutocomplete();
  }

  // Using MapBox API for address autocomplete (free tier available)
  setupAddressAutocomplete(): void {
    this.checkoutForm.get('address')?.valueChanges.subscribe(value => {
      if (value.length > 3) {
        const accessToken = '';
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${accessToken}&country=US`)
          .then(response => response.json())
          .then(data => {
            this.addressSuggestions = data.features;
          });
      }
    });
  }

  selectAddress(address: any): void {
    const [city, postcode] = this.extractCityAndPostcode(address);
    this.checkoutForm.patchValue({
      address: address.place_name,
      city: city,
      postcode: postcode
    });
    this.addressSuggestions = [];
  }

  private extractCityAndPostcode(address: any): [string, string] {
    // Extract city and postcode from MapBox response
    const context = address.context || [];
    const city = context.find((item: any) => item.id.startsWith('place'))?.text || '';
    const postcode = context.find((item: any) => item.id.startsWith('postcode'))?.text || '';
    return [city, postcode];
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.isDeliveryDetailsValid()) {
      this.currentStep = 2;
    }
  }

  prevStep(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1;
    }
  }

  isDeliveryDetailsValid(): boolean {
    const deliveryControls = ['fullName', 'email', 'phone', 'address', 'city', 'postcode'];
    return deliveryControls.every(control => 
      this.checkoutForm.get(control)?.valid
    );
  }

  async onSubmit(): Promise<void> {
    if (this.checkoutForm.valid) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // First process payment
        await this.processPayment();
        
        // Then create order
        await this.createOrder();
        
        // Clear cart and navigate to confirmation
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation']);
      } catch (error: any) {
        console.error('Checkout failed:', error);
        this.error = error.message || 'Checkout failed. Please try again.';
      } finally {
        this.isLoading = false;
      }
    }
  }

  private async createOrder(): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
  
      // Convert cart items to order items
      const orderItems: OrderItem[] = this.cartService.getCartItems().map(cartItem => ({
        item: {
          id: cartItem.item.id,
          name: cartItem.item.name,
          price: cartItem.item.price
        },
        quantity: cartItem.quantity,
        priceAtTime: cartItem.item.price
      }));
  
      // Make API call to create order
      await this.http.post(
        'http://localhost:8080/api/orders/create',
        orderItems,
        { 
          headers,
          responseType: 'text' // Change response type to text
        }
      ).toPromise();
  
    } catch (error) {
      console.error('Order creation error:', error);
      throw new Error('Failed to create order');
    }
  }

  private async processPayment(): Promise<void> {
    // Get form values
    const paymentDetails = {
      cardNumber: this.checkoutForm.get('cardNumber')?.value,
      expiryDate: this.checkoutForm.get('expiryDate')?.value,
      cvv: this.checkoutForm.get('cvv')?.value
    };

    // For now, just simulate payment processing
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful payment
        if (paymentDetails.cardNumber && paymentDetails.expiryDate && paymentDetails.cvv) {
          resolve();
        } else {
          reject(new Error('Invalid payment details'));
        }
      }, 2000);
    });
  }
}