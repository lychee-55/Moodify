import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Post = {
  id: number;
  image: string;
  title: string;
  likes: number;
  author: string;
};

export default function PopularMood() {
  // 임시 데이터 (실제로는 API에서 가져오세요)
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      image: 'https://source.unsplash.com/random/600x400/?music',
      title: 'Sunset Vibes',
      likes: 284,
      author: 'user123',
    },
    {
      id: 2,
      image: 'https://source.unsplash.com/random/600x400/?music',
      title: 'Sunset Vibes',
      likes: 284,
      author: 'user123',
    },
    {
      id: 3,
      image: 'https://source.unsplash.com/random/600x400/?music',
      title: 'Sunset Vibes',
      likes: 284,
      author: 'user123',
    },
    {
      id: 4,
      image: 'https://source.unsplash.com/random/600x400/?music',
      title: 'Sunset Vibes',
      likes: 284,
      author: 'user123',
    },
    // ... 4개 더 추가
  ]);

  return (
    <div className="relative py-12 bg-gradient-to-b from-background to-[#f5f0ea]">
      <h2 className="text-3xl font-pacifico text-center mb-8">
        이달의 인기 게시글
      </h2>

      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        modules={[EffectCoverflow, Navigation]}
        className="w-full h-[400px]"
      >
        {posts.map(post => (
          <SwiperSlide key={post.id} className="w-[300px]">
            <div
              className={`relative rounded-xl overflow-hidden transition-all duration-300 
              ${
                posts.indexOf(post) === 2
                  ? 'scale-110 z-10'
                  : 'scale-90 opacity-80'
              }`}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white font-bold">{post.title}</h3>
                <p className="text-white/80 text-sm">
                  ❤️ {post.likes} · by {post.author}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 커스텀 네비게이션 버튼 */}
      <button className="swiper-button-next absolute right-10 top-1/2 z-20 text-[#adcf56] hover:text-[#8aac34]">
        <ChevronRight size={40} />
      </button>
      <button className="swiper-button-prev absolute left-10 top-1/2 z-20 text-[#adcf56] hover:text-[#8aac34]">
        <ChevronLeft size={40} />
      </button>
    </div>
  );
}
