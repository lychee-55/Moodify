// import './App.css';
import { BrowserRouter } from 'react-router-dom';
import '../src/style/main.css';
import Header from './components/common/Header';
import MainPage from './pages/MainPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="pt-20">
          {' '}
          {/* 헤더 높이(4rem ≈ 16px × 4)만큼 패딩 */}
          <MainPage />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
