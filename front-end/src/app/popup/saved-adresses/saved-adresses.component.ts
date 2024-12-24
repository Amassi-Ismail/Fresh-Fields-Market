import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeliveryAddress } from '../../model/DeliveryAddress';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-saved-adresses',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './saved-adresses.component.html',
  styleUrl: './saved-adresses.component.css',
})
export class SavedAdressesComponent implements OnInit {
  public addresses: DeliveryAddress[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.addresses$.subscribe(
      (addresses) => this.addresses = addresses,
      (error) => console.error('Error subscribing to addresses', error)
    );
  }

  fetchUserAndBilling(): void {
    this.userService.getDeliveryAddresses().subscribe({
      next: (response: DeliveryAddress[]) => {
        this.addresses = response;
      },
      error: (err) => {
        console.error('Error fetching Addresses', err);
      },
    });
  }

  removeAddress(address: DeliveryAddress) {
    this.userService.removeDeliveryAddress(address.id).subscribe({
      next: () => {
        // this.userService.updateAddressState();
        alert('Address removed');
      },
      error: (err) => {
        alert('Error removing Address:' + err);
      },
    });
  }
}
