import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PaymentMethod} from "../model/paymentMethod";
import {DeliveryAddress} from "../model/DeliveryAddress";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private addressSubject = new BehaviorSubject<any[]>([]);
  public addresses$ = this.addressSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  local(){
    const token : string = localStorage.getItem('authToken') || '';
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+ token});

    return {
      headers: headers_object
    };
  }

  private loadInitialData() {
    this.getDeliveryAddresses().subscribe(
      data => this.addressSubject.next(data),
      error => console.error('Could not load initial data', error)
    );

  }

  addPaymentMethod(paymentMethod: PaymentMethod) {
    return this.http.post('http://localhost:8080/account/add-payment-method', paymentMethod, this.local());
  }

  addDeliveryAddress(deliveryAddress: DeliveryAddress) {
    return this.http.post<DeliveryAddress>(`http://localhost:8080/account/add-address`, deliveryAddress, this.local());
  }

  getDeliveryAddresses() {
    return this.http.get<DeliveryAddress[]>(`http://localhost:8080/account/get-addresses`, this.local());
  }

  removeDeliveryAddress(id: number) {
    return this.http.delete(`http://localhost:8080/account/delete-address/${id}`, this.local());
    this.updateAddressState(); // Refresh addresses upon successful deletion
    
  }

  updateAddressState() {
    this.getDeliveryAddresses().subscribe(
      data => this.addressSubject.next(data),
      error => console.error('Could not refresh address list', error)
    );
  }
}
