import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EventType, Router } from '@angular/router';
import { BehaviorSubject, filter, map, merge, Observable, take } from 'rxjs';

const TOKEN_KEY = 'token';
const API_PATH = `/api/auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Dependencies
  private router = inject(Router);
  private http = inject(HttpClient);

  // Evento para quando a aplicação redirecionar para outra página
  private readonly routeChanges$ = this.router.events.pipe(filter((event) => event.type === EventType.ActivationStart));
  private readonly _initialToken$ = new BehaviorSubject(this.getToken()).pipe(take(1));

  public readonly isAuthenticated$: Observable<boolean> = merge(this._initialToken$, this.routeChanges$)
    .pipe(
      map(() => !!this.getToken()),
    );

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  public setTokenToLocalStorage(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public login(email: string, password: string) {
    return this.http.post<{ access_token: string }>(API_PATH, { email, password }).pipe(take(1));
  }

  public logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['login']);
  }

}
