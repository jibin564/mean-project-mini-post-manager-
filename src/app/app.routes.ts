import { Routes } from '@angular/router';
import { PostList } from './posts/post-list/post-list';
import { Signup } from './auth/signup/signup';
import { AuthGuard } from './auth/auth-guard';

export const routes: Routes = [
    { path:'', component: PostList},
    {path: 'create', loadComponent: () => import('./posts/create-posts/create-posts').then(m => m.CreatePosts),canActivate:[AuthGuard]},
    {path: 'edit/:postid', loadComponent: () => import('./posts/create-posts/create-posts').then(m => m.CreatePosts)},
    {path:"login",loadComponent:() => import('./auth/login/login').then(m=>m.Login)},
    {path:"signup",loadComponent:() => import('./auth/signup/signup').then(m=>m.Signup)}
];
