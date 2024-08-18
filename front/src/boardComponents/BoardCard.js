import { useNavigate } from 'react-router-dom';
import LikeButton from '../components/LikeButton';
import { formatDate } from '../utils/dateUtils';
import { useEffect } from 'react';

export default function BoardCard({ board, onLike }) {
    const navigate = useNavigate();

    // 게시글 카드 클릭 시 상세 페이지로 이동
    const handleCardClick = () => {
        navigate(`/boards/${board.id}`, { state: { board } });
    };

    useEffect(() => {
        if (board.images && board.images.length > 0) {
            console.log("이미지 URL 요청 중:", board.images[0].url);  // 로그 출력
        }
    }, [board.images]);

    return (
        <div
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105 h-full flex flex-col"
            onClick={handleCardClick}
            style={{ minHeight: '350px' }}  // 최소 높이를 지정하여 카드의 높이를 일정하게 유지
        >
            {/* 여러 이미지 렌더링 */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
                {board.images && board.images.length > 0 ? (
                    board.images.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={image.filename}
                            className="w-24 h-24 object-cover rounded-md"
                            style={{ flex: '1 1 0px' }}  // 이미지가 일정한 크기를 유지하게 함
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No images available</p>
                )}
            </div>

            <div className="flex-grow pt-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-1 truncate">
                    {board.title}
                </h2>
                <p className="text-gray-600 mb-2 line-clamp-2">
                    {board.content}
                </p>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>작성자: {board.authorNickname}</span>
                <span>
                    {board.updateDate
                        ? `업데이트: ${formatDate(board.updateDate)}`
                        : `작성일: ${formatDate(board.createDate)}`}
                </span>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold">조회수: {board.viewCount}</span>
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
