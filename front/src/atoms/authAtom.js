import { atom } from 'recoil';

// Recoil 상태 정의
export const authState = atom({
    // 로그인 상태 boolean 값을 고유 식별 key로 저장
    key: 'authState', // 고유 ID(다른 원자/선택기와 관련)
    default: {
        isLoggedIn: false, // 로그인 상태
        token: null, // JWT 토큰
        user: null, // 사용자 정보
    },
})