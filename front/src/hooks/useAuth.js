import { jwtDecode } from 'jwt-decode'
import { useRecoilState } from 'recoil'
import { authState } from '../atoms/authAtom'
import { useNavigate } from 'react-router-dom'

// 인증 관련 로직을 커스텀 훅으로 분리
// 로그인 상태와 관련된 로직을 useAuth 훅에서 관리, 로그인, 로그아웃, 상태 조회 기능을 제공
export const useAuth = () => {
    const [auth, setAuth] = useRecoilState(authState)
    const navigate = useNavigate()

    const isTokenExpired = (token) => {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // 현재 시간을 초 단위로 변환
        return decodedToken.exp < currentTime; // 만료 시간이 현재 시간보다 이전이면 true 반환
    };

    const login = (user) => {
        if (isTokenExpired(user.token)) {
            logout(); // 토큰이 만료되었으면 로그아웃 처리
            return;
        }

        console.log("Login called"); // 로그 추가
        const newAuthState = {
            isLoggedIn: true,
            token: user.token,
            user: {
                id: user.id || "", // 유연하게 처리: ID가 없으면 빈 문자열
                username: user.username || "", // 유연하게 처리: username이 없으면 빈 문자열
                nickname: user.nickname || "", // 유연하게 처리: nickname이 없으면 빈 문자열
            },
        }
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

        if (isTokenExpired(newToken)) {
            logout(); // 토큰이 만료되었으면 로그아웃 처리
            return;
        }
        
        console.log("Update called");
        setAuth((prevState) => {
            const updatedAuthState = { ...prevState, token: newToken };
            localStorage.setItem('authState', JSON.stringify(updatedAuthState)); // authState 전체를 업데이트
            return updatedAuthState;
        });
    }

    return { auth, login, logout, updateToken }
}
