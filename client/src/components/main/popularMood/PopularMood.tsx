import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BookCoverItem from './BoolCoverItem';
import { SampleNextArrow, SamplePrevArrow } from './SlideArrow';

// 책 타입 정의 (props 구조 지정용)
type Book = {
  bookId: string;
  userName: string;
  title: string;
  texts: string;
  coverUrl: string;
  images: string[];
};

// 테스트용 mock 데이터
const mockBooks: Book[] = [
  {
    bookId: '1',
    userName: 'user1',
    title: 'The Great Adventure',
    texts: 'An exciting journey through unknown lands',
    coverUrl: 'https://via.placeholder.com/300x400?text=Book+1',
    images: [],
  },
  {
    bookId: '2',
    userName: 'user2',
    title: 'Ocean Mysteries',
    texts: 'Discover the secrets of the deep blue sea',
    coverUrl: 'https://via.placeholder.com/300x400?text=Book+2',
    images: [],
  },
  {
    bookId: '3',
    userName: 'user3',
    title: 'Mountain Dreams',
    texts: 'Climbing to the top of the world',
    coverUrl: 'https://via.placeholder.com/300x400?text=Book+3',
    images: [],
  },
  {
    bookId: '4',
    userName: 'user4',
    title: 'City Lights',
    texts: 'Stories from the urban jungle',
    coverUrl: 'https://via.placeholder.com/300x400?text=Book+4',
    images: [],
  },
  {
    bookId: '5',
    userName: 'user5',
    title: 'Desert Tales',
    texts: 'Surviving in the harshest environments',
    coverUrl: 'https://via.placeholder.com/300x400?text=Book+5',
    images: [],
  },
];

// react-slick 슬라이더 설정
const settings = {
  dots: true, // 하단 점 네비게이션 표시
  infinite: true, // 무한 루프
  slidesToShow: 3, // 보여줄 슬라이드 수
  swipeToSlide: true, // 슬라이드로 전환 가능
  speed: 300, // 전환 속도
  nextArrow: <SampleNextArrow />, // 커스텀 다음 화살표
  prevArrow: <SamplePrevArrow />, // 커스텀 이전 화살표
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2, // 화면 너비 1024px 이하일 경우 2개 표시
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1, // 화면 너비 768px 이하일 경우 1개 표시
      },
    },
  ],
};

// PopularMood 슬라이더 컴포넌트
export default function PopularMood({ books = mockBooks }: { books?: Book[] }) {
  return (
    <div className="w-full max-w-[1000px] mx-auto p-[30px] box-border relative">
      {/* 섹션 제목 */}
      <h2 className="text-2xl font-bold mb-6 text-center">Popular Moods</h2>

      {/* react-slick 슬라이더 */}
      <Slider {...settings}>
        {books.map(book => (
          <div key={book.bookId} className="px-2 outline-none">
            <BookCoverItem book={book} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
