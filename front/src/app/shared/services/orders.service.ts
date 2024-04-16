import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IOrder } from '../models/Order';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private http = inject(HttpClient);

  public orders$ = this.http.get<IOrder[]>(`/api/orders`);

  public getOrderById(id: string) {
    return this.http.get<IOrder>(`/api/orders/${id}`).pipe(take(1));
  }

  public async newOrder(order: IOrder) {
    return await this.http.post(`/api/orders`, order).pipe(take(1));
  }

}
