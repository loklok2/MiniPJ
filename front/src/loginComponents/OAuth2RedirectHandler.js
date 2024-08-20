import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function OAuth2RedirectHandler() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleOAuth2LoginSuccess = (data) => {
        const { token, id, username, nickname, provider } = data;

        login({
            id,
            username,
            nickname,
            token,
            provider, // OAuth2 공급자 정보 추가
        });

        navigate('/mypage'); // 로그인 후 마이페이지로 리디렉션
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const id = urlParams.get('id');
        const username = urlParams.get('username');
        const nickname = urlParams.get('nickname');
        const provider = urlParams.get('provider');

        if (token) {
            handleOAuth2LoginSuccess({ token, id, username, nickname, provider });
        } else {
            // 실패 시 처리
            navigate('/login');
        }
    }, []);

    return null; // 이 컴포넌트는 화면에 아무것도 렌더링하지 않음
}
