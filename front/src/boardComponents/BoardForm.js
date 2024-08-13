import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthToken } from '../hooks/useAuthToken';  // JWT 토큰을 가져오는 커스텀 훅
import { useRecoilValue } from 'recoil';
import { authState } from '../atoms/authAtom'; // 인증 상태를 관리하는 Recoil 상태

export default function BoardForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const [token] = useAuthToken();
    const auth = useRecoilValue(authState); // Recoil을 사용하여 현재 인증 상태를 가져옴

    // 로그인 상태 확인: 컴포넌트가 렌더링될 때 사용자가 로그인 상태가 아니라면 로그인 페이지로 리다이렉트
    useEffect(() => {
        if (!auth.isLoggedIn) {
            navigate('/login'); // 사용자가 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        }
    }, [auth, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://localhost:8080/api/boards/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // JWT 토큰을 헤더에 추가
                },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) {
                throw new Error('게시물 작성에 실패했습니다.');
            }

            setSuccess('게시물이 성공적으로 작성되었습니다.');
            setTimeout(() => {
                navigate('/boardlist');
            }, 2000);
        } catch (error) {
            setError(error.message);
            console.error('게시물 작성 실패:', error);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
                <h2 className='text-2xl font-bold text-center mb-4'>게시물 작성</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <input
                            type='text'
                            placeholder='제목'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                    </div>
                    <div className='mb-4'>
                        <textarea
                            placeholder='내용'
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                    </div>
                    <button
                        type='submit'
                        className='w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                    >
                        작성
                    </button>
                </form>
            </div>
        </div>
    );
}
