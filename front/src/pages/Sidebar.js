import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <aside className='position-fixed top-0 start-0 h-100 bg-dark text-white' 
               style={{ width: '16rem', paddingTop: '56px', zIndex: 1000 }}>
            <div className="p-4">
                <h2 className="fs-4 fw-bold mb-4">메뉴</h2>
                <ul className="list-unstyled">
                    <li className="mb-2">
                        <Link className="text-white text-decoration-none" to="/">Home</Link>
                    </li>
                    <li className="mb-2">
                        <Link className="text-white text-decoration-none" to="/map">지도정보</Link>
                    </li>
                    <li className="mb-2">
                        <Link className="text-white text-decoration-none" to="/login">마이페이지</Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
