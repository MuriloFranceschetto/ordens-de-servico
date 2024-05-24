import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IOrder } from '../models/order/Order';
import { firstValueFrom, take } from 'rxjs';
import { IPaymentOrder } from '../models/order/PaymentOrder';

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
    return await firstValueFrom(this.http.put(`${this.API_PATH}`, order).pipe(take(1)));
  }

  public deleteOrder(id: string) {
    return this.http.delete(`${this.API_PATH}/${id}`).pipe(take(1));
  }

  public savePayment(payment: IPaymentOrder) {
    console.log(`Atualizando pagamento: ${payment.id}`)
    if (payment.id) {
      return this.http.put(`${this.API_PATH}/payment`, payment).pipe(take(1));
    } else {
      return this.http.post(`${this.API_PATH}/payment`, payment).pipe(take(1));
    }
  }

  public deletePayment(idOrder: string, idPayment: string) {
    return this.http.delete(`${this.API_PATH}/payment/${idOrder}/${idPayment}`).pipe(take(1));
  }

}
