import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type SlideItemProps = {
  children: React.ReactNode;
  padding?: string;
};

const MultiItem = ({ children }: SlideItemProps) => (
  <div className="bg-[#00558b] text-white text-4xl leading-[100px] mx-2.5 p-[2%] relative text-center">
    {children}
  </div>
);

const SlidePage = ({ children, padding = '0' }: SlideItemProps) => (
  <div className={`text-center p-[${padding}]`}>{children}</div>
);

const CenterSlide = () => {
  const settings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '60px',
    slidesToShow: 3,
    speed: 500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: '40px',
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: '30px',
        },
      },
    ],
  };

  const slides = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="px-5">
      <h1 className="text-2xl font-bold mb-4">CenterSlide</h1>

      <Slider {...settings}>
        {slides.map(item => (
          <SlidePage key={item}>
            <MultiItem>{item}</MultiItem>
          </SlidePage>
        ))}
      </Slider>
    </div>
  );
};

{
  /* Tailwind로 스타일 추가
<style jsx global>{`
  .center .slick-center ${MultiItem} {
    color: #e67e22;
    opacity: 1;
    transform: scale(1.06);
  }
  
  .center ${MultiItem} {
    opacity: 0.8;
    transition: all 300ms ease;
    transform: scale(0.99);
  }
`}</style> */
}
export default CenterSlide;
