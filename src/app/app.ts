import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreatePosts } from "./posts/create-posts/create-posts";
import { Header } from "./header/header";
import { PostList } from "./posts/post-list/post-list";
import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  auth= inject(AuthService)
  ngOnInit(): void {
    this.auth.autoAuthUser();  
  }

  
}
