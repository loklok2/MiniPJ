import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LikeButton from '../components/LikeButton';
import Pagination from '../utils/Pagination';
import { formatDate } from '../utils/dateUtils';

export default function CommentList({ comments, handleDelete, handleUpdate, handleLikeComment }) {
    const { auth } = useAuth()

    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5; // 페이지당 댓글 수
    const totalPages = Math.ceil(comments.length / commentsPerPage);

    // 현재 페이지에 해당한는 댓글들만 가져오기
    const getPaginatedComments = () => {
        const startIndex = (currentPage - 1) * commentsPerPage
        const endIndex = startIndex + commentsPerPage
        return comments.slice(startIndex, endIndex)
    }

    // comments 상태를 추적하기 위한 useEffect 추가
    useEffect(() => {
        console.log('현재 comments 상태:', comments)
        comments.forEach(comment => {
            console.log(`Comment ID: ${comment.id}, isEdited: ${comment.isEdited}`);
        });
        console.log('현재 로그인 사용자 ID:', auth.user?.id)
    }, [comments, auth])

    if (comments.length === 0) {
        return <p className='text-center text-gray-500'>댓글이 없습니다.</p>
    }

    return (
        <>
            <ul className='space-y-6'>
                {getPaginatedComments().map(comment => (
                    <li key={comment.id}
                        className='p-4 bg-gray-100 rounded-lg shadow-sm'>
                        <div className='flex justify-between items-start mb-2'>
                            <p className='text-gray-800 font-semibold'>{comment.content}</p>
                            <p className='text-gray-600 text-sm'>작성자: {comment.authorNickname}</p>

                        </div>

                        {auth.isLoggedIn && auth.user?.id === comment.authorId && ( // 로그인된 상태에서 댓글 작성자와 사용자 ID가 일치할 때만 삭제 버튼 렌더링
                            <div className='flex justify-end items-center space-x-2'>
                                <button
                                    onClick={() => handleUpdate(comment.id)}
                                    className='text-blue-500 text-xs hover:underline'
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className='text-red-500 text-xs hover:underline'
                                >
                                    삭제
                                </button>
                            </div>
                        )}
                        <div className='flex justify-between items-center mt-2'>
                            <LikeButton
                                commentId={comment.id}
                                likeCount={comment.likeCount}
                                onLike={(updatedComment) => handleLikeComment(updatedComment)}
                            />
                            <span className='text-gray-500 text-xs'>
                                {comment.isEdited
                                    ? `${formatDate(comment.editedDate)} (수정)`
                                    : formatDate(comment.createDate)}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

        </>
    )

}