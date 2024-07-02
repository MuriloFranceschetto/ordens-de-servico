import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ISubservice } from '../models/subservice/ISubservice';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubservicesService {

  private readonly API_PATH = `/api/subservices`;

  private http = inject(HttpClient);

  public FN_COMPARE_WITH_SUBSERVICES = (subserviceA: ISubservice, subserviceB: ISubservice) => subserviceA?.id === subserviceB?.id;

  public subservices$ = this.http.get<ISubservice[]>(this.API_PATH);

  public getSubservice(id: string) {
    return this.http.get<ISubservice>(`${this.API_PATH}/${id}`).pipe(take(1));
  }

  public newSubservice(user: any) {
    return this.http.post(this.API_PATH, user).pipe(take(1));
  }

  public updateSubservice(id: string, user: any) {
    return this.http.put(`${this.API_PATH}/${id}`, user).pipe(take(1));
  }

  public deleteSubservice(id: string) {
    return this.http.delete(`${this.API_PATH}/${id}`).pipe(take(1));
  }

}
