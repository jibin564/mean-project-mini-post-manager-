import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { HttpInterceptorFn } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';

export const Errorinterceptor:HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authservice = inject(AuthService);
    const snackbar = inject(MatSnackBar);
    return next(req).pipe(
        catchError(error =>{
            if(error.status === 401){
                authservice.logout();
                snackbar.open(' Unable to login.Please check your credentials.', 'Close', { duration: 3000 });
                router.navigate(['/login']);
            } else if (error.status === 403) {
                snackbar.open('You do not have permission to perform this action.', 'Close', { duration: 3000 });

            }else if(error.status === 0){
                snackbar.open('Cannot connect to the server. Please check your internet connection.', 'Close', { duration: 3000 });
            }
            else if(error.status === 500){
                snackbar.open('An unexpected error occurred. Please try again later.', 'Close', { duration: 3000 });    
            } else{
                const errorMessage = error.error.message || 'An error occurred. Please try again.';
                snackbar.open(errorMessage, 'Close', { duration: 3000 });
            }
            return throwError(() => error);
        })
    );


}