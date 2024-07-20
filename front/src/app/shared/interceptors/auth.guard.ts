import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { tap } from "rxjs";

export const isAuthenticatedGuard: CanActivateFn | CanActivateChildFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated$
        .pipe(
            tap((isAuthenticated) => {
                if (!isAuthenticated) {
                    router.navigate(['login'])
                }
            })
        );
}