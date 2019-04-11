import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

import {environment} from "../../environments/environment"
const BACKEND_URL = environment.apiUrl+"/user/";
@Injectable({ providedIn: "root" })

export class AuthService {
    private isAuthenticated =false;
    private token:string;
    private userId:string;
    private tokenTimer:any;
    private authStatusListener = new Subject<boolean>();
    constructor(private http: HttpClient,private router:Router) {}
    getToken(){
      
        return this.token;
    }
    getIsAuth(){
        return this.isAuthenticated;
    }
    getUserId(){
        return this.userId;
    }
    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }
    createUser(email:string,password:string){
        const authData:AuthData = {
            email:email,
            password:password
        }
        this.http.post(BACKEND_URL+"/signup",authData).subscribe(() => {
            this.router.navigate(["/"])
        },err => {
            this.authStatusListener.next(false);
        })

    }
    login(email:string,password:string){
        const authData:AuthData = {
            email:email,
            password:password
        }
        this.http.post<{token:string,expiresIn:number,userId:string}>(BACKEND_URL+"/login",authData).subscribe(response =>{
           const token = response.token;
           this.token = token;
           if(token){
               const expireDuration = response.expiresIn;
               this.setAuthTimer(expireDuration);
            this.authStatusListener.next(true);
            this.isAuthenticated =true;
            this.userId = response.userId
            const now = new Date();
            const expirationDate = new Date(now.getTime()+expireDuration*1000)
            console.log("expirationDate",expirationDate)
            this.saveAuthData(token,expirationDate,this.userId)
            this.router.navigate(["/"]);
           }
        },(error)=>{
            this.authStatusListener.next(false);
        })  
    } 
    autoAuthUser(){
        const autoAuthInformation = this.getAuthData();
        if(!autoAuthInformation){
            return null;
        }
        const now = new Date();
        const expireIn = autoAuthInformation.expirationDate.getTime()-now.getTime();
        if(expireIn>0){
            this.token =autoAuthInformation.token;
            this.isAuthenticated =true;
            this.userId = autoAuthInformation.userId;
            this.setAuthTimer(expireIn/1000)
            this.authStatusListener.next(true); 
        }
    }
    setAuthTimer(duration:number){
        console.log("set timer",duration)
        this.tokenTimer = setTimeout(()=>{
            this.logout();
           },duration*1000)
    }
    logout(){
        this.token =null;
        this.isAuthenticated =false;
        this.userId = null;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(["/"]);
    }
    private saveAuthData(token:string,expirationDate:Date,userId:string){
        localStorage.setItem("token",token);
        localStorage.setItem("expirationDate",expirationDate.toISOString())
        localStorage.setItem("userId",userId);
    }
    clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expirationDate");
        localStorage.removeItem("userId");
    }
    private getAuthData(){
        const token = localStorage.getItem("token")
        const expirationDate = localStorage.getItem("expirationDate");
        const userId = localStorage.getItem("userId")
        if(!token || !expirationDate){
            return
        }
        return {
            token:token,
            expirationDate:new Date(expirationDate),
            userId:userId
        }
    }
}