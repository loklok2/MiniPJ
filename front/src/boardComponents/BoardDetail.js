import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import LikeButton from '../components/LikeButton'
import CommentSection from './CommentSection'
import { formatDate } from '../utils/dateUtils'
import { useAuth } from '../hooks/useAuth'

// API 기본 URL 설정: 환경 변수에서 가져오거나 기본값으로 로컬호스트 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'

export default function BoardDetail() {
    const { auth, logout } = useAuth() // 인증 상태와 로그아웃 함수를 가져옴
    const { id } = useParams() // URL 파라미터에서 게시물 ID를 가져옴
    const [board, setBoard] = useState(null) // 게시물 데이터를 저장하는 상태
    const [comments, setComments] = useState([])    // 댓글 리스트를 저장하는 상태
    const [error, setError] = useState(null) // 오류 메시지를 저장하는 상태
    const [loading, setLoading] = useState(true) // 로딩 상태를 관리하는 상태
    const navigate = useNavigate() // 페이지 이동을 위한 훅

    useEffect(() => {
        // 게시물 데이터를 가져오는 비동기 함수
        const fetchBoard = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
                    method: 'GET',
                })

                if (!response.ok) {
                    throw new Error('게시글을 불러오는 중 오류가 발생했습니다.')
                }

                const data = await response.json()
                setBoard(data) // 게시물 데이터를 상태에 저장
            } catch (error) {
                setError(error.message) // 오류가 발생하면 오류 메시지를 상태에 저장
            } finally {
                setLoading(false) // 로딩 상태 해제
            }
        }

        fetchBoard() // 게시물 데이터를 가져오는 함수 호출
    }, [id]) // ID가 변경될 때마다 실행

    // 댓글 리스트 데이터를 가져오는 함수
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/comments/public/board/${id}`, {
                    method: 'GET',
                })

                if (!response.ok) {
                    console.log('댓글 리스트 응답:', response)
                    if (response.status === 404) {
                        setComments([]) // 404일 경우 빈 배열로 처리
                    } else {
                        throw new Error('댓글을 불러오는 중 오류가 발생했습니다.')
                    }
                } else {
                    const data = await response.json()
                    setComments(data) // 댓글 데이터를 상태에 저장
                }
            } catch (error) {
                setError(error.message) // 오류 발생 시 오류 메시지를 상태에 저장
                setComments([]) // 오류가 발생한 경우 빈 배열로 초기화
            }
        }

        fetchComments() // 댓글 데이터를 가져오는 함수 호출
    }, [id]) // ID가 변경될 때마다 실행

    useEffect(() => {
        if (board && auth.user) {
            console.log("Logged-in user ID:", auth.user.id) // 사용자 ID 확인
            console.log("Board author ID:", board.authorId) // 게시물 작성자 ID 확인
        }
    }, [board, auth.user]) // 게시물 또는 사용자 정보가 변경될 때마다 실행

    // 게시물을 삭제하는 함수
    const handleDelete = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                    },
                })

                if (response.ok) {
                    alert('게시글이 삭제되었습니다.')
                    navigate('/boards') // 게시물 삭제 후 게시판 목록 페이지로 이동
                } else {
                    alert('게시글 삭제에 실패했습니다.')
                }
            } catch (error) {
                console.error('게시글 삭제 오류:', error)
                alert('게시글 삭제 중 오류가 발생했습니다.')
            }
        }
    }

    // 댓글이 추가되었을 때 호출되는 함수
    const handleCommentAdded = (newComment) => {
        setComments(prevComments => [...prevComments, newComment])  // 새 댓글을 기존 댓글 리스트에 추가
    }

    // 댓글을 수정하는 함수
    const handleUpdateComment = async (commentId) => {
        const newContent = prompt('새로운 댓글 내용을 입력하세요:')
        if (!newContent) return

        try {
            const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`,
                },
                body: JSON.stringify({ content: newContent }), // 수정된 댓글 내용을 전송
            })

            if (response.status === 401 || response.status === 500) {
                // JWT 토큰이 만료되었거나 인증되지 않은 경우 처리
                console.error('JWT 토큰이 만료되었거나 유효하지 않습니다. 로그인 페이지로 리디렉션합니다.')
                logout() // 로그아웃 처리
                navigate('/login')  // 로그인 페이지로 리디렉션
                return
            }

            if (!response.ok) {
                throw new Error('댓글 수정에 실패했습니다.')
            }

            const updatedComment = await response.json()

            // 댓글 리스트에서 해당 댓글을 업데이트
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId ? { ...comment, content: updatedComment.content } : comment
                )
            )
        } catch (error) {
            console.error('댓글 수정 실패', error)
            alert('댓글 수정에 실패했습니다.')
        }
    }

    // 댓글을 삭제하는 함수
    const handleDeleteComment = async (commentId) => {
        console.log(`댓글 삭제 요청: commentId = ${commentId}`) // 삭제하려는 댓글 ID 확인

        try {
            const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                },
            })

            if (response.status === 401 || response.status === 500) {
                // JWT 토큰이 만료되었거나 인증되지 않은 경우 처리
                console.error('JWT 토큰이 만료되었거나 유효하지 않습니다. 로그인 페이지로 리디렉션합니다.')
                logout() // 로그아웃 처리
                navigate('/login')  // 로그인 페이지로 리디렉션
                return
            }

            if (response.ok) {
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId)) // 댓글 리스트에서 해당 댓글을 삭제
                console.log('댓글이 삭제되었습니다:', commentId)
            } else {
                const errorText = await response.text(); // 서버로부터의 응답 메시지 확인
                console.error('댓글 삭제 실패:', errorText)
                throw new Error('댓글 삭제에 실패했습니다.')
            }

        } catch (error) {
            console.error('댓글 삭제 중 오류 발생', error)
        }
    }

    // 좋아요 업데이트 핸들러
    const handleLikeUpdate = (updatedBoard) => {
        setBoard(updatedBoard) // 업데이트된 게시물 데이터를 상태에 반영
    }

    // 댓글 좋아요 업데이트 핸들러
    const handleLikeComment = (updatedComment) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === updatedComment.id ? updatedComment : comment
            )
        )
    }

    // 게시물 작성자가 현재 로그인한 사용자인지 확인
    const isAuthor = auth.isLoggedIn && board && String(board.authorId) === String(auth.user?.id)

    // 로딩 중일 때의 화면
    if (loading) {
        return <p>Loading...</p>
    }

    // 오류가 발생했을 때의 화면
    if (error) {
        return <p>{error}</p>
    }

    // 게시물이 존재하지 않을 때의 화면
    if (!board) {
        return <p>게시글을 찾을 수 없습니다.</p>
    }

    return (
        <div className="max-w-screen-lg mx-auto px-4 py-12 bg-white rounded-lg shadow-md mt-8 mb-12">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">{board.title}</h1>
            <p className="text-lg text-gray-700 mb-6 text-center">{board.content}</p>
            <p className="text-gray-600 text-sm text-center mb-4">작성자: {board.authorNickname}</p>

            {/* 여러 이미지 렌더링 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {board.images && board.images.length > 0 ? (
                    board.images.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={image.filename}
                            className="w-full h-auto object-cover rounded-lg shadow-sm"
                        />
                    ))
                ) : (
                    <p className='text-center text-gray-500'>사용 가능한 이미지가 없습니다.</p>
                )}
            </div>

            <div className="text-gray-500 text-sm mb-6 text-center">
                {board.updateDate
                    ? `업데이트된 날짜: ${formatDate(board.updateDate)}`
                    : `작성된 날짜: ${formatDate(board.createDate)}`}
            </div>

            {/* 게시물 작성자에게만 수정, 삭제 버튼 표시 */}
            {isAuthor && (
                <div className="flex justify-end space-x-4 mb-6">
                    <button
                        onClick={() => navigate(`/boards/edit/${id}`, { state: { board } })}
                        className="px-4 py-2 rounded text-white 
                                 bg-yellow-400 hover:bg-yellow-500
                                   transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        수정
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 rounded text-white  
                                 bg-red-500 hover:bg-red-600
                                   transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        삭제
                    </button>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 text-sm">
                    조회수: {board.viewCount}
                </span>
                <LikeButton
                    boardId={board.id}
                    likeCount={board.likeCount}
                    onLike={handleLikeUpdate} // 좋아요 수 업데이트 핸들러
                />
            </div>

            {/* 댓글 섹션 */}
            <CommentSection
                boardId={board.id}
                comments={comments}
                onCommentSubmit={handleCommentAdded} // 댓글 추가 핸들러
                handleUpdate={handleUpdateComment} // 댓글 수정 핸들러
                handleDelete={handleDeleteComment} // 댓글 삭제 핸들러
                handleLikeComment={handleLikeComment} // 댓글 좋아요 핸들러
            />

            <div className="flex justify-center mt-6">
                <Link to="/boards"
                    className="py-2 px-4 rounded text-white  
                               bg-blue-600 hover:bg-blue-700 transition duration-300">
                    목록
                </Link>
            </div>

        </div>
    )
}
