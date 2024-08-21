import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'; // React Router를 사용하여 애플리케이션의 라우팅을 관리
import { RecoilRoot, useRecoilState } from 'recoil'; // Recoil을 사용하여 글로벌 상태를 관리
import AppLayout from './appComponents/AppLayout'; // 전체 애플리케이션의 레이아웃을 관리하는 컴포넌트
import AppRoutes from './appComponents/AppRoutes'; // 애플리케이션의 라우트(경로)를 정의하는 컴포넌트
import { authState } from './atoms/authAtom'; // Recoil 상태를 관리하는 atom (인증 상태를 관리)

function App() {
    // auth: 현재 사용자 인증 상태를 저장
    // setAuth: 인증 상태를 업데이트하는 함수
    const [auth, setAuth] = useRecoilState(authState);

    // useEffect 훅을 사용하여 컴포넌트가 마운트될 때 로컬 스토리지에서 인증 상태를 불러옴
    useEffect(() => {
        const storedAuthState = localStorage.getItem('authState');
        if (storedAuthState) {
            setAuth(JSON.parse(storedAuthState)); // 로컬 스토리지에서 가져온 인증 상태를 Recoil 상태에 저장
        }
    }, [setAuth]);

     // AppLayout을 사용하여 전체 레이아웃을 관리하고, 그 안에 AppRoutes 컴포넌트를 배치하여 라우팅을 관리
    return (
        <AppLayout>
            <AppRoutes />
        </AppLayout>
    );
}

// RecoilRoot로 Recoil 상태 관리의 루트를 설정하고, BrowserRouter로 라우팅을 관리
export default function RootApp() {
    return (
        <RecoilRoot>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </RecoilRoot>
    );
}
