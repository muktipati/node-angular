import { Component, OnInit, OnDestroy } from '@angular/core';
import {NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {
  isLoading:boolean=false
  private authStatusSub:Subscription
  constructor(public AuthService:AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.AuthService.getAuthStatusListener().subscribe((authStatus)=>{
      this.isLoading = false;
    })
  }

  onSignup(form:NgForm ){
    if(form.invalid){
      return ;
    }
 
   this.AuthService.createUser(form.value.email,form.value.password)
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }


}
