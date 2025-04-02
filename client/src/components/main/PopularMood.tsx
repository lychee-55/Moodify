import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type Book = {
  bookId: string;
  userName: string;
  title: string;
  texts: string;
  coverUrl: string;
  images: string[];
};

type ArrowProps = {
  className?: string;
  // style?: React.CSSProperties;
  style?: string;
  onClick?: () => void;
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

const SampleNextArrow = ({ className, style, onClick }: ArrowProps) => (
  <div
    className={className}
    style={{
      // ...style,
      display: 'block',
      background: '#333',
      borderRadius: '50%',
    }}
    onClick={onClick}
  />
);

const SamplePrevArrow = ({ className, style, onClick }: ArrowProps) => (
  <div
    className={className}
    style={{
      // ...style,
      display: 'block',
      background: '#333',
      borderRadius: '50%',
    }}
    onClick={onClick}
  />
);

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

const BookCover = ({ book }: { book: Book }) => (
  <div className="book-cover w-[230px] mx-auto transition-all duration-300 hover:scale-105">
    <img
      src={book.coverUrl}
      alt={book.title}
      className="w-full h-64 object-cover rounded-lg shadow-md"
    />
    <div className="mt-3 p-2">
      <h3 className="text-lg font-bold truncate">{book.title}</h3>
      <p className="text-sm text-gray-500">by {book.userName}</p>
    </div>
  </div>
);

// books prop을 선택적으로 변경하고 기본값 설정
const PopularMood = ({ books = mockBooks }: { books?: Book[] }) => {
  return (
    <div className="w-full max-w-[1000px] mx-auto p-[30px] box-border relative">
      <h2 className="text-2xl font-bold mb-6 text-center">Popular Moods</h2>
      <Slider {...settings}>
        {books.map(book => (
          <div key={book.bookId} className="px-2 outline-none">
            <BookCover book={book} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PopularMood;
