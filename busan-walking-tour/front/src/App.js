import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS import
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
                <div className="d-flex flex-column min-vh-100">
                    <Navbar />
                    <div className="d-flex flex-grow-1">
                        <Sidebar />
                        <main className="flex-grow-1 p-4 mt-5 ms-auto" 
                              style={{ marginLeft: '16rem' }}>
                            <div className="">
                                <Routes>
                                    <Route path="/" element={<Main />} />
                                    <Route path="/map" element={<Map />} />
                                    <Route path="/login" element={<Login />} />
                                    {/* 추가적인 경로들 추가 */}
                                </Routes>
                            </div>
                        </main>
                    </div>
                    <Footer />
                </div>
            </RecoilRoot>
        </BrowserRouter>
    );
}
