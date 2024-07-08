import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ICompleteUser, IUser } from '../models/User';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly API_PATH = `/api/users`;

  private readonly http = inject(HttpClient);

  public FN_COMPARE_WITH_USERS = (clientA: IUser, clientB: IUser) => clientA?.id === clientB?.id;

  public users$ = this.http.get<IUser[]>(this.API_PATH);

  public getAllUsers(page: number = 1, limit: number = 10) {
    return this.http.get<{ users: IUser[], total: number }>(`${this.API_PATH}/page`, {
      params: { page, limit }
    });
  }

  public getUser(id: string) {
    return this.http.get<ICompleteUser>(`${this.API_PATH}/${id}`).pipe(take(1));
  }

  public newUser(user: any) {
    return this.http.post(`${this.API_PATH}`, user).pipe(take(1));
  }

  public updateUser(id: string, user: any) {
    return this.http.put(`${this.API_PATH}/${id}`, user).pipe(take(1));
  }

  public deleteUser(id: string) {
    return this.http.delete(`${this.API_PATH}/${id}`).pipe(take(1));
  }

}
