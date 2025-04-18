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
  return (
    <>
      <div className="h-full">
        <Nav />
        <PopularMood />
        {/* <div className="pt-10 max-w-screen-lg sm:px-4 md:px-4 lg:px-0 mx-auto"> */}
        <div className="pt-10 px-4 max-w-screen-lg lg:px-0  mx-auto">
          <h2 className="text-2xl font-bold mb-6">이런 무드는 어떤가요?</h2>
        </div>
        <PostList
          fetchUrl={`${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/moodList`}
        />
      </div>
    </>
  );
}
