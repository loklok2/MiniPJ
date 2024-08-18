import { useEffect, useState } from 'react';

export default function CommentList({ boardId, commentsUpdated }) {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/comments/by-board/${boardId}`);
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
    }, [boardId, commentsUpdated]) // commentsUpdated가 변경될 때마다 댓글을 새로 가져옴

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
                </li>
            ))}
        </ul>
    );
}
