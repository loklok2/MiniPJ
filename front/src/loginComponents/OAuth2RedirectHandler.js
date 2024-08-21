import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function OAuth2RedirectHandler() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleOAuth2LoginSuccess = (data) => {
        const { token, id, username, nickname} = data;

        console.log("OAuth2 로그인 성공:", data);  // 로그 추가

        login({
            id,
            username,
            nickname,
            token,
        });

        navigate('/mypage'); // 로그인 후 마이페이지로 리디렉션
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const id = urlParams.get('id');
        const username = urlParams.get('username');
        const nickname = urlParams.get('nickname');

        console.log("URL Params:", { token, id, username, nickname }); // 로그 추가

        if (token) {
            handleOAuth2LoginSuccess({ token, id, username, nickname});
        } else {
            // 실패 시 처리
            navigate('/login');
        }
    }, []);

    return null; // 이 컴포넌트는 화면에 아무것도 렌더링하지 않음
}
