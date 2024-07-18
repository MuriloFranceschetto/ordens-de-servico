import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IOrder, PaymentStatus } from '../models/order/Order';
import { firstValueFrom, take } from 'rxjs';
import { IPaymentOrder } from '../models/order/PaymentOrder';
import { ISubserviceOrder } from '../models/order/SubserviceOrder';
import { IUser } from '../models/User';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private readonly API_PATH = `/api/orders`;

  private readonly http = inject(HttpClient);
  private readonly utils = inject(UtilsService);

  public orders$ = this.http.get<IOrder[]>(this.API_PATH);

  public getOrders(queryParams: UserParams) {
    let params = this.utils.removeUndefineds(queryParams);
    return this.http.get<IOrder[]>(this.API_PATH, { params: { ...params } });
  }

  public getOrderById(id: string) {
    return this.http.get<IOrder>(`${this.API_PATH}/${id}`).pipe(take(1));
  }

  public async newOrder(order: IOrder) {
    return await firstValueFrom(this.http.post<ResponseOrder>(this.API_PATH, order).pipe(take(1)));
  }

  public async updateOrder(order: IOrder) {
    return await firstValueFrom(this.http.put<ResponseOrder>(`${this.API_PATH}`, order).pipe(take(1)));
  }

  public deleteOrder(id: string) {
    return this.http.delete(`${this.API_PATH}/${id}`).pipe(take(1));
  }

  public savePayment(payment: IPaymentOrder) {
    if (payment.id) {
      return this.http.put(`${this.API_PATH}/payment`, payment).pipe(take(1));
    } else {
      return this.http.post(`${this.API_PATH}/payment`, payment).pipe(take(1));
    }
  }

  public deletePayment(idOrder: string, idPayment: string) {
    return this.http.delete(`${this.API_PATH}/payment/${idOrder}/${idPayment}`).pipe(take(1));
  }

  public saveSubservice(subservice: ISubserviceOrder) {
    if (subservice.id) {
      return this.http.put(`${this.API_PATH}/subservice`, subservice).pipe(take(1));
    } else {
      return this.http.post(`${this.API_PATH}/subservice`, subservice).pipe(take(1));
    }
  }

  public deleteSubservice(idOrder: string, idSubservice: string) {
    return this.http.delete(`${this.API_PATH}/subservice/${idOrder}/${idSubservice}`).pipe(take(1));
  }

}

interface UserParams {
  open?: boolean,
  payment_status?: PaymentStatus,
  client?: IUser,
  title?: string,
}

export interface ResponseOrder {
  message: string,
  order: IOrder,
}