export interface Post {
  id?: string;
  title: string;
  content: string;
  image?: File;        // for uploading
  imagePath?: string;  // for displaying image
  creater?: string;
}
