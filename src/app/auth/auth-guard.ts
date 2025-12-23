import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from './auth.service';
import { inject } from "@angular/core";

export const AuthGuard: CanActivateFn= () => {
    const Auth = inject(AuthService)
    const router = inject(Router);
    if(!Auth.getIsAuth()){
        router.navigate(['/login']);
        return false;
    }
    return true;
}

