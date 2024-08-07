import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

// 레이아웃과 header, footer를 포함
export default function AppLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex flex-grow flex-col items-center justify-center bg-gray-100 pt-[60px]">
                {children} {/* children을 사용하여 자식 컴포넌트를 렌더링 */}
            </main>
            <Footer />
        </div>
    )
}
