import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot, useRecoilState } from 'recoil';
import AppLayout from './appComponents/AppLayout';
import AppRoutes from './appComponents/AppRoutes';
import { authState } from './atoms/authAtom';

function App() {
    const [auth, setAuth] = useRecoilState(authState);

    useEffect(() => {
        const storedAuthState = localStorage.getItem('authState');
        if (storedAuthState) {
            setAuth(JSON.parse(storedAuthState));
        }
    }, [setAuth]);

    return (
        <AppLayout>
            <AppRoutes />
        </AppLayout>
    );
}

export default function RootApp() {
    return (
        <RecoilRoot>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </RecoilRoot>
    );
}
