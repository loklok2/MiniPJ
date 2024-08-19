import { useState } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

export default function CommentSection({ boardId }) {
    const [comments, setComments] = useState([]);

    const handleCommentAdded  = (newComment) => {
        setComments(prevComments => [...prevComments, newComment])   // 상태를 변경하여 CommentList가 다시 렌더링되도록 함
    }

    return (
        <div className="mt-6">
            <h2 className="text-2xl mb-4">댓글</h2>
            <CommentForm boardId={boardId} onCommentSubmit={handleCommentAdded} />
            <CommentList boardId={boardId}/>
        </div>
    );
}
