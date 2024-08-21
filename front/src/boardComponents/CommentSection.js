import CommentForm from './CommentForm'
import CommentList from './CommentList'
import { useAuth } from '../hooks/useAuth'

// CommentSection 컴포넌트: 게시글의 댓글 섹션을 렌더링하는 컴포넌트
export default function CommentSection({ boardId, comments, onCommentSubmit, handleUpdate, handleDelete, handleLikeComment }) {
    const { auth } = useAuth() // 인증 정보를 가져옴

    return (
        <div className="mt-6">
            {/* 댓글 섹션 제목 */}
            <h2 className="text-2xl mb-4">댓글</h2>
            
            {/* 댓글 리스트를 렌더링 */}
            {comments.length > 0 ? (
                <CommentList 
                    comments={comments} // 현재 댓글 리스트를 전달
                    handleUpdate={handleUpdate} // 댓글 수정 함수 전달
                    handleDelete={handleDelete} // 댓글 삭제 함수 전달
                    handleLikeComment={handleLikeComment} // 댓글 좋아요 함수 전달
                />
            ) : (
                // 댓글이 없을 경우 표시되는 메시지
                <div className='text-center text-gray-500'>
                    댓글이 없습니다.
                </div>
            )}

            {/* 로그인 상태에 따른 댓글 작성 폼 또는 로그인 유도 메시지 */}
            {auth.isLoggedIn ? (
                // 로그인된 경우 댓글 작성 폼을 렌더링
                <CommentForm boardId={boardId} onCommentSubmit={onCommentSubmit} />
            ) : (
                // 로그인되지 않은 경우 로그인 유도 메시지 표시
                <div className='text-center text-gray-600'>
                    댓글을 작성하려면 <a href='/login' className='text-blue-500'>로그인</a>하세요.
                </div>
            )}
        </div>
    )
}
