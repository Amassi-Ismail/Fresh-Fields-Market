import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {ProductsPageComponent} from "../products-page/products-page.component";
import {NavbarComponent} from "../navbar/navbar.component";
import {CartPopoverComponent} from "../cart-popover/cart-popover.component";

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    NgIf,
    SidebarComponent,
    ProductsPageComponent,
    NavbarComponent,
    CartPopoverComponent
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
  isCartOpen = false;
  selectedAisle: string = '';

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  onAisleSelected(aisle: string) {
    this.selectedAisle = aisle;
  }

}
