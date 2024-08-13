import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

export default function BoardDetail() {
    const { boardId } = useParams();  // URL에서 boardId를 가져옵니다.
    const [board, setBoard] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
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

    if (error) {
        return <p>{error}</p>;
    }

    if (!board) {
        return <p>게시물을 불러오는 중...</p>;
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{board.title}</h1>
            <p className="mb-6">{board.content}</p>

            {/* 댓글 목록 컴포넌트 */}
            <CommentList boardId={boardId} />

            {/* 댓글 작성 컴포넌트 */}
            <CommentForm boardId={boardId} />
        </div>
    );
}
