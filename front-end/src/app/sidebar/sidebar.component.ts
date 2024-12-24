import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Output() aisleSelected = new EventEmitter<string>();
  selectedAisle: string = '';

  aisles = [
    {id: 'fruits', name: 'Fruits'},
    {id: 'vegetables', name: 'Greens & Vegetables'},
    {id: 'dairy & eggs', name: 'Dairy & Eggs'},
    {id: 'beverages', name: 'Beverages'},
    {id: 'deli', name: 'Meat & Deli'},
    {id: 'snacks', name: 'Snacks'},
    {id: 'frozengoods', name: 'Frozen Goods'},
    {id: 'bakery', name: 'Bakery'},
    {id: 'meat-seafood', name: 'Meat & Seafood'},
    {id: 'produce', name: 'Produce'},
    {id: 'dry-goods-pasta', name: 'Dry Goods & Pasta'},
    {id: 'oils-vinegars-spices', name: 'Oils, Vinegars, & Spices'},
    {id: 'condiments-sauces', name: 'Condiments & Sauces'},
    {id: 'breakfast', name: 'Breakfast'},
    {id: 'household', name: 'Household'},
    {id: 'baking-essentials', name: 'Baking Essentials'},
    {id: 'personal-care', name: 'Personal Care'},
    {id: 'canned-goods-soups', name: 'Canned Goods & Soups'}];

  loadAisleProducts(aisle: string) {
    this.aisleSelected.emit(aisle);
    this.selectedAisle = aisle;
  }

  isSelected(aisle: string): boolean {
    return this.selectedAisle === aisle;
  }

}
