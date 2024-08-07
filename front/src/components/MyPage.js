import React from 'react';
import { useState, useEffect } from 'react';
import PasswordReset from './PasswordReset';


export default function MyPage() {
    const [userInfo, setUserInfo] = useState({});
    const [posts, setPosts] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);      // 로그인 상태

    useEffect(() => {
        // 사용자 정보 및 게시글 목록을 가져오는 API 호출
        const fetchUserInfo = async () => {
            // 사용자 정보를 가져오는 API 호출
            try {
                const response = await fetch('http://localhost:8080/api/userinfo', {
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
                // setIsAuthenticated(false);
                console.error('사용자 정보 가져오기 실패:', error)
            }
        };

        const fetchUserPosts = async () => {
            // 사용자 게시글 목록을 가져오는 API 호출
            try {
                const response = await fetch('http://localhost:8080/api/boards', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('게시글 목록 가져오기 실패:', error)
            }
        };

        fetchUserInfo();
        fetchUserPosts();
    }, []);


    if (!isAuthenticated) {
        return <div>로그인 상태가 아닙니다. 로그인 후 다시 시도해 주세요.</div>
    }

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>마이페이지</h1>
            <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
                <h2 className='text-xl font-semibold mb-4'>회원정보</h2>
                <p><strong>이메일:</strong> {userInfo.email}</p>
                <p><strong>닉네임:</strong> {userInfo.nickname}</p>
            </div>

            <PasswordReset />

            <div className='bg-white p-4 rounded-lg shadow-md'>
                <h2 className='text-xl font-semibold mb-4'>내 게시글</h2>
                {posts.length === 0 ? (
                    <p>작성한 게시글이 없습니다.</p>
                ) : (
                    <ul>
                        {posts.map(post => (
                            <li>
                                <h3 className='text-lg font-bold'>{post.title}</h3>
                                <p>{post.content}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    );
}