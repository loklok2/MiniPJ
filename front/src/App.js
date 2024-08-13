import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import AppLayout from './components/AppLayout'
import AppRoutes from './components/AppRoutes'

export default function App() {
    return (
        <RecoilRoot>
            <BrowserRouter>
                <AppLayout>
                    <AppRoutes />
                </AppLayout>
            </BrowserRouter>
        </RecoilRoot>
    )
}
