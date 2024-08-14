import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../atoms/authAtom';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

export default function BoardDetail() {
    const { boardId } = useParams();  // URL에서 boardId를 가져옵니다.
    const [board, setBoard] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const auth = useRecoilValue(authState);

    useEffect(() => {
        console.log("boardId:", boardId); // boardId가 올바르게 들어오는지 확인
        if (boardId === "create") {
            setError("잘못된 접근입니다.");
            return;
        }

        const fetchBoard = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/boards/${boardId}`);

                if (!response.ok) {
                    throw new Error('게시물을 가져오는 중 오류가 발생했습니다.');
                }

                const data = await response.json();
                setBoard(data);
            } catch (error) {
                setError(error.message);
                console.error('게시물 가져오기 실패:', error);
            }
        };

        fetchBoard();
    }, [boardId]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/boards/${boardId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                },
            });

            if (response.ok) {
                navigate('/boards');
            } else {
                throw new Error('게시물 삭제에 실패했습니다.');
            }
        } catch (error) {
            setError(error.message);
            console.error('게시물 삭제 실패:', error);
        }
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!board) {
        return <p>게시물을 불러오는 중...</p>;
    }

    const isAuthor = auth.user && board.author && auth.user.username === board.author.username;

    return (
        <div className='w-full max-w-3xl mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-6'>{board.title}</h1>
            <p className='mb-8'>{board.content}</p>
            <p className='mb-8 text-gray-500'>{board.author.nickname}</p>   {/* 닉네임 표시 */}

            <div className="flex justify-end space-x-2 mb-6">
                {auth.isLoggedIn && isAuthor && (
                    <>
                        {/* 로그인된 사용자: 수정 버튼 */}
                        <button
                            className='px-4 py-2 bg-blue-500 text-white rounded-md 
                                     hover:bg-blue-600 trasition-colors duration-300'
                            onClick={() => navigate(`/boards/edit/${boardId}`)}
                        >
                            수정
                        </button>

                        {/* 로그인된 사용자: 삭제 버튼 */}
                        <button
                            className='px-4 py-2 bg-red-500 text-white rounded-md 
                                     hover:bg-red-600 transition-colors duration-300'
                            onClick={handleDelete}
                        >
                            삭제
                        </button>

                    </>


                )}

                {/* 목록(뒤로가기) 버튼 */}
                <button
                    className='px-4 py-2 bg-gray-500 text-white rounded-md 
                         hover:bg-gray-600 transition-colors duration-300'
                    onClick={() => navigate('/boards')}
                >
                    목록
                </button>
            </div>

            {/* 댓글 목록 컴포넌트 */}
            <CommentList boardId={boardId} />

            {/* 댓글 작성 컴포넌트 */}
            <CommentForm boardId={boardId} />
        </div>
    );
}
