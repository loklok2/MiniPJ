import { useRecoilState } from 'recoil';
import { authState } from '../atoms/authAtom';

/*
JWT 토큰을 독립적으로 관리:
비밀번호 재설정 페이지에서 인증을 위한 JWT 토큰을 별도로 설정하거나 초기화
 */
export function useAuthToken() {
    const [auth, setAuth] = useRecoilState(authState);

    // JWT 토큰을 설정하는 커스텀 훅
    const setAuthToken = (newToken) => {
        const updatedAuthState = { ...auth, token: newToken }
        setAuth(updatedAuthState)
        localStorage.setItem('authState', JSON.stringify(updatedAuthState))
    };

    // JWT 토큰을 초기화하는 훅
    const clearAuthToken = () => {
        const updatedAuthState = { ...auth, token: null }
        setAuth(updatedAuthState)
        localStorage.setItem('authState', JSON.stringify(updatedAuthState))
    };

    return [auth.token, setAuthToken, clearAuthToken];
}


