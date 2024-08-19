import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // useAuth 훅을 가져옵니다.

import Home from '../pages/Home';
import TouristSpots from '../pages/TouristSpots';
import Map from '../mapComponents/Map';
import Login from '../loginComponents/Login';
import MyPage from '../pages/MyPage';
import SignUp from '../loginComponents/SignUp';
import EmailFind from '../loginComponents/EmailFind';
import PasswordFind from '../loginComponents/PasswordFind';
import PasswordReset from '../loginComponents/PasswordReset';
import BoardList from '../pages/BoardList';
import BoardForm from '../boardComponents/BoardForm';
import BoardDetail from '../boardComponents/BoardDetail';
import BoardEdit from '../boardComponents/BoardEdit';

// 애플리케이션의 모든 라우트를 정의
export default function AppRoutes() {
    // useAuth 훅을 사용하여 auth 상태를 가져옵니다.
    const { auth } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tourlist" element={<TouristSpots />} />
            <Route path="/map" element={<Map />} />
            <Route path="/login" element={auth.isLoggedIn ? <Navigate to="/mypage" /> : <Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/mypage" element={auth.isLoggedIn ? <MyPage /> : <Navigate to="/login" />} />
            <Route path="/emailfind" element={<EmailFind />} />
            <Route path="/passwordfind" element={<PasswordFind />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="*" element={<BoardList />} />
            <Route path="/boards" element={<BoardList />} />
            <Route path="/boards/:id" element={<BoardDetail />} />
            <Route path="/boards/create" element={auth.isLoggedIn ? <BoardForm /> : <Navigate to="/login" />} />
            <Route path="/boards/edit/:boardId" element={auth.isLoggedIn ? <BoardEdit /> : <Navigate to="/login" />} />
            {/* 추가적인 경로들 추가 */}
        </Routes>
    );
}
