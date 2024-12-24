import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ShopComponent} from "./shop/shop.component";
import {LoginComponent} from "./account/login/login.component";
import {LocationFormComponent} from "./location-form/location-form.component";
import {PaymentCardFormComponent} from "./payment-card-form/payment-card-form.component";

export const routes: Routes = [{path: 'account-component', component: LoginComponent},
  {path: 'home-component', component: HomeComponent},
  {path: 'shop-component', component: ShopComponent},
  {path: 'location-form', component: LocationFormComponent},
  {path: 'payment-form', component: PaymentCardFormComponent},
  {path: '',   redirectTo: '/account-component', pathMatch: 'full'}];
