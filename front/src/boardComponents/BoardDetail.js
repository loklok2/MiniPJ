import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LikeButton from '../components/LikeButton';
import { formatDate } from '../utils/dateUtils';

export default function BoardDetail() {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/boards/${id}`);
                if (!response.ok) {
                    throw new Error('게시글을 불러오는 중 오류가 발생했습니다.');
                }
                const data = await response.json();
                setBoard(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchBoard();
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!board) {
        return <p>Loading...</p>;
    }

    const handleLikeUpdate = (updatedBoard) => {
        setBoard(updatedBoard); // 좋아요 수가 업데이트된 게시글 정보로 상태 업데이트
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl mb-4">{board.title}</h1>
            <p className="text-gray-700 mb-4">{board.content}</p>
            <p className="text-gray-500">작성자: {board.authorNickname}</p>
            <div className="text-gray-500 text-sm mb-4">
                {board.updateDate
                    ? `업데이트된 날짜: ${formatDate(board.updateDate)}`
                    : `작성된 날짜: ${formatDate(board.createDate)}`}
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span>조회수: {board.viewCount}</span>
                    <span>|</span>
                </div>
                <LikeButton
                    boardId={board.id}
                    likeCount={board.likeCount}
                    onLike={handleLikeUpdate}
                />
            </div>
            <Link to="/boards" className="mt-4 inline-block bg-gray-500 text-white py-2 px-4 rounded">
                목록으로 돌아가기
            </Link>
        </div>
    );
}
