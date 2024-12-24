import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { OrderRequest } from '../model/OrderRequest';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cartItems = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  local(){
    const token : string = localStorage.getItem('authToken') || '';
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+ token});

    return {
      headers: headers_object
    };
  }

  checkout(orderRequest: OrderRequest) {
    return this.http.post('http://localhost:8080/api/orders/add', orderRequest, this.local());
  }

  addToCart(item: any) {
    const items = this.cartItems.getValue();
    const existingItem = items.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({ ...item, quantity: 1 });
    }
    this.cartItems.next(items);
  }

  getCartItems() {
    return this.cartItems.getValue();
  }

  getCartTotal() {
    return this.cartItems.getValue().reduce((total, item) => total + (item.price *
      item.quantity), 0);
  }

}
