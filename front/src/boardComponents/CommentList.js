import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import LikeButton from '../components/LikeButton'
import Pagination from '../utils/Pagination'
import { formatDate } from '../utils/dateUtils'

// CommentList 컴포넌트는 댓글 목록을 관리하고, 페이지네이션, 좋아요, 수정, 삭제 기능을 제공하는 컴포넌트입니다.
export default function CommentList({ comments, handleDelete, handleUpdate, handleLikeComment }) {
    const { auth } = useAuth()  // 현재 로그인된 사용자 정보를 가져오기 위해 useAuth 훅을 사용

    const [currentPage, setCurrentPage] = useState(1)  // 현재 페이지 상태 관리
    const commentsPerPage = 5 // 페이지당 표시할 댓글 수
    const totalPages = Math.ceil(comments.length / commentsPerPage) // 전체 페이지 수 계산

    // 현재 페이지에 해당하는 댓글들만 가져오기
    const getPaginatedComments = () => {
        const startIndex = (currentPage - 1) * commentsPerPage // 현재 페이지의 첫 댓글 인덱스
        const endIndex = startIndex + commentsPerPage // 현재 페이지의 마지막 댓글 인덱스
        return comments.slice(startIndex, endIndex) // 현재 페이지에 해당하는 댓글들 반환
    }

    // comments 상태를 추적하기 위한 useEffect 추가
    useEffect(() => {
        // 현재 comments 상태와 로그인된 사용자 정보를 콘솔에 출력 (디버깅용)
        console.log('현재 comments 상태:', comments)
        comments.forEach(comment => {
            console.log(`Comment ID: ${comment.id}, isEdited: ${comment.isEdited}`)
        })
        console.log('현재 로그인 사용자 ID:', auth.user?.id)
    }, [comments, auth]) // comments나 auth가 변경될 때마다 실행

    // 댓글이 없을 경우 표시할 메시지
    if (comments.length === 0) {
        return <p className='text-center text-gray-500'>댓글이 없습니다.</p>
    }

    return (
        <>
            {/* 댓글 리스트 */}
            <ul className='space-y-6'>
                {getPaginatedComments().map(comment => (
                    <li key={comment.id} // 각 댓글에 고유 ID를 키로 부여
                        className='p-4 bg-gray-100 rounded-lg shadow-sm'>
                        <div className='flex justify-between items-start mb-2'>
                            <p className='text-gray-800 font-semibold'>{comment.content}</p> {/* 댓글 내용 */}
                            <p className='text-gray-600 text-sm'>작성자: {comment.authorNickname}</p> {/* 댓글 작성자 */}
                        </div>

                        {/* 댓글 작성자와 현재 로그인된 사용자가 일치할 때만 수정, 삭제 버튼 렌더링 */}
                        {auth.isLoggedIn && auth.user?.id === comment.authorId && (
                            <div className='flex justify-end items-center space-x-2'>
                                <button
                                    onClick={() => handleUpdate(comment.id)} // 수정 버튼 클릭 시 호출
                                    className='text-blue-500 text-xs hover:underline'
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDelete(comment.id)} // 삭제 버튼 클릭 시 호출
                                    className='text-red-500 text-xs hover:underline'
                                >
                                    삭제
                                </button>
                            </div>
                        )}

                        <div className='flex justify-between items-center mt-2'>
                            <LikeButton
                                commentId={comment.id} // 좋아요 버튼에 전달할 댓글 ID
                                likeCount={comment.likeCount} // 현재 좋아요 수
                                onLike={(updatedComment) => handleLikeComment(updatedComment)} // 좋아요 클릭 시 호출될 함수
                            />
                            <span className='text-gray-500 text-xs'>
                                {/* 댓글이 수정된 경우 수정된 날짜를 표시, 그렇지 않으면 생성된 날짜 표시 */}
                                {comment.isEdited
                                    ? `${formatDate(comment.editedDate)} (수정)`
                                    : formatDate(comment.createDate)}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>

            {/* 페이지네이션 컴포넌트 */}
            <Pagination
                currentPage={currentPage} // 현재 페이지 번호
                totalPages={totalPages} // 전체 페이지 수
                onPageChange={setCurrentPage} // 페이지가 변경될 때 호출되는 함수
            />
        </>
    )
}
