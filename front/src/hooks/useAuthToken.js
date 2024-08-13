import { useRecoilState } from 'recoil';
import { authTokenState } from '../atoms/authAtom';

// JWT 토큰을 설정하는 커스텀 훅
export function useAuthToken() {
    const [token, setToken] = useRecoilState(authTokenState);

    const setAuthToken = (newToken) => {
        setToken(newToken);
        // 예를 들어 로컬 스토리지에 토큰을 저장할 수도 있습니다.
        localStorage.setItem('authToken', newToken);
    };

    return [token, setAuthToken];
}

// JWT 토큰을 초기화하는 훅
export function useClearAuthToken() {
    const [, setToken] = useRecoilState(authTokenState);

    const clearAuthToken = () => {
        setToken(null);
        localStorage.removeItem('authToken');
    };

    return clearAuthToken;
}