import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  return (
    <div>
      <h2>홈</h2>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default Home;
