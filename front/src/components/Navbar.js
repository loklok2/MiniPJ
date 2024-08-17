import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { auth, logout } = useAuth();

    const toggleMenu = () => setIsOpen(!isOpen);
    const handleLogout = () => logout();
    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const navbarElement = document.getElementById('navbarCollapse');
            if (isOpen && navbarElement && !navbarElement.contains(event.target)) {
                closeMenu();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <header className='w-full fixed top-0 left-0 z-50 bg-blue-500 text-white shadow-lg'>
            <nav className='flex items-center justify-between p-4 container mx-auto'>
                <h3 className='text-2xl font-bold'>부산 도보여행 대중교통 정보 서비스</h3>
                <button onClick={toggleMenu} className='text-white block lg:hidden'>
                    {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
                <div
                    id='navbarCollapse'
                    className={`fixed top-0 left-0 w-64 h-full bg-blue-500 lg:static lg:flex lg:flex-row lg:items-center lg:w-auto lg:h-auto lg:bg-transparent transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:block`}
                >
                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between lg:flex-1 mt-12 lg:mt-0'>
                        <Link className='px-4 py-2 text-lg hover:bg-blue-300 rounded-md transition' to='/'>
                            Home
                        </Link>
                        <Link className='px-4 py-2 text-lg hover:bg-blue-300 rounded-md transition' to='/tourlist'>
                            관광지정보
                        </Link>
                        <Link className='px-4 py-2 text-lg hover:bg-blue-300 rounded-md transition' to='/map'>
                            지도정보
                        </Link>
                        <Link className='px-4 py-2 text-lg hover:bg-blue-300 rounded-md transition' to='/boards'>
                            공유게시판
                        </Link>
                    </div>
                    <div className='flex flex-col lg:flex-row lg:items-center lg:ml-4 mt-4 lg:mt-0'>
                        {auth.isLoggedIn ? (
                            <>
                                <Link className='px-4 py-2 text-lg hover:bg-blue-300 rounded-md transition' to='/mypage'>
                                    마이페이지
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className='mt-2 lg:mt-0 px-4 py-2 text-lg text-gray-600 border border-gray-400 bg-gray-200 hover:bg-gray-300 hover:text-gray-800 rounded-md transition'
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <Link className='px-4 py-2 text-lg hover:bg-blue-300 rounded-md transition' to='/login'>
                                로그인
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
