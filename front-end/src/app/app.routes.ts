import { RouterModule, Routes } from '@angular/router';
import {ShopComponent} from "./shop/shop.component";
import {LoginComponent} from "./account/login/login.component";
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { ProfileComponent } from './profile/profile.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'account-component', component: LoginComponent},
  {path: 'shop-component', component: ShopComponent},
  {path: 'cart', component: CartComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'order-confirmation', component: OrderConfirmationComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'order-history', component: OrderHistoryComponent},
  ];

