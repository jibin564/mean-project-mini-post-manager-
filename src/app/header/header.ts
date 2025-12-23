import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from "@angular/router";

import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit,OnDestroy {
AuthService = inject(AuthService);
private authsub!:Subscription;
  isAuthenticated: boolean = false;

ngOnInit(): void {
    this.authsub = this.AuthService.getauthStatusListener().subscribe(authenticated =>{
      this.isAuthenticated = authenticated;
    })
}


onLogout(){
  this.AuthService.logout();
}
ngOnDestroy(): void {
  this.authsub.unsubscribe();
}
  }

