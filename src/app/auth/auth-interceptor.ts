
import { HttpInterceptorFn } from '@angular/common/http';
export const Authinterceptor:HttpInterceptorFn = (req, next) => {
        const authToken = localStorage.getItem("token");
        console.log('INTERCEPTOR RUNNING, token =', authToken);
        if (!authToken) {
            return next(req);
        }
        const authrequest = req.clone({
            headers:req.headers.set(
                "Authorization","Bearer " + authToken

            )
        }) 
        return next(authrequest);
        
    }
