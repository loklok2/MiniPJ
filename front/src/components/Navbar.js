import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { isLoggedIn, logout } = useAuth() // useAuth 훅을 사용
    const navigate = useNavigate()

    const toggleMenu = () => {
        setIsOpen(!isOpen); // 현재 상태를 반전시켜 메뉴 열림/닫힘 상태를 변경
    }

    const handleLogout = () => {
        logout();
        navigate('/login'); // 로그인 페이지로 리디렉션
    }

    return (
        <header className='w-full fixed top-0 left-0 z-50 bg-gray-800 text-white'>
            <nav className='flex items-center justify-between p-4 bg-gray-800'>
                {/* 사이트 제목 */}
                <h3 className='text-lg font-semibold'>
                    부산 도보여행 정보
                </h3>

                {/* 모바일 환경에서만 나타나는 메뉴 버튼 */}
                <button
                    onClick={toggleMenu}
                    className='text-white block lg:hidden'>
                    {isOpen ? '메뉴 닫기' : '메뉴 열기'}
                </button>

                {/* 링크 메뉴 */}
                <div
                    id='navbarCollapse'
                    className={`fixed top-0 left-0 w-64 h-full 
                            bg-gray-800 lg:static lg:flex lg:flex-row lg:items-center lg:w-auto lg:h-auto lg:bg-transparent ${isOpen ? 'block' : 'hidden'} lg:block`} // 모바일에서 사이드바, 웹에서는 일반 메뉴
                >
                    <div className='flex flex-col 
                                    lg:flex-row lg:items-center lg:justify-between lg:flex-1'>
                        <Link className='px-4 py-2 text-white' to='/'>
                            Home
                        </Link>
                        <Link className='px-4 py-2 text-white' to='/tourlist'>
                            관광지정보
                        </Link>
                        <Link className='px-4 py-2 text-white' to='/map'>
                            지도정보
                        </Link>
                    </div>

                    {/* 로그인 상태에 따른 마이페이지와 로그아웃 버튼 */}
                    <div className='flex flex-col lg:flex-row lg:items-center lg:ml-4'>
                        {isLoggedIn ? (
                            <>
                                <Link className='px-4 py-2 text-white' to='/mypage'>
                                    마이페이지
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className='ml-4 px-4 py-2 rounded-md text-white'>
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link className='px-4 py-2 text-white' to='/login'>
                                    로그인
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
