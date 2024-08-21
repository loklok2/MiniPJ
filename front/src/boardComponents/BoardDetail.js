import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LikeButton from '../components/LikeButton';
import CommentSection from './CommentSection'
import { formatDate } from '../utils/dateUtils';
import { useAuth } from '../hooks/useAuth';

export default function BoardDetail() {
    const [board, setBoard] = useState(null);
    const [comments, setComments] = useState([])    // 댓글 리스트 상태 추가
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/boards/${id}`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error('게시글을 불러오는 중 오류가 발생했습니다.');
                }

                const data = await response.json();
                setBoard(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBoard();
    }, [id]);

    // 댓글 리스트 데이터 로드
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/comments/public/board/${id}`, {
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
                    setComments(data)
                }
            } catch (error) {
                setError(error.message)
                setComments([]) // 오류가 발생한 경우에도 빈 배열로 설정
            }
        }

        fetchComments()
    }, [id])

    useEffect(() => {
        if (board && auth.user) {
            console.log("Logged-in user ID:", auth.user.id); // 이 값이 제대로 출력되는지 확인합니다.
            console.log("Board author ID:", board.authorId);
        }
    }, [board, auth.user]);


    // 게시판 삭제 핸들러
    const handleDelete = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/boards/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                    },
                });

                if (response.ok) {
                    alert('게시글이 삭제되었습니다.');
                    navigate('/boards');
                } else {
                    alert('게시글 삭제에 실패했습니다.');
                }
            } catch (error) {
                console.error('게시글 삭제 오류:', error);
                alert('게시글 삭제 중 오류가 발생했습니다.');
            }
        }
    }

    // 댓글이 추가되었을 때 호출되는 함수
    const handleCommentAdded = (newComment) => {
        setComments(prevComments => [...prevComments, newComment])  // 새 댓글을 리스트에 추가
    }

    // 댓글 수정 핸들러
    const handleUpdateComment = async (commentId) => {
        const newContent = prompt('새로운 댓글 내용을 입력하세요:')
        if (!newContent) return

        try {
            const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`,
                },
                body: JSON.stringify({ content: newContent }),
            })

            if (response.status === 401 || response.status === 500) {
                // JWT 토큰이 만료되었거나 인증되지 않은 경우
                console.error('JWT 토큰이 만료되었거나 유효하지 않습니다. 로그인 페이지로 리디렉션합니다.')
                logout()
                navigate('/login')  // 로그인 페이지로 리디렉션
                return
            }

            if (!response.ok) {
                throw new Error('댓글 수정에 실패했습니다.')
            }

            const updatedComment = await response.json()

            // 화면에 JSON 전체가 표시되지 않도록, 댓글 내용을 업데이트
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

    // 댓글 삭제 핸들러
    const handleDeleteComment = async (commentId) => {
        console.log(`댓글 삭제 요청: commentId = ${commentId}`) // 삭제하려는 댓글 ID 확인

        try {
            const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                },
            })

            if (response.status === 401 || response.status === 500) {
                // JWT 토큰이 만료되었거나 인증되지 않은 경우
                console.error('JWT 토큰이 만료되었거나 유효하지 않습니다. 로그인 페이지로 리디렉션합니다.')
                logout()
                navigate('/login')  // 로그인 페이지로 리디렉션
                return
            }

            if (response.ok) {
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId))
                console.log('댓글이 삭제되었습니다:', commentId)
            } else {
                const errorText = await response.text(); // 서버로부터의 응답 메시지를 확인
                console.error('댓글 삭제 실패:', errorText);
                throw new Error('댓글 삭제에 실패했습니다.');
            }

        } catch (error) {
            console.error('댓글 삭제 중 오류 발생', error)
        }
    }

    const handleLikeUpdate = (updatedBoard) => {
        setBoard(updatedBoard);
    }

    const handleLikeComment = (updatedComment) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === updatedComment.id ? updatedComment : comment
            )
        )
    }

    // isAuthor 변수를 board가 null이 아닌 경우에만 설정
    const isAuthor = auth.isLoggedIn && board && String(board.authorId) === String(auth.user?.id);

    // 게시물 또는 사용자 정보가 없을 때 렌더링 방지
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!board) {
        return <p>게시글을 찾을 수 없습니다.</p>;
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

            {/* 권한 확인 후 수정, 삭제 버튼 표시 */}
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
                    onLike={handleLikeUpdate}
                />
            </div>


            {/* 댓글 섹션 */}
            <CommentSection
                boardId={board.id}
                comments={comments}
                onCommentSubmit={handleCommentAdded}
                handleUpdate={handleUpdateComment}
                handleDelete={handleDeleteComment}
                handleLikeComment={handleLikeComment}
            />

            <div className="flex justify-center mt-6">
                <Link to="/boards"
                    className="py-2 px-4 rounded text-white  
                               bg-blue-600 hover:bg-blue-700 transition duration-300">
                    목록
                </Link>
            </div>

        </div>
    );
}