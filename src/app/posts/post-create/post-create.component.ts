import { Component, OnInit, OnDestroy } from "@angular/core";
import {ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms'
import { NgForm, FormBuilder } from '@angular/forms';
import { PostListComponent } from '../post-list/post-list.component';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import {mimeType} from './mime-type.validator'
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: "app-post-create",
    templateUrl: "./post-create.component.html",
    styleUrls: ["./post-create.component.css"]
  })
  export class PostCreateComponent implements OnInit,OnDestroy {
    enteredTitle = "";
    enteredContent = "";
    title:string;
    content:string;
    post: Post;
    isLoading=false;
    postForm:FormGroup;
    private mode = "create";
    private postId: string;
    form:FormGroup;
    imagePreview:any;
    private authStatusSub:Subscription;
  
    constructor( public postsService: PostsService,public route: ActivatedRoute,private authservice:AuthService) {    }
  
    ngOnInit() {
      this.authStatusSub = this.authservice.getAuthStatusListener().subscribe(()=>{
        this.isLoading = false;
      })
      this.form = new FormGroup({
        title:new FormControl(null,{
          validators:[Validators.required,Validators.minLength(3)]
        }),
        content:new FormControl(null,{
          validators:[Validators.required]
        }),
        image:new FormControl(null,{
          validators:[Validators.required],
          asyncValidators:[mimeType]
        })
      })
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has("postId")) {
          this.mode = "edit";
          this.postId = paramMap.get("postId");
          //this.postsService.getPost(this.postId).subscribe();
          this.isLoading=true
          this.postsService.getPost(this.postId).subscribe(postData =>{
           console.log("postdata",postData)
            this.post ={id:postData._id,
              title:postData.title,
              content:postData.content,
              imagePath:postData.imagePath,
              creator:postData.creator
            }
            this.isLoading=false;
            console.log("posts",this.post)
            this.form.setValue({
              title:this.post.title,
              content:this.post.content,
              image:this.post.imagePath
              
            })
          })
        } else {
          this.mode = "create";
          this.postId = null;
        }
      });
    }
    onImagePicker(event:Event){
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({image:file});
      this.form.get('image').updateValueAndValidity();
     const reader = new FileReader();
     console.log(reader);
     reader.onload = ()=>{
       this.imagePreview = reader.result;
     };
     reader.readAsDataURL(file);
    }
  
    onSavePost() {
      if (this.form.invalid) {
        return;
      }
      this.isLoading=true;
      if (this.mode === "create") {
        
        this.postsService.addPost(this.form.value.title, this.form.value.content,this.form.value.image);
      } else {
        this.postsService.updatePost(
          this.postId,
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
        );
      }
      this.form.reset();
    }
    ngOnDestroy(){
      this.authStatusSub.unsubscribe();
    }
  }
  