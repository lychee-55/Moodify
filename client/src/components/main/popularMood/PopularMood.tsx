// src/components/PopularMood.tsx
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { SampleNextArrow, SamplePrevArrow } from './SlideArrow';
import axios from 'axios';
import BookCoverItem from './BoolCoverItem';
import { Book } from '../../../types/post';
import DescriptionPage from '../../../pages/DescriptionPage';

const settings = {
  dots: true,
  infinite: true,
  slidesToShow: 3,
  swipeToSlide: true,
  speed: 300,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

export default function PopularMood() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleBookClick = (postId: number) => {
    setSelectedPostId(postId);
  };

  const handleClosePost = () => {
    setSelectedPostId(null);
  };

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/main/popularMood`,
          {
            withCredentials: true,
          },
        ); // 실제 엔드포인트로 교체
        setBooks(res.data.data); // res.data가 Book[] 형태여야 함
      } catch (err) {
        setError('인기 게시글을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBooks();
  }, []);

  if (loading) return <p className="text-center mt-10">불러오는 중...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    // pacifico-regular
    <div className="w-full max-w-[1000px] mx-auto p-[30px] box-border relative">
      <h2 className="text-2xl font-bold mb-6 text-center ">
        ✨이달의 베스트 <span className="pacifico-regular">Mood</span>✨
      </h2>
      <Slider {...settings}>
        {books.map(book => (
          <div key={book.post_id} className="px-2 outline-none">
            <BookCoverItem
              book={book}
              onClick={() => handleBookClick(book.post_id)}
            />
          </div>
        ))}
      </Slider>

      {/* 모달 */}
      {selectedPostId && (
        <DescriptionPage
          postId={selectedPostId}
          onClose={handleClosePost}
          fetchUrl={`${process.env.REACT_APP_API_SERVER}/li/moodPosts/view/${selectedPostId}`}
        />
      )}
    </div>
  );
}
