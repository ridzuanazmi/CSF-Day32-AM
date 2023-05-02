import { Component } from '@angular/core';
import { DeliveryOrder } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'day-32';

  orders: DeliveryOrder[] = []

  processNewOrder(orders: DeliveryOrder) {
    this.orders.unshift(orders)
  }

  deleteItem(idx: number) {
    this.orders.splice(idx, 1)
  }
}
