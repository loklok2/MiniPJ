import { atom } from 'recoil';

export const authState = atom({
    // 로그인 상태 boolean 값을 고유 식별 key로 저장
    key: 'authState', // 고유 ID(다른 원자/선택기와 관련)
    default: {
        isLoggedIn: false,
        token: null,
        user: null,
    },
})

export const resetPasswordState = atom({
    key: 'resetPasswordState',
    default: {
        token: null,
        newPassword: null,
        status: null
    }
})