import { jwtDecode } from 'jwt-decode'  // JWT 토큰을 디코딩하기 위한 라이브러리
import { useRecoilState } from 'recoil'  // Recoil 상태를 읽고 업데이트하기 위한 훅
import { authState } from '../atoms/authAtom'  // Recoil에서 관리하는 인증 상태
import { useNavigate } from 'react-router-dom'  // 페이지 이동을 위한 React Router 훅

// 인증 관련 로직을 커스텀 훅으로 분리
export const useAuth = () => {
    const [auth, setAuth] = useRecoilState(authState)  // Recoil에서 auth 상태를 읽고 설정하는 훅
    const navigate = useNavigate()  // 페이지 이동을 처리하기 위한 navigate 함수

    // JWT 토큰의 만료 여부를 확인하는 함수
    const isTokenExpired = (token) => {
        const decodedToken = jwtDecode(token)  // JWT 토큰을 디코딩하여 payload를 확인
        const currentTime = Date.now() / 1000  // 현재 시간을 초 단위로 변환
        return decodedToken.exp < currentTime  // 만료 시간이 현재 시간보다 이전이면 true 반환
    }

    // 사용자 로그인 처리 함수
    const login = (user) => {
        if (isTokenExpired(user.token)) {
            logout()  // 토큰이 만료되었으면 로그아웃 처리
            console.log("Expired Token, Logout")
            return
        }

        console.log("Login called")  // 로그인 로그 출력
        const newAuthState = {
            isLoggedIn: true,
            token: user.token,
            user: {
                id: user.id || "",  // 사용자 ID (없으면 빈 문자열)
                username: user.username || "",  // 사용자 이름 (없으면 빈 문자열)
                nickname: user.nickname || "",  // 사용자 닉네임 (없으면 빈 문자열)
            },
        }
        setAuth(newAuthState)  // 새로운 인증 상태를 Recoil에 저장
        localStorage.setItem('authState', JSON.stringify(newAuthState))  // 인증 상태를 로컬 스토리지에 저장
    }

    // 사용자 로그아웃 처리 함수
    const logout = () => {
        console.log("Logout called")  // 로그아웃 로그 출력
        setAuth({ isLoggedIn: false, token: null, user: null })  // 인증 상태 초기화
        localStorage.removeItem('authState')  // 로컬 스토리지에서 인증 상태 제거
        navigate('/login')  // 로그인 페이지로 리디렉션
    }

    // 토큰 업데이트 함수
    const updateToken = (newToken) => {
        if (isTokenExpired(newToken)) {
            logout()  // 토큰이 만료되었으면 로그아웃 처리
            console.log("Expired Token, Logout")
            return
        }

        console.log("Update called")  // 토큰 업데이트 로그 출력
        setAuth((prevState) => {
            const updatedAuthState = { ...prevState, token: newToken }
            localStorage.setItem('authState', JSON.stringify(updatedAuthState))  // 업데이트된 인증 상태를 로컬 스토리지에 저장
            return updatedAuthState
        })
    }

    // 훅에서 반환할 함수와 상태들
    return { auth, login, logout, updateToken }
}
