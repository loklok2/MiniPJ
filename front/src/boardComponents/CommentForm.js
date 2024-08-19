import { useEffect, useState } from 'react';
import { useAuthToken } from '../hooks/useAuthToken';
import { useNavigate } from 'react-router-dom';

export default function CommentForm({ boardId, onCommentSubmit }) {
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [token] = useAuthToken();
    const navigate = useNavigate()

    console.log('JWT Token:', token);

    useEffect(() => {
        if (!token) {
            console.log('로그인되지 않은 사용자, 로그인 페이지로 리디렉션합니다.')
            navigate('/login')  // 로그인 페이지로 리디렉션
        }
    }, [token, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!content.trim()) {
            setError("댓글 내용을 입력하세요.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/comments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ boardId, content }),
            });

            if (!response.ok) {
                throw new Error('댓글 작성에 실패했습니다. 로그인 상태를 확인해 주세요');
            }

            const newComment = await response.json();
            setContent('');
            setSuccess('댓글이 작성되었습니다.');
            console.log('댓글이 성공적으로 작성되었습니다:', newComment)
            onCommentSubmit(newComment); // 새 댓글을 상위 컴포넌트로 전달하여 추가
        } catch (error) {
            setError(error.message);
            console.error('댓글 작성 중 오류 발생:', error)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="댓글을 입력하세요"
                required
                className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
            <button
                type="submit"
                className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                댓글 작성
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
        </form>
    );
}
