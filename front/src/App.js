import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS import
import Home from './pages/Home';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Login from './pages/Login';
import SignUp from './pages/SingUp';
import Map from './pages/Map';
import MyPage from './components/MyPage';


export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (email) => {
      setIsLoggedIn(true);
    };
  
    const handleSignUp = (email) => {
      setIsLoggedIn(true);
    };


    return (
        <BrowserRouter>
            <RecoilRoot>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex flex-grow flex-col items-center justify-start bg-gray-100 pt-[60px]">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/map" element={<Map />} />
                            <Route path="/login" element={<Login onLogin={handleLogin} />} />
                            <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
                            <Route path="/mypage" element={isLoggedIn ? <MyPage /> : <Navigate to="/login" />}/>
                            {/* 추가적인 경로들 추가 */}
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </RecoilRoot>
        </BrowserRouter>
    );
}
