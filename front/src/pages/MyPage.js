import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function MyPage() {
    const [userInfo, setUserInfo] = useState({});
    const { auth, logout } = useAuth(); // 로그인 상태와 JWT 토큰을 가져옴
    const [loading, setLoading] = useState(true)    // 로딩 상태 추가
    const [error, setError] = useState(null)    // 에러 상태 추가

    useEffect(() => {
        console.log('useEffect가 트리거되었습니다.');
        console.log('JWT Token:', auth.token);  // useRecoilValue(authState)를 통해 가져온 auth.token이 실제로 값이 있는지 확인
        console.log('사용자 로그인됨:', auth.isLoggedIn);

        const fetchUserInfo = async () => {
            try {
                if (!auth.token) throw new Error('토큰이 존재하지 않습니다.');

                const response = await fetch('http://localhost:8080/api/mypage/info', {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`, // Recoil 상태에서 토큰을 가져옴
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        // 토큰이 만료되었거나 유효하지 않은 경우 로그아웃 처리
                        logout()   // 만료된 토큰이므로 로그아웃 처리
                        throw new Error('인증이 만료되었습니다. 다시 로그인해 주세요.')
                    }
                    const errorData = await response.text();
                    throw new Error(`사용자 정보를 가져오지 못했습니다: ${errorData}`);
                }

                const data = await response.json();
                setUserInfo(data);
                setError(null)  // 이전 오류 초기화
            } catch (error) {
                console.error('사용자 정보 가져오기 실패:', error);
                setError(error.message)
                setUserInfo({})
            } finally {
                setLoading(false)   // 로딩 상태 해제
            }
        };

        if (auth.isLoggedIn) {  // 로그인 상태 확인 후 fetchUserInfo 호출
            fetchUserInfo()
        } else {
            setLoading(false)
        }

    }, [auth.isLoggedIn]);

    if (loading) {
        return <div>로딩 중...</div>
    }

    if (!auth.isLoggedIn) {
        return <div>로그인 상태가 아닙니다. 로그인 후 다시 시도해 주세요.</div>;
    }

    if (error) {
        return <div className='text-red-500'>{error}</div>  // 에러 메시지 UI에 표시
    }

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>마이페이지</h1>
            <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
                <h2 className='text-xl font-semibold mb-4'>회원정보</h2>
                <p><strong>이메일:</strong> {userInfo.username}</p>
                <p><strong>닉네임:</strong> {userInfo.nickname}</p>
            </div>
        </div>
    );
}
