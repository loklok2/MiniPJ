import { useState, useEffect } from 'react';

export default function CommentList({ boardId }) {
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
                console.error('댓글 가져오기 실패:', error);
            }
        };

        fetchComments();
    }, [boardId]);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>댓글 목록</h2>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id}>
                        <p>{comment.content}</p>
                        <small>{comment.author.username}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}
