import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';

import { AuthService } from '../../services/auth.service';

export const expiredTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  return next(req)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        if (req.url !== '/api/auth' && err.status === 401) {
          authService.logout();
        }
        return throwError(() => err);
      }),
    );
}