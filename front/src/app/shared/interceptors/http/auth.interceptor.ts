import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authToken = inject(AuthService).getToken();
    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${authToken}`
        }
    });
    return next(authReq);
}