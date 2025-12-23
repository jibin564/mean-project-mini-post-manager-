import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  token: string = '';
  constructor(private http: HttpClient, private Router: Router) {}
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string = '';
  private authstatusListener = new BehaviorSubject<boolean>(false);

  getauthStatusListener() {
    return this.authstatusListener.asObservable();
  }
  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(`${environment.apiUrl}/user/signup`, authData).subscribe({
      next:(Response) =>{
        console.log(Response);
        this.Router.navigate(['/']);
      },
      error:(err)=>{
        alert("Email already exists. Please try Login.");
        this.Router.navigate(['/login']);
      }
    });   
    }
  
  Login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number, userId: string }>(`${environment.apiUrl}/user/login`, authData)
      .subscribe((response) => {
        const token = response.token;
        const expiresInDuration = response.expiresIn;
        if (token) {
          this.token = token;
          this.isAuthenticated = true;
          this.userId = response.userId
          this.authstatusListener.next(true);
          this.setLogoutTimer(expiresInDuration);
          const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate,this.userId);
          this.Router.navigate(['/']);
        }
      },
    (err) =>{
      console.log(err);
    });
  }
  getuserid(){
    return this.userId;
  }

  private setLogoutTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private saveAuthData(token: string, expirationDate: Date, userId?: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.userId = '';
    this.authstatusListener.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    clearTimeout(this.tokenTimer);
    this.Router.navigate(['/']);
  }
  autoAuthUser() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    const expiresIn = new Date(expirationDate).getTime() - new Date().getTime();
    if (expiresIn > 0) {
      this.isAuthenticated = true;
      this.authstatusListener.next(true);
      this.userId = userId ? userId : '';
      this.setLogoutTimer(expiresIn / 1000);
    } else {
      this.logout();
    }
  }
}
