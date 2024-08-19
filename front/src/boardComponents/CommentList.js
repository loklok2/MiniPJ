import { useEffect, useState } from 'react';
import { useAuthToken } from '../hooks/useAuthToken';

export default function CommentList({ boardId, commentsUpdated }) {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [token] = useAuthToken();

    // JWT 토큰을 콘솔에 출력
    console.log('JWT Token:', token);

    useEffect(() => {
        setError(null); // 이전 오류 메시지를 초기화
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/comments/board/${boardId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('댓글을 가져오는 중 오류가 발생했습니다.');
                }

                const data = await response.json();
                setComments(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchComments();
    }, [boardId, token, commentsUpdated]) // commentsUpdated가 변경될 때마다 댓글을 새로 가져옴

    const handleDelete = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (response.ok) {
                // 댓글 삭제 후, 댓글 목록을 새로 고침하거나 업데이트함.
                setComments(comments.filter(comment => comment.id !== commentId))
            } else {
                throw new Error('댓글 삭제에 실패했습니다.')
            }
        } catch (error) {
            setError(error.message)
        }
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <ul>
            {comments.map(comment => (
                <li key={comment.id}
                    className="mb-4">
                    <p className="text-gray-800">{comment.content}</p>
                    <p className="text-gray-600 text-sm">작성자: {comment.authorNickname}</p>
                    <button
                        onClick={() => handleDelete(comment.id)}
                        className='text-red-500 text-sm'
                    >
                        삭제
                    </button>
                </li>
            ))}
        </ul>
    );
}
