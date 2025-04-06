export default function MyLikes() {
  return (
    <>
      <PostCard title="노래 제목1" imgSrc="/example1.jpg" />
      <PostCard title="노래 제목2" imgSrc="/example2.jpg" />
    </>
  );
}
function PostCard({ title, imgSrc }: { title: string; imgSrc: string }) {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition">
      <img src={imgSrc} alt={title} className="w-full h-48 object-cover" />
      <div className="p-2">
        <h4 className="text-sm font-medium truncate">{title}</h4>
      </div>
    </div>
  );
}
