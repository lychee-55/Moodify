// src/pages/SearchResultPage.tsx
import { useLocation, useParams } from 'react-router-dom';
import PostList from '../components/main/moodPost/PostList';

export default function SearchResultPage() {
  // const { filter } = useParams<{ filter: string }>();
  // const decodedFilter = decodeURIComponent(filter ?? '');
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const keyword = params.get('keyword') || '';

  return (
    <div className="px-6 md:px-20 pt-16">
      <h2 className="text-2xl font-bold mb-6 pb-12 flex justify-center">
        "{keyword}"의 검색결과
      </h2>
      <PostList
        fetchUrl={`${process.env.REACT_APP_API_SERVER}/li/moodPosts/search`}
        queryParams={{ keyword }}
      />
    </div>
  );
}
