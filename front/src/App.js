import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Navbar from './pages/Navbar';
import Sidebar from './pages/Sidebar';
import Footer from './pages/Footer';
import Map from './components/Map';
import Main from './components/Main';
import Login from './components/Login';

export default function App() {
    return (
        <BrowserRouter>
            <RecoilRoot>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <div className="flex flex-grow">
                        <main className="flex-grow flex flex-col justify-center items-center">
                            <Routes>
                                <Route path="/" element={<Main />} />
                                <Route path="/map" element={<Map />} />
                                <Route path="/login" element={<Login />} />
                                {/* 추가적인 경로들 추가 */}
                            </Routes>
                        </main>
                    </div>
                    <Footer />
                </div>
            </RecoilRoot>
        </BrowserRouter>
    );
}
