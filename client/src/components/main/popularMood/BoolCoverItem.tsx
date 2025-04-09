// 책 타입 정의 (props 구조 지정용)
type Book = {
  bookId: string;
  userName: string;
  title: string;
  texts: string;
  coverUrl: string;
  images: string[];
};

export default function BookCoverItem({ book }: { book: Book }) {
  return (
    <div className="book-cover w-[230px] mx-auto transition-all duration-300 hover:scale-105">
      {/* 책 커버 이미지 */}
      <img
        src={book.coverUrl}
        alt={book.title}
        className="w-full h-64 object-cover rounded-lg shadow-md"
      />
      {/* 텍스트 영역 */}
      <div className="mt-3 p-2">
        <h3 className="text-lg font-bold truncate">{book.title}</h3>
        <p className="text-sm text-gray-500">by {book.userName}</p>
      </div>
    </div>
  );
}
