import { atom } from 'recoil';

export const authState = atom({
    // 로그인 상태 boolean 값을 고유 식별 key로 저장
    key: 'authState',
    default: {
        isLoggedIn: false,
        token: null,
        user: null,
    },
})