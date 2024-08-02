import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <aside className='fixed top-16 left-0 w-64 h-full bg-light text-dark z-20 p-4'>
            <div>
                <h2 className="text-xl font-bold mb-4">메뉴</h2>
                <ul className="list-unstyled">
                    <li className="mb-2">
                        <Link className="text-dark hover:text-primary" to="/">Home</Link>
                    </li>
                    <li className="mb-2">
                        <Link className="text-dark hover:text-primary" to="/map">지도정보</Link>
                    </li>
                    <li className="mb-2">
                        <Link className="text-dark hover:text-primary" to="/login">마이페이지</Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
