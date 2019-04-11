import { Component,  OnInit, OnDestroy } from "@angular/core";
import { Post } from '../post.model'
import { PostsService } from '../posts.service';
import {Subscription } from 'rxjs'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
    selector: "app-post-list",
    templateUrl: "./post-list.component.html",
    styleUrls: ["./post-list.component.css"]
  })
  export class PostListComponent implements OnInit, OnDestroy {
    userIsAuthenticated =false
    posts: Post[] = [];
    isLoading:boolean=false;
    private postsSub: Subscription;
    totalPost=0;
    postPerPage=2
    currentPage = 1
    pageSizeOptions = [1,2,5,10];
    userId:string;
    
    private authListenerSub:Subscription
    constructor(public postsService: PostsService,public authService:AuthService) {}
  
    ngOnInit() {
     
    this.isLoading=true;
      this.postsService.getPosts(this.postPerPage,this.currentPage);
     this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData:{posts: Post[],maxCount:number}) => {
        this.isLoading=false;
        this.totalPost = postData.maxCount;
        this.posts = postData.posts;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authListenerSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated =>{
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
    })
    }
  
    onDelete(postId: string) {
      this.isLoading=true;
      this.postsService.deletePost(postId).subscribe(()=>{
        this.postsService.getPosts(this.postPerPage,this.currentPage);
      },()=>{
        this.isLoading=false;
      });
    }
    onPagechanged(pageData:PageEvent){
      console.log(pageData)
      this.currentPage = pageData.pageIndex+1;
      this.postPerPage = pageData.pageSize;
      this.postsService.getPosts(this.postPerPage,this.currentPage);
    }
  
    ngOnDestroy() {
      this.postsSub.unsubscribe();
      this.authListenerSub.unsubscribe();
    }
  }
  