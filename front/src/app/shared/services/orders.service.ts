import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IOrder } from '../models/Order';
import { firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private readonly API_PATH = `/api/orders`;

  private http = inject(HttpClient);

  public orders$ = this.http.get<IOrder[]>(this.API_PATH);

  public getOrderById(id: string) {
    return this.http.get<IOrder>(`${this.API_PATH}/${id}`).pipe(take(1));
  }

  public async newOrder(order: IOrder) {
    return await firstValueFrom(this.http.post(this.API_PATH, order).pipe(take(1)));
  }

  public async updateOrder(order: IOrder) {
    return await firstValueFrom(this.http.put(`${this.API_PATH}/${order.id}`, order).pipe(take(1)));
  }

  public deleteOrder(id: string) {
    return this.http.delete(`${this.API_PATH}/${id}`).pipe(take(1));
  }

}
