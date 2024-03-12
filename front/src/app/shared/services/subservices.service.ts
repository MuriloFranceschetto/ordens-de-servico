import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ISubservice } from '../models/Subservice';

@Injectable({
  providedIn: 'root'
})
export class SubservicesService {

  private readonly API_PATH = `/api/subservices`;

  private http = inject(HttpClient);

  public subservices$ = this.http.get<ISubservice[]>(this.API_PATH);

  public getSubservice(id: string) {
    return this.http.get<ISubservice>(`${this.API_PATH}/${id}`);
  }

  public newSubservice(user: any) {
    return this.http.post(this.API_PATH, user);
  }

  public updateSubservice(id: string, user: any) {
    return this.http.put(`${this.API_PATH}/${id}`, user);
  }

  public deleteSubservice(id: string) {
    return this.http.delete(`${this.API_PATH}/${id}`);
  }

}
