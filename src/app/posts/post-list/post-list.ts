import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  imports: [MatExpansionModule, FormsModule, NgFor, NgIf, RouterLink,MatProgressSpinnerModule,MatPaginator,CommonModule],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostList implements OnInit,OnDestroy {
  isLoading: boolean = false;
  totalPosts = 8;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  userIsAuthenticated: boolean = false;
  authStatusSub: Subscription = new Subscription();
  constructor(private readonly postsr:PostsService, private authservice:AuthService) {}
  readonly panelOpenState = signal(false);
  Posts:Post[] = [];
  private postsub:Subscription | undefined;
  userId: string = '';

  /* posts = signal([
    {title: 'first post', content: 'this is the first post content'},
    {title: 'second post', content: 'this is the second post content'},
    {title: 'third post', content: 'this is the third post content'},
  ]);  */

  ngOnInit() {
    this.isLoading = true;
    this.authservice.autoAuthUser();
    this.userId = this.authservice.getuserid();
    this.postsr.getPosts(this.postsPerPage,this.currentPage);
   this.postsub= this.postsr.getPostUpdateListener().subscribe((postData:{posts:Post[],postCount:number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.Posts = postData.posts;
    });
    this.userIsAuthenticated = this.authservice.getIsAuth();
    this.authStatusSub = this.authservice.getauthStatusListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authservice.getuserid();
    });
    
    
  }
  ngOnDestroy() {
    this.postsub?.unsubscribe();
  }

  onChangedPage(pageData:PageEvent) {
      this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsr.getPosts(
      this.postsPerPage,this.currentPage
    );

  }
  ondelete(postid:string) {
    this.isLoading=true;
    console.log("Delete called for id:"+postid);
    this.postsr.deletePost(postid).subscribe(()=>{
      this.postsr.getPosts(this.postsPerPage,this.currentPage);
    });
  };

}
