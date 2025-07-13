import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>SubCanvas</h1>
        <p className="tagline">당신만의 프로필 페이지를 만들어보세요</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary">시작하기</Link>
          <Link to="/explore" className="btn btn-secondary">둘러보기</Link>
        </div>
      </div>
      
      <div className="features-section">
        <h2>SubCanvas의 특징</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>쉽고 빠른 프로필 생성</h3>
            <p>몇 번의 클릭만으로 당신만의 프로필 페이지를 만들 수 있습니다.</p>
          </div>
          <div className="feature-card">
            <h3>다양한 콘텐츠 지원</h3>
            <p>이미지, 텍스트, 링크 등 다양한 콘텐츠를 자유롭게 배치하세요.</p>
          </div>
          <div className="feature-card">
            <h3>SNS 계정 연결</h3>
            <p>다양한 SNS 계정을 연결하여 자신을 더 잘 표현할 수 있습니다.</p>
          </div>
          <div className="feature-card">
            <h3>방문 통계</h3>
            <p>프로필 페이지의 방문 통계를 확인하고 인기도를 측정해보세요.</p>
          </div>
        </div>
      </div>
      
      <div className="how-it-works">
        <h2>이용 방법</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>회원가입</h3>
            <p>간단한 정보로 빠르게 가입하세요.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>프로필 생성</h3>
            <p>원하는 URL 경로와 디자인 컨셉을 설정하세요.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>콘텐츠 추가</h3>
            <p>이미지, 텍스트, 링크 등 다양한 콘텐츠를 추가하세요.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>공유하기</h3>
            <p>완성된 프로필 페이지를 다른 사람들과 공유하세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
