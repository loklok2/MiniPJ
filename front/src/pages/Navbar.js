import React, { useState } from 'react';
import { Link } from 'react-router-dom';


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full bg-gray-800 text-white z-50">
            <nav className="flex items-center justify-between p-4 bg-gray-800">
                <h3>부산 도보여행 정보</h3>
                <div
                    id="navbarCollapse"
                    className='flex justify-center items-center'
                >
                    <Link className="px-4 py-2 text-white" to="/">Home</Link>
                    <Link className="px-4 py-2 text-white" to="/tourlist">관광지정보</Link>
                    <Link className="px-4 py-2 text-white" to="/map">지도정보</Link>
                    <Link className="px-4 py-2 text-white" to="/login">마이페이지</Link>
                </div>
            </nav>
        </header>
    );
}
