import Nav from '../components/common/Nav';
import PopularMood from '../components/main/popularMood/PopularMood';

export default function MainPage() {
  return (
    <>
      <div className="h-full">
        <Nav />
        <PopularMood />
      </div>
    </>
  );
}
