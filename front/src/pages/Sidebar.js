import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <aside className="fixed top-0 left-0 h-full bg-gray-800 text-white"
            style={{ width: '16rem', paddingTop: '56px', zIndex: 1000 }}>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">메뉴</h2>
                <ul className="space-y-2">
                    <li>
                        <Link className="text-white hover:text-gray-300" to="/">Home</Link>
                    </li>
                    <li>
                        <Link className="text-white hover:text-gray-300" to="/map">지도정보</Link>
                    </li>
                    <li>
                        <Link className="text-white hover:text-gray-300" to="/login">마이페이지</Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
