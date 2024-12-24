import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {PaymentMethod} from "../model/paymentMethod";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-payment-card-form',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './payment-card-form.component.html',
  styleUrl: './payment-card-form.component.css'
})
export class PaymentCardFormComponent {
  cardNumber!: string;
  cardHolderName!: string;
  expirationDate!: string;
  @Output() submit = new EventEmitter<PaymentMethod>();
  @Output() close = new EventEmitter<void>();


  constructor(private userService: UserService) {}

  submitPayment() {
    const paymentMethod: PaymentMethod = {
      cardNumber: this.cardNumber,
      cardHolderName: this.cardHolderName,
      expirationDate: this.expirationDate
    };

    this.userService.addPaymentMethod(paymentMethod).subscribe({
      next: (response) => {
        console.log('Payment method added:', response);
        this.submit.emit(paymentMethod); // emit the payment method
      },
      error: (err) => {
        console.error('Error adding payment method:', err);
        // Display a user-friendly error message
      },
    });
  }

}
