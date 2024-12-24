import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentMethod } from '../../model/paymentMethod';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.css'
})
export class PaymentMethodComponent implements OnInit {
  paymentForm!: FormGroup;
  paymentText: boolean = false;
  viewAdd: boolean = true;
  viewEditing: boolean = false;
  isEditing: boolean = false;
  errorMessage: string = '';
  paymentMethodId!: number;
  userId!: number;

  constructor(private http: HttpClient, private fb: FormBuilder){}

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

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      cardNumber: [null, [Validators.pattern(/^\d{16}$/), Validators.required]],
      date: [null, [Validators.required]],
      securityCode: [null, [Validators.pattern(/^\d{3}$/), Validators.required]]
    });

    this.fetchUserAndPayment();
  }

    fetchUserAndPayment(): void {
      this.http.get<any>('http://localhost:8080/account/me', this.local()).subscribe(
        (userResponse: any) => {
          this.userId= userResponse.id;
          const paymentMethodId = userResponse.paymentMethod?.id;

          if (paymentMethodId) {
            this.paymentMethodId = paymentMethodId;
            this.getPayment(paymentMethodId);
          } else {
            this.paymentText = false;
            this.viewEditing = false;
            this.viewAdd = true;
            this.isEditing = false;

          }
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching current user:', error.message);
        }
      );
    }

    getPayment(id: number): void {
      this.http.get<PaymentMethod>(`http://localhost:8080/account/find/payment/${id}`,this.local()).subscribe(
        (response: PaymentMethod) => {
          if(response){
            this.paymentText= true;
            this.viewEditing= true;
            this.viewAdd= false;
            this.isEditing= false;
            this.paymentForm.patchValue({
              cardNumber: response.cardNumber,
              // date: response.date,
              // securityCode: response.securityCode
            });
            console.log(response);
          }

        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.paymentText= false;
            this.viewEditing= false;
            this.viewAdd= true;
            this.isEditing= false;
          } else {
            console.error('Error fetching payment information:', error.message);
          }
        });
    }

    add(): void {
      if (this.paymentForm.valid) {
        this.http.post(`http://localhost:8080/account/add/payment/${this.userId}`, this.paymentForm.value, this.local())
          .subscribe(response => {
            console.log(response);
            this.viewAdd = false;
            this.viewEditing = true;
            this.isEditing= false;
            this.paymentText= true;
            alert('Payment added successfully!');
          }, error => {
            console.error('Failed to add payment!', error);
            alert('Failed to add payment.');
          });
      } else {
        this.paymentForm.markAllAsTouched();
        alert('Please fill out all fields correctly.');
      }
    }




  toggleEdit(): void {
    this.viewEditing = false;
    this.isEditing = true;
    this.paymentText= false;

  }

  cancelEdit(): void {
    this.isEditing = false;
    this.viewEditing = true;
    (response: PaymentMethod) => {
      this.paymentForm.patchValue({
        cardNumber: response.cardNumber,
        // date: response.date,
        // securityCode: response.securityCode
      });
      console.log(response);
    }
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.http.put(`http://localhost:8080/account/update/payment/${this.paymentMethodId}`, this.paymentForm.value,this.local()).subscribe(
        (response) => {
          console.log(response);
        alert('Payment information updated successfully');
        this.isEditing = false;
        this.viewEditing= true;
      },
      (error) => {
        console.error('Error updating Payment information:', error);
      }
    );
    } else {
      this.paymentForm.markAllAsTouched();
      alert('Please fill out all fields correctly.');
    }
  }
}
