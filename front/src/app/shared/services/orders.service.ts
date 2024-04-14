import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IOrder } from '../models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private http = inject(HttpClient);

  public orders$ = this.http.get<IOrder[]>(`/api/orders`);

}
