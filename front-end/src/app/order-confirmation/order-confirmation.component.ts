import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  orderNumber: string;
  estimatedDelivery: string;

  constructor(private router: Router) {
    // Generate random order number
    this.orderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Calculate estimated delivery date (3 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    this.estimatedDelivery = deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  ngOnInit(): void {
    // Add confetti animation when component loads
    this.createConfetti();
  }

  continueShopping(): void {
    this.router.navigate(['/shop-component']);
  }

  private createConfetti(): void {
    // Simple confetti animation
    const colors = ['#e4590f', '#2c3e50', '#27ae60', '#f1c40f', '#e74c3c'];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      document.querySelector('.confirmation-page')?.appendChild(confetti);
    }
  }
}