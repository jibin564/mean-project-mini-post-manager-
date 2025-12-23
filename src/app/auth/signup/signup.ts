import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCard } from "@angular/material/card";

import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-signup',
  imports: [MatCard, MatProgressSpinner,MatFormFieldModule, NgIf, FormsModule,MatInputModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  isLoading=false;
  constructor(public AuthService:AuthService){
  }

onSignup(form:NgForm){
  if(form.invalid){
    return;
  }
  this.AuthService.createUser(form.value.email,form.value.password);
}

}
