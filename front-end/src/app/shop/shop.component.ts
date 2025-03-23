import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { item } from '../model/item';
import { Router } from '@angular/router';


interface Aisle {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  selectedAisle: string = 'all'; // Change default to 'all'
  searchQuery: string = '';
  isSidebarOpen = false;
  isLoading: boolean = true;
  error: string | null = null;

  products: item[] = [];
  filteredProducts: item[] = [];

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef
  ) {}
  
  aisles: Aisle[] = [
    { id: 'all', name: 'All Products', icon: 'fa-store' },
    { id: 'fruits', name: 'Fruits', icon: 'fa-apple-whole' },
    { id: 'vegetables', name: 'Vegetables', icon: 'fa-carrot' },
    { id: 'dairy', name: 'Dairy & Eggs', icon: 'fa-cheese' },
    { id: 'beverages', name: 'Beverages', icon: 'fa-mug-hot' },
    { id: 'bakery', name: 'Bakery', icon: 'fa-bread-slice' },
    { id: 'meat', name: 'Meat & Seafood', icon: 'fa-fish' },
    { id: 'frozen', name: 'Frozen Foods', icon: 'fa-snowflake' },
    { id: 'snacks', name: 'Snacks', icon: 'fa-cookie' }
  ];

  async ngOnInit() {
    await this.fetchProducts();
  }

  private async fetchProducts(): Promise<void> {
    try {
      this.isLoading = true;
      this.cdr.detectChanges();

      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const items = await this.http.get<item[]>('http://localhost:8080/api/items/all', { headers })
        .toPromise();

      this.products = items || [];
      this.filterProducts();
      this.isLoading = false;
      this.cdr.detectChanges();
    } catch (error: any) {
      console.error('Error fetching products:', error);
      if (error.status === 403) {
        this.error = 'Access denied. Please log in again.';
        this.router.navigate(['/login']);
      } else {
        this.error = 'Failed to load products. Please try again later.';
      }
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  selectAisle(aisleId: string): void {
    this.selectedAisle = aisleId;
    this.filterProducts();
  }

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.filterProducts();
  }

  filterProducts(): void {
    if (!this.products) {
      this.filteredProducts = [];
      return;
    }

    this.filteredProducts = this.products.filter(product => {
      const matchesAisle = this.selectedAisle === 'all' || product.aisle === this.selectedAisle;
      const matchesSearch = !this.searchQuery || 
                          product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesAisle && matchesSearch;
    });
    this.cdr.detectChanges(); // Force change detection after filtering

    // Log for debugging
    console.log('Filtered products:', {
      total: this.products.length,
      filtered: this.filteredProducts.length,
      selectedAisle: this.selectedAisle
    });
  }

  async addToCart(product: item): Promise<void> {
    try {
      await this.cartService.addToCart(product.id).toPromise();
      // Show success message if needed
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.error = 'Failed to add item to cart';
      this.cdr.detectChanges();
    }
  }

  getSelectedAisleName(): string {
    const selectedAisle = this.aisles.find(a => a.id === this.selectedAisle);
    return selectedAisle ? selectedAisle.name.toUpperCase() : 'ALL PRODUCTS';
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
