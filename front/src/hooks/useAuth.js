import { useRecoilState } from 'recoil'
import { authState } from '../atoms/authAtom'
import { json, useNavigate } from 'react-router-dom'

// 인증 관련 로직을 커스텀 훅으로 분리
// 로그인 상태와 관련된 로직을 useAuth 훅에서 관리, 로그인, 로그아웃, 상태 조회 기능을 제공
export const useAuth = () => {
    const [auth, setAuth] = useRecoilState(authState)
    const navigate = useNavigate()

    const login = (user) => {
        console.log("Login called"); // 로그 추가
        const newAuthState = { isLoggedIn: true, token: user.token, user}
        setAuth(newAuthState)   // 전체 상태를 업데이트
        localStorage.setItem('authState', JSON.stringify(newAuthState)) // authState 전체를 저장

    }

    const logout = () => {
        console.log("Logout called"); // 로그 추가
        setAuth({ isLoggedIn: false, token: null, user: null });
        localStorage.removeItem('authState');
        navigate('/login'); // 로그인 페이지로 리디렉션
    }

    const updateToken = (newToken) => {
        console.log("Update called");
        setAuth((prevState) => {
            const updatedAuthState = { ...prevState, token: newToken };
            localStorage.setItem('authState', JSON.stringify(updatedAuthState)); // authState 전체를 업데이트
            return updatedAuthState;
        });
    }

    return { auth, login, logout, updateToken }
}
