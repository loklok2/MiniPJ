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

export const authTokenState = atom({
    key: 'authTokenState', // 고유한 키를 정의합니다.
    default: null,         // 초기 상태를 null로 설정합니다.
})