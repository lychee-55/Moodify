// types/post.ts
export interface Post {
  post_id: number;
  post_image: string;
  title: string;
  tags: string;
  author: {
    user_id: number;
    nickname: string;
    profile_image: string;
  };
}
