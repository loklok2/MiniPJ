import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import AppLayout from './appComponents/AppLayout'
import AppRoutes from './appComponents/AppRoutes'

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
