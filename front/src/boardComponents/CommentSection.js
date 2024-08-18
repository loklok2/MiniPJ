import { useState } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

export default function CommentSection({ boardId }) {
    const [commentsUpdated, setCommentsUpdated] = useState(false)

    const refreshComments = () => {
        setCommentsUpdated(prev => !prev)   // 상태를 변경하여 CommentList가 다시 렌더링되도록 함
    }

    return (
        <div className="mt-6">
            <h2 className="text-2xl mb-4">댓글</h2>
            <CommentForm boardId={boardId} onCommentSubmit={refreshComments} />
            <CommentList boardId={boardId} commentsUpdated={commentsUpdated} />
        </div>
    );
}
