import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'

export default function LikeButton({ boardId, commentId, likeCount, onLike }) {
    const navigate = useNavigate()
    const { auth, logout } = useAuth()  // useAuth 훅에서 auth 상태를 가져옴

    const handleLike = async (e) => {
        e.stopPropagation() // 부모 요소로 이벤트 전파 방지

        if (!auth.token) {
            console.error('사용자가 로그인되지 않았습니다. 로그인 페이지로 리디렉션합니다.');
            navigate('/login'); // 로그인 페이지로 리디렉션
            return;
        }

        try {
            // 좋아요 요청 URL을 게시판 또는 댓글에 따라 설정
            const url = boardId
                ? `http://localhost:8080/api/boards/${boardId}/like`
                : `http://localhost:8080/api/comments/${commentId}/like`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`,    // JWT 토큰 포함
                }
            })

            if (response.status === 401 || response.status === 500) {
                // JWT 토큰이 만료되었거나 인증되지 않은 경우
                console.error('JWT 토큰이 만료되었거나 유효하지 않습니다. 로그인 페이지로 리디렉션합니다.')
                logout()
                navigate('/login')  // 로그인 페이지로 리디렉션
                return
            }

            if (!response.ok) {
                throw new Error('좋아요 증가에 실패했습니다.');
            }

            const updatedBoard = await response.json();
            onLike(updatedBoard); // 부모 컴포넌트에 업데이트된 게시글 정보 전달
        } catch (error) {
            console.error('좋아요 증가 실패:', error);
            alert('좋아요 증가에 실패했습니다.');
        }
    };

    return (
        <button
            onClick={handleLike}
            className="flex items-center space-x-1 bg-gradient-to-r from-pink-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <span>❤️</span>
            <span>{likeCount}</span>
        </button>
    );
}
