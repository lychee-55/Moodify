// 화살표 컴포넌트에 전달될 props 타입 정의
type ArrowProps = {
  className?: string;
  style?: string;
  onClick?: () => void;
};

// 슬라이더에서 사용할 다음 화살표 커스텀 컴포넌트
function SampleNextArrow({ className, onClick }: ArrowProps) {
  return (
    <div
      className={className}
      style={{
        display: 'block',
        background: '#333',
        borderRadius: '50%',
      }}
      onClick={onClick}
    />
  );
}

// 슬라이더에서 사용할 이전 화살표 커스텀 컴포넌트
function SamplePrevArrow({ className, onClick }: ArrowProps) {
  return (
    <div
      className={className}
      style={{
        display: 'block',
        background: '#333',
        borderRadius: '50%',
      }}
      onClick={onClick}
    />
  );
}

export { SampleNextArrow, SamplePrevArrow };
