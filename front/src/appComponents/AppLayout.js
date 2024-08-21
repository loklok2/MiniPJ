import Navbar from '../components/Navbar' // 네비게이션 바 컴포넌트를 가져옴
import Footer from '../components/Footer' // 푸터 컴포넌트를 가져옴

// 레이아웃과 헤더, 푸터를 포함하는 AppLayout 컴포넌트
export default function AppLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar /> {/* 상단 네비게이션 바 */}
            <main className="flex flex-grow flex-col items-center justify-center bg-gray-100 pt-[60px]">
                {children} {/* children을 사용하여 자식 컴포넌트를 렌더링 */}
            </main>
            <Footer /> {/* 하단 푸터 */}
        </div>
    )
}
