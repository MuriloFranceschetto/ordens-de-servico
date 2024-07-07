import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ICompleteUser, IUser } from '../models/User';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient);

  public FN_COMPARE_WITH_USERS = (clientA: IUser, clientB: IUser) => clientA?.id === clientB?.id;

  public users$ = this.http.get<IUser[]>(`/api/users`);

  public getAllUsers(page: number = 1, limit: number = 10) {
    return this.http.get<{ users: IUser[], total: number }>(`/api/users/page`, {
      params: { page, limit }
    });
  }

  public getUser(id: string) {
    return this.http.get<ICompleteUser>(`/api/users/${id}`).pipe(take(1));
  }

  public newUser(user: any) {
    return this.http.post(`/api/users`, user).pipe(take(1));
  }

  public updateUser(id: string, user: any) {
    return this.http.put(`/api/users/${id}`, user).pipe(take(1));
  }

  public deleteUser(id: string) {
    return this.http.delete(`/api/users/${id}`).pipe(take(1));
  }

}
