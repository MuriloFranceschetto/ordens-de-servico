import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ICompleteUser, IUser } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient);

  public FN_COMPARE_WITH_USERS = (clientA: IUser, clientB: IUser) => clientA?.id === clientB?.id;

  public users$ = this.http.get<IUser[]>(`/api/users`);

  public getUser(id: string) {
    return this.http.get<ICompleteUser>(`/api/users/${id}`);
  }

  public newUser(user: any) {
    return this.http.post(`/api/users`, user);
  }

  public updateUser(id: string, user: any) {
    return this.http.put(`/api/users/${id}`, user);
  }

  public deleteUser(id: string) {
    return this.http.delete(`/api/users/${id}`);
  }

}
