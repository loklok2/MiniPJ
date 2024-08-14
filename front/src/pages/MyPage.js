import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../atoms/authAtom';

export default function MyPage() {
    const [userInfo, setUserInfo] = useState({});
    const [auth] = useRecoilState(authState); // 로그인 상태와 JWT 토큰을 가져옴

    useEffect(() => {
        console.log('JWT Token:', auth.token);  // useRecoilValue(authState)를 통해 가져온 auth.token이 실제로 값이 있는지 확인

        const fetchUserInfo = async () => {
            try {
                if (!auth.token) throw new Error('토큰이 존재하지 않습니다.');

                const response = await fetch('http://localhost:8080/api/mypage/info', {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`, // Recoil 상태에서 토큰을 가져옴
                    },
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`사용자 정보를 가져오지 못했습니다: ${errorData}`);
                }

                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('사용자 정보 가져오기 실패:', error);
            }
        };

        if (auth.token) { // auth.token이 존재하는 경우에만 fetchUserInfo 호출
            fetchUserInfo();
        }
    }, [auth.token]);

    if (!auth.isLoggedIn) {
        return <div>로그인 상태가 아닙니다. 로그인 후 다시 시도해 주세요.</div>;
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
