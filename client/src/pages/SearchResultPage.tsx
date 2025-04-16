// src/pages/SearchResultPage.tsx
import { useParams } from 'react-router-dom';
import PostList from '../components/main/moodPost/PostList';

export default function SearchResultPage() {
  const { filter } = useParams<{ filter: string }>();
  const decodedFilter = decodeURIComponent(filter ?? '');

  return (
    <div className="px-6 md:px-20 pt-24">
      <h2 className="text-2xl font-bold mb-6">"{filter}"의 검색결과</h2>
      <PostList
        fetchUrl={`${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/${decodedFilter}`}
        queryParams={{ keyword: filter }}
      />
    </div>
  );
}
