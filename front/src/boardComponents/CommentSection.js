import CommentForm from './CommentForm';
import CommentList from './CommentList';

export default function CommentSection({ boardId }) {
    return (
        <div className="mt-6">
            <h2 className="text-2xl mb-4">댓글</h2>
            <CommentForm boardId={boardId} />
            <CommentList boardId={boardId} />
        </div>
    );
}
