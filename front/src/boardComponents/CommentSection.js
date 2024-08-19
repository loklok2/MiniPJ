import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { useAuth } from '../hooks/useAuth'

export default function CommentSection({ boardId, commentsUpdated, onCommentSubmit }) {
    const { auth } = useAuth()

    console.log('CommentSection 렌더링됨. commentsUpdated:', commentsUpdated)

    return (
        <div className="mt-6">
            <h2 className="text-2xl mb-4">댓글</h2>
            <CommentList boardId={boardId} />

            {auth.isLoggedIn ? (
                <CommentForm boardId={boardId} onCommentSubmit={onCommentSubmit} />
            ) : (
                <div className='text-center text-gray-600'>
                    댓글을 작성하려면 <a href='/login' className='text-blue-500'>로그인</a>하세요.
                </div>
            )}
        </div>
    );
}
