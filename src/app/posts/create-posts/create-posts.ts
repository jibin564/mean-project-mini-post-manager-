import { Component,inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule,ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { mimeType } from './mime.type.validator';


@Component({
  selector: 'app-create-posts',
  imports: [FormsModule, MatInputModule, MatCardModule, MatButtonModule, NgIf,MatProgressSpinnerModule,ReactiveFormsModule],
  templateUrl: './create-posts.html',
  styleUrl: './create-posts.css',
})
export class CreatePosts implements OnInit {
  form!:FormGroup
  private mode = 'create';
  private postid: string | null = null;
  private post: Post | undefined;
  private postsr = inject(PostsService);
  isLoading: boolean = false;
  imagePreview: string | ArrayBuffer | null | undefined = null;
  constructor(public route: ActivatedRoute,) {}
//  @Output() postcreated = new EventEmitter<{title: string, content: string}>();

  ngOnInit() {
    this.form = new FormBuilder().group({
      title:['',[Validators.required,Validators.minLength(3)]],
      content:['',Validators.required],
      image:[null]
    });
    this.route.paramMap.subscribe(
      (paramMap:ParamMap) => {
        if (paramMap.has('postid')) {
          this.mode = 'edit';
          this.postid = paramMap.get('postid');
          this.isLoading = true;
          this.postsr.getPost(this.postid!).subscribe(postData => {
          this.isLoading = false;
            this.post = {
              id: postData._id,
            title:postData.title,
            content:postData.content,
            imagePath:postData.imagePath
          }
          this.form.patchValue({
            title: this.post!.title,
            content: this.post!.content,
            imagePath: this.post!.imagePath
          })
          console.log(this.post);
          this.imagePreview = this.post.imagePath;

        } );
            this.form.get('image')?.clearValidators();
            this.form.get('image')?.clearAsyncValidators();
          this.form.get('image')?.updateValueAndValidity();
         
      }
        else {
          this.mode = 'create';
          this.postid = null;
           this.form.get('image')?.setValidators([Validators.required]);
           this.form.get('image')?.setAsyncValidators([mimeType]);
            this.form.get('image')?.updateValueAndValidity();
          }
        }
    );
   
  }
onsavepost() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      const newpost:Post ={
        title:this.form.value.title,
        content:this.form.value.content,
        image:this.form.value.image
      };
      this.postsr.addPost(newpost);
    } else{
      this.postsr.updatePost(this.postid!,
         this.form.value.title,
          this.form.value.content,
          this.form.value.image
        );
    }
    //this.form.reset(); 
//    this.postcreated.emit(post);
    
}

onImagePicked(event: any) {
  const files = (event.target as HTMLInputElement).files;
  if (!files || files.length === 0) {
    return;
  }
  const file = files[0]; // get actual image file
  this.form.patchValue({ image: file });
  this.form.get('image')?.updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = () => {
    // @ts-ignore
    this.imagePreview = reader.result;
  };
  reader.readAsDataURL(file);
}

}
