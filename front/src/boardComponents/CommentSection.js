import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { useAuth } from '../hooks/useAuth'

export default function CommentSection({ boardId, comments, onCommentSubmit, handleUpdate, handleDelete, handleLikeComment }) {
    const { auth } = useAuth()



    return (
        <div className="mt-6">
            <h2 className="text-2xl mb-4">댓글</h2>
            {comments.length > 0 ? (
                <CommentList 
                        comments={comments} 
                        handleUpdate={handleUpdate} 
                        handleDelete={handleDelete} 
                        handleLikeComment={handleLikeComment} // LikeButton에 좋아요 핸들러 전달
                />
            ) : (
                <div className='text-center text-gray-500'>
                    댓글이 없습니다.
                </div>
            )}

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
