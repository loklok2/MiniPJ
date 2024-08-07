import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { authState } from '../atoms/authAtom'

import Home from '../pages/Home'
import Map from './Map'
import Login from './Login'
import MyPage from '../pages/MyPage'
import SignUp from './SignUp'


// 애플리케이션의 모든 라우트를 정의
export default function AppRoutes() {
    // Recoil 상태를 기반으로 로그인 상태에 따라 다른 컴포넌트를 렌더링s
    const [auth] = useRecoilState(authState);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/login" element={auth.isLoggedIn ? <Navigate to="/mypage" /> : <Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/mypage" element={auth.isLoggedIn ? <MyPage /> : <Navigate to="/login" />} />
            {/* 추가적인 경로들 추가 */}
        </Routes>
    )
}
