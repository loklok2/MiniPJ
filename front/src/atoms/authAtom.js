import { atom } from 'recoil'

// Recoil 상태 정의
export const authState = atom({
    key: 'authState', // 고유 ID(다른 원자/선택기와 관련)
    default: {
        isLoggedIn: false, // 로그인 상태를 나타내는 boolean 값
        token: null, // JWT 토큰을 저장하는 변수
        user: null, // 사용자 정보를 저장하는 변수 (예: id, username, nickname)
    },
})
