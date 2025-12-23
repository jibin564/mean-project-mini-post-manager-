import { Component, inject } from '@angular/core';
import { MatCard } from "@angular/material/card";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

import { NgIf } from '@angular/common';
import { FormsModule, NgForm } from "@angular/forms";
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../auth.service';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatCard, MatProgressSpinner, MatFormFieldModule, MatError, NgIf, FormsModule,MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
isLoading=false;
router = inject(Router);

constructor(public AuthService:AuthService){}

onLogin(form:NgForm){
  if(form.invalid){
    return;
  }
  this.AuthService.Login(form.value.email,form.value.password);
  this.router.navigate(['/']);

}
}
