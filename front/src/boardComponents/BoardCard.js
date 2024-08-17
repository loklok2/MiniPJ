import React from 'react';
import { useNavigate } from 'react-router-dom';
import LikeButton from '../components/LikeButton';
import { formatDate } from '../utils/dateUtils';

export default function BoardCard({ board, onLike }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/boards/${board.id}`);
    };

    return (
        <div 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={handleCardClick}  // 카드 전체 클릭 시 상세보기로 이동
        >
            {board.images && board.images.length > 0 && (
                <img
                    src={`data:image/jpeg;base64,${board.images[0]}`}
                    alt={board.title}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
            )}
            <h2 className="text-xl font-semibold mb-2 truncate">
                {board.title}
            </h2>
            <p className="text-gray-700 mb-4 truncate">
                {board.content}
            </p>
            <div className="flex justify-between items-center mb-2">
                <p className="text-gray-500">작성자: {board.authorNickname}</p>
            </div>
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
                    onLike={onLike}
                />
            </div>
        </div>
    );
}
