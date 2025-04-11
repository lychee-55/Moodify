import { useEffect, useState } from 'react';
import Nav from '../components/common/Nav';
import PopularMood from '../components/main/popularMood/PopularMood';
import PostList from '../components/main/moodPost/PostList';
import axios from 'axios';
interface Post {
  id: number;
  imageUrl: string;
  title: string;
  author: string;
  createdAt: string;
  summary?: string;
}

export default function MainPage() {
  // const [posts, setPosts] = useState<Post[]>([]); // API에서
  // const [loading, setLoading] = useState(true);

  // if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="h-full">
        <Nav />
        <PopularMood />
        <PostList />
      </div>
    </>
  );
}
