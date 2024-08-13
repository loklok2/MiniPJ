// src/components/MyPage.js
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../atoms/authAtom';

export default function MyPage() {
    const [userInfo, setUserInfo] = useState({});
    const [auth] = useRecoilState(authState);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/mypage/info', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('사용자 정보를 가져오지 못했습니다.');
                }

                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('사용자 정보 가져오기 실패:', error);
            }
        };

        if (auth) {
            fetchUserInfo();
        }
    }, [auth]);

    if (!auth) {
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
