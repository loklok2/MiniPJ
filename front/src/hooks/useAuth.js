import { useRecoilState } from 'recoil'
import { authState } from '../atoms/authAtom'
import { useNavigate } from 'react-router-dom'

// 인증 관련 로직을 커스텀 훅으로 분리
// 로그인 상태와 관련된 로직을 useAuth 훅에서 관리, 로그인, 로그아웃, 상태 조회 기능을 제공
export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(authState)
    const navigate = useNavigate()

    const login = (user) => {
        setIsLoggedIn({ isLoggedIn: true, token: user.token, user });
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('token', user.token)
        localStorage.setItem('user', JSON.stringify(user));
    }

    const logout = () => {

        setIsLoggedIn({ isLoggedIn: false, token: null, user: null });
        localStorage.setItem('isLoggedIn', JSON.stringify(false));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login'); // 로그인 페이지로 리디렉션

    }

    return { isLoggedIn, login, logout }
}
