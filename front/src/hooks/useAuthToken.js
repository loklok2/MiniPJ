import { useRecoilState } from 'recoil';
import { authState } from '../atoms/authAtom';

/*
JWT 토큰을 독립적으로 관리:
비밀번호 재설정 페이지에서 인증을 위한 JWT 토큰을 별도로 설정하거나 초기화
 */
export function useAuthToken() {
    const [auth, setAuth] = useRecoilState(authState);

    // JWT 토큰을 설정하는 함수
    const setAuthToken = (newToken) => {
        const updatedAuthState = { ...auth, token: newToken }
        setAuth(updatedAuthState)   // Recoil 상태 업데이트
        localStorage.setItem('authState', JSON.stringify(updatedAuthState)) // 로컬 스토리지에 저장
    };

    // JWT 토큰을 초기화하는 함수
    const clearAuthToken = () => {
        const updatedAuthState = { ...auth, token: null }
        setAuth(updatedAuthState)   // Recoil 상태 업데이트
        localStorage.setItem('authState', JSON.stringify(updatedAuthState)) // 로컬 스토리지에 저장
    };

    // 현재 토큰과 토큰 설정/초기화 함수를 반환
    return [auth.token, setAuthToken, clearAuthToken];
}


