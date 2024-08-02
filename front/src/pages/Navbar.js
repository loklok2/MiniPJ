import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <header className='fixed top-0 left-0 w-full bg-gray-800 text-white z-30'>
            <nav className="flex items-center justify-between flex-wrap p-4">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <Link className="text-xl font-semibold tracking-tight" to="/">부산 도보여행 정보</Link>
                </div>
                <div className="block lg:hidden">
                    <button className="flex items-center px-3 py-2 border rounded text-white border-white hover:text-gray-400 hover:border-gray-400">
                        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <title>Menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                        </svg>
                    </button>
                </div>
                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-sm lg:flex-grow">
                        <Link to="/" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
                            Home
                        </Link>
                        <Link to="/map" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
                            지도정보
                        </Link>
                        <Link to="/login" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400">
                            마이페이지
                        </Link>
                    </div>
                    <div>
                        <form className="flex items-center">
                            <input className="appearance-none bg-transparent border-b border-gray-400 w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Search" aria-label="Search" />
                            <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                                검색
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
        </header>
    );
}
