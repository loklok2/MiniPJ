import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authState } from '../atoms/authAtom';
import { useRecoilValue } from 'recoil';
import { FaBars, FaTimes } from 'react-icons/fa'; // 아이콘 사용

export default function Navbar() {
    // 메뉴가 열려 있는지 여부를 관리하는 상태 변수
    const [isOpen, setIsOpen] = useState(false);
    // 로그아웃 함수와 로그인 상태를 가져오는 커스텀 훅 사용
    const { logout } = useAuth();
    const isLoggedIn = useRecoilValue(authState).isLoggedIn;

    // 메뉴 열기/닫기 상태를 반전시키는 함수
    const toggleMenu = () => {
        setIsOpen(!isOpen); // 현재 상태를 반전시켜 메뉴 열림/닫힘 상태를 변경
    }

    // 로그아웃 버튼 클릭 시 호출되는 함수
    const handleLogout = () => {
        logout();
    }

    // 메뉴를 닫는 함수
    const closeMenu = () => {
        setIsOpen(false);
    }

    // 메뉴가 열려 있을 때 브라우저의 다른 곳을 클릭하면 메뉴를 닫도록 설정
    useEffect(() => {
        // 메뉴 외부 클릭을 감지하여 메뉴를 닫는 함수
        const handleClickOutside = (event) => {
            // 클릭된 요소가 메뉴 내에 있지 않으면 메뉴를 닫음
            const navbarElement = document.getElementById('navbarCollapse');
            if (isOpen && navbarElement && !navbarElement.contains(event.target)) {
                closeMenu();
            }
        }

        // 메뉴가 열려 있을 때 click 이벤트 리스너 추가
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            // 메뉴가 닫혀 있을 때 리스너 제거
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // 컴포넌트 언마운트 시 리스너 제거
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen])

    return (
        <header className='w-full fixed top-0 left-0 z-50 bg-gray-800 text-white'>
            <nav className='flex items-center justify-between p-4'>
                {/* 사이트 제목 */}
                <h3 className='text-lg font-semibold'>
                    부산 도보여행 정보
                </h3>

                {/* 모바일 환경에서만 나타나는 메뉴 버튼 */}
                <button
                    onClick={toggleMenu}
                    className='text-white block lg:hidden'>
                    {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>

                {/* 링크 메뉴 */}
                <div
                    id='navbarCollapse'
                    className={`fixed top-0 left-0 w-64 h-full bg-gray-800 lg:static lg:flex lg:flex-row lg:items-center lg:w-auto lg:h-auto lg:bg-transparent ${isOpen ? 'block' : 'hidden'} lg:block`}
                >
                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between lg:flex-1'>
                        <Link className='px-4 py-2' to='/'>
                            Home
                        </Link>
                        <Link className='px-4 py-2' to='/tourlist'>
                            관광지정보
                        </Link>
                        <Link className='px-4 py-2' to='/map'>
                            지도정보
                        </Link>
                        <Link className='px-4 py-2' to='/boards'>
                            공유게시판
                        </Link>
                    </div>

                    {/* 로그인 상태에 따른 마이페이지, 게시물 작성, 로그아웃 버튼 */}
                    <div className='flex flex-col lg:flex-row lg:items-center lg:ml-4'>
                        {isLoggedIn ? (
                            <>
                                <Link className='px-4 py-2' to='/mypage'>
                                    마이페이지
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className='mt-2 lg:mt-0 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700'
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <Link className='px-4 py-2' to='/login'>
                                로그인
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}
