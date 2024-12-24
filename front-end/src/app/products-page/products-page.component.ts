import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { item } from '../model/item';
import { CommonModule } from '@angular/common';
import {CartService} from "../service/cart.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent implements OnInit, OnChanges {

  constructor(private http: HttpClient, private cartService: CartService) {
  }

  @Input() selectedAisle: string = '';

  public items: item[] = [];
  public filteredItems: item[] = [];
  public searchQuery: string = '';


  local(){
    const token : string = localStorage.getItem('authToken') || '';
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return { headers: headers_object };
  }


  ngOnInit() {
    this.getItems();
  }

  public getItems(): void {
    this.http.get<item[]>(`http://localhost:8080/api/items/all`, this.local()).subscribe(
      (response: item[]) => {
        this.items = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedAisle'] && this.items.length > 0) {
      this.filterItems();
    }
  }

  private filterItems(): void {
    if (this.selectedAisle && this.selectedAisle !== 'all') {
      this.filteredItems = this.items.filter(item => item.aisle === this.selectedAisle);
    } else {
      this.filteredItems = this.items;
    }
  }

  addToCart(item: item) {
    this.cartService.addToCart(item);
    this.refreshCart(); // Ensures UI updates after adding an item
  }


  getItemQuantity(item: item): number {
    const cartItems = this.cartService.getCartItems();
    const cartItem = cartItems.find(i => i.id === item.id);
    return cartItem ? cartItem.quantity : 0;
  }

  refreshCart() {
    this.cartService.getCartItems().forEach(item => item.quantity = this.getItemQuantity(item));
  }

  searchItems() {
    if (this.searchQuery.trim() === '') {
      this.filteredItems = this.items;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredItems = this.items.filter(item =>
        item.name.toLowerCase().includes(query)
      );
    }
  }

}
