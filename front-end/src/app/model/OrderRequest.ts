import {DeliveryAddress} from "./DeliveryAddress";
import {PaymentMethod} from "./paymentMethod";

export class OrderRequest {
items!: any[];
totalPrice!: number;
deliveryAddress!: DeliveryAddress;
paymentMethod!: PaymentMethod;
}
