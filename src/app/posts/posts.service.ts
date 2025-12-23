import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
    private posts:Post[] = [];
    private postupdated = new Subject<{posts:Post[],postCount:number}>();
    constructor(private http: HttpClient, private router:Router ) {}
    getPosts(postsPerPage:number,currentPage:number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http.get<{message:string,posts:any,maxPosts:number}>(`${environment.apiUrl}/posts` + queryParams)
        .pipe(map((postdata)=>{
            return {posts:postdata.posts.map((post:any)=>{
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath,
                    creater: post.creator
                };
            }),
            maxPosts:postdata.maxPosts
        } 
        })).subscribe({
  next: transformedpostData => {
    console.log(transformedpostData);
    this.posts = transformedpostData.posts;
    this.postupdated.next({
      posts: [...this.posts],
      postCount: transformedpostData.maxPosts
    });
  },
  error: err => {
    console.error("Error fetching posts:", err);
    this.postupdated.next({ posts: [], postCount: 0 }); // still emit something
  }
});


    }
    getPostUpdateListener() {
        return this.postupdated.asObservable();
    }

    getPost(id:string) {
        return this.http.get<{_id:string,title:string,content:string,imagePath:string}>(`${environment.apiUrl}/posts/` + id);
    }
    addPost(post: Post) {
        const postData = new FormData();
        postData.append("title", post.title);
        postData.append("content", post.content);
        if(post.image){
             postData.append("image", post.image, post.title);
        }
        this.http.post<{message:string,post:{ id: string, title: string, content: string, imagePath: string }}>(`${environment.apiUrl}/posts`, postData)
        .subscribe((responseData)=>{
            /* console.log(responseData.message);
            const newpost:Post = {
                id:responseData.post.id,
                title:post.title,
                content:post.content,
                imagePath: responseData.post.imagePath
            };
            this.posts.push(newpost);
            this.postupdated.next([...this.posts]); */
            this.router.navigate(['/']);
        });
    };

    updatePost(id:string, title:string, content:string,image:File | string) {
        let postData: Post | FormData;
        if(image instanceof File){
            postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);
        }else{
            postData = {id:id, title:title, content:content,imagePath:image || undefined};
        }
        // const post:Post = {id:id, title:title, content:content,imagePath:undefined};
        this.http.put<{message:string,imagePath:string}>(`${environment.apiUrl}/posts/` + id, postData).subscribe(response => {
            /* console.log(response);
            const updatedposts = [...this.posts];
            const oldpostindex = updatedposts.findIndex(p => p.id === id);
            let imagePath = (typeof(image) === 'string') ? image :response.imagePath;
            const post: Post = {id:id,
                 title:title,
                  content:content,
                  imagePath:response.imagePath
                };
            updatedposts[oldpostindex] = post;
            this.posts = updatedposts;
            this.postupdated.next([...this.posts]); */
            this.router.navigate(['/']);

        });
    }

    deletePost(postid: string) {
      return  this.http.delete(`${environment.apiUrl}/posts/` + postid);
    }

}