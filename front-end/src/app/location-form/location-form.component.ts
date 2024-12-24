import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DeliveryAddress} from "../model/DeliveryAddress";
import {UserService} from "../service/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './location-form.component.html',
  styleUrl: './location-form.component.css'
})
export class LocationFormComponent implements OnInit{
  id!: number;
  street: string = '';
  city: string = '';
  state: string = '';
  postalCode: string = '';
  public addresses: DeliveryAddress[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() locationSubmitted = new EventEmitter<DeliveryAddress>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.addresses$.subscribe(
      (addresses) => this.addresses = addresses,
      (error) => console.error('Error subscribing to addresses', error)
    );

  }

  submitLocation() {
    const address: DeliveryAddress = {
      id: this.id,
      street: this.street,
      city: this.city,
      state: this.state,
      postalCode: this.postalCode,
    };
    this.userService.addDeliveryAddress(address).subscribe({
      next: (response) => {
        console.log('Delivery address added:', response);
        this.locationSubmitted.emit(address); // Emit event when location is submitted
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error adding address:', error);
        alert(error.message);
        // Display a user-friendly error message
      },
    });

  }

  selectLocation(address: DeliveryAddress) {
    this.id = address.id;
    this.street = address.street;
    this.city = address.city;
    this.state = address.state;
    this.postalCode = address.postalCode;
    this.locationSubmitted.emit(address); // Emit event when location is submitted
  }

}
