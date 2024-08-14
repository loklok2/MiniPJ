import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { authState } from '../atoms/authAtom'

import Home from '../pages/Home'
import TouristSpots from '../pages/TouristSpots'
import Map from '../mapComponents/Map'
import Login from '../loginComponents/Login'
import MyPage from '../pages/MyPage'
import SignUp from '../loginComponents/SignUp'
import PasswordFind from '../loginComponents/PasswordFind'
import PasswordReset from '../loginComponents/PasswordReset'
import BoardList from '../pages/BoardList'
import BoardForm from '../boardComponents/BoardForm'
import BoardDetail from '../boardComponents/BoardDetail'
import BoardEdit from '../boardComponents/BoardEdit'


// 애플리케이션의 모든 라우트를 정의
export default function AppRoutes() {
    // Recoil 상태를 기반으로 로그인 상태에 따라 다른 컴포넌트를 렌더링s
    const [auth] = useRecoilState(authState);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tourlist" element={<TouristSpots/>} />
            <Route path="/map" element={<Map />} />
            <Route path="/login" element={auth.isLoggedIn ? <Navigate to="/mypage" /> : <Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/mypage" element={auth.isLoggedIn ? <MyPage /> : <Navigate to="/login" />} />
            <Route path="/passwordfind" element={<PasswordFind />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/boards" element={<BoardList />} />
            <Route path="/boards/create" element={<BoardForm />} />
            <Route path="/boards/:boardId" element={<BoardDetail />} />
            <Route path="/boards/edit/:boardId" element={<BoardEdit />}/>
            {/* 추가적인 경로들 추가 */}
        </Routes>
    )
}
