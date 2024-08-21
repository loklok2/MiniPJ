import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // 사용자 인증 상태를 확인하기 위한 커스텀 훅

import Home from '../pages/Home';
import TouristSpots from '../pages/TouristSpots';
import Map from '../mapComponents/Map';
import Login from '../pages/Login'
import OAuth2RedirectHandler from '../loginComponents/OAuth2RedirectHandler';
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
            {/* auth 상태에서 로그인된 사용자 일 경우 MyPage 페이지로, 아닐 경우 login 페이지로 이동 */}
            <Route path="/login" element={auth.isLoggedIn ? <Navigate to="/mypage" /> : <Login />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            <Route path="/signup" element={<SignUp />} />
            {/* auth 상태에서 로그인된 사용자 일 경우 MyPage 페이지로, 아닐 경우 login 페이지로 이동 */}
            <Route path="/mypage" element={auth.isLoggedIn ? <MyPage /> : <Navigate to="/login" />} />
            <Route path="/emailfind" element={<EmailFind />} />
            <Route path="/passwordfind" element={<PasswordFind />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/boards" element={<BoardList />} />
            <Route path="/boards/:id" element={<BoardDetail />} />
            {/* auth 상태에서 로그인된 사용자 일 경우 BoardForm 페이지로, 아닐 경우 login 페이지로 이동 */}
            <Route path="/boards/create" element={auth.isLoggedIn ? <BoardForm /> : <Navigate to="/login" />} />
            {/* auth 상태에서 로그인된 사용자 일 경우 BoardEdit 페이지로, 아닐 경우 login 페이지로 이동 */}
            <Route path="/boards/edit/:boardId" element={auth.isLoggedIn ? <BoardEdit /> : <Navigate to="/login" />} />
            {/* 추가적인 경로들 추가 */}
        </Routes>
    );
}
