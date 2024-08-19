import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import LikeButton from '../components/LikeButton';
import CommentSection from './CommentSection'
import { formatDate } from '../utils/dateUtils';
import { useAuth } from '../hooks/useAuth';

export default function BoardDetail() {
    const [board, setBoard] = useState(location.state?.board || null);
    const [comments, setComments] = useState([])    // 댓글 리스트 상태 추가
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { auth } = useAuth();
    const location = useLocation();
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
                const response = await fetch(`http://localhost:8080/api/comments/public/${id}`, {
                    method: 'GET',
                })

                if (!response.ok) {
                    console.log('댓글 리스트 응답:', response)
                    throw new Error('댓글을 불러오는 중 오류가 발생했습니다.')
                }

                const data = await response.json()
                setComments(data)
            } catch (error) {
                setError(error.message)
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
    
    // 댓글이 추가되었을 때 호출되는 함수
    const handleCommentAdded = (newComment) => {
        setComments(prevComments => [...prevComments, newComment])  // 새 댓글을 리스트에 추가
    }

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

    // 댓글 삭제 핸들러
    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                },
            })

            if (response.ok) {
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId))
                console.log('댓글이 삭제되었습니다:', commentId)
            } else {
                throw new Error('댓글 삭제에 실패했습니다.')
            }
        } catch (error) {
            console.error('댓글 삭제 중 오류 발생', error)
        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }


    const handleLikeUpdate = (updatedBoard) => {
        setBoard(updatedBoard);
    };

    return (
        <div className="max-w-screen-lg mx-auto px-6 py-12 bg-white rounded-lg shadow-md mt-20 mb-12">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">{board.title}</h1>
            <p className="text-lg text-gray-700 mb-6 text-center">{board.content}</p>
            <p className="text-gray-600 mb-4 text-center">작성자: {board.authorNickname}</p>

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
                    <p>사용 가능한 이미지가 없습니다.</p>
                )}
            </div>

            <div className="text-gray-500 text-sm mb-6 text-center">
                {board.updateDate
                    ? `업데이트된 날짜: ${formatDate(board.updateDate)}`
                    : `작성된 날짜: ${formatDate(board.createDate)}`}
            </div>

            {/* 권한 확인 후 수정, 삭제 버튼 표시 */}
            {auth.isLoggedIn && auth.user && auth.user.id === board.authorId && (
                <div className="flex justify-end space-x-4 mb-6">
                    <button
                        onClick={() => navigate(`/boards/edit/${id}`, { state: { board } })}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        수정
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        삭제
                    </button>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2 text-gray-500">
                    <span>조회수: {board.viewCount}</span>
                </div>
                <LikeButton
                    boardId={board.id}
                    likeCount={board.likeCount}
                    onLike={handleLikeUpdate}
                />
            </div>

            {/* 댓글 섹션 */}
            <CommentSection boardId={board.id} 
                            comments={comments} 
                            onCommentSubmit={handleCommentAdded} />

            <div className="flex justify-center mt-6">
                <Link to="/boards" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                    목록으로 돌아가기
                </Link>
            </div>
        </div>
    );
}
