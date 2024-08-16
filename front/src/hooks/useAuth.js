import { useRecoilState } from 'recoil'
import { authState } from '../atoms/authAtom'
import { useNavigate } from 'react-router-dom'

// 인증 관련 로직을 커스텀 훅으로 분리
// 로그인 상태와 관련된 로직을 useAuth 훅에서 관리, 로그인, 로그아웃, 상태 조회 기능을 제공
export const useAuth = () => {
    const [auth, setAuth] = useRecoilState(authState)
    const navigate = useNavigate()

    const login = (user) => {
        console.log("Login called"); // 로그 추가
        setAuth({ isLoggedIn: true, token: user.token, user });   // 전체 상태를 업데이트
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('token', user.token)
        localStorage.setItem('user', JSON.stringify(user));
    }

    const logout = () => {
        console.log("Logout called"); // 로그 추가
        setAuth({ isLoggedIn: false, token: null, user: null });
        localStorage.removeItem('authState');
        navigate('/login'); // 로그인 페이지로 리디렉션
    }

    const updateToken = (newToken) => {
        console.log("Update called");
        setAuth((prevState) => ({ ...prevState, token: newToken }));
        localStorage.setItem('token', newToken);
    }

    return { auth, login, logout, updateToken }
}
