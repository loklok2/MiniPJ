import { useNavigate } from 'react-router-dom' // 페이지 이동을 위한 useNavigate 훅 임포트
import LikeButton from '../components/LikeButton' // LikeButton 컴포넌트 임포트
import { formatDate } from '../utils/dateUtils' // 날짜 형식 변환 유틸리티 함수 임포트
import { useEffect } from 'react' // useEffect 훅 임포트

export default function BoardCard({ board, onLike }) {
    const navigate = useNavigate() // 페이지 이동을 위한 useNavigate 훅 사용

    /**
     * 게시글 카드 클릭 시 해당 게시글의 상세 페이지로 이동하는 함수
     */
    const handleCardClick = () => {
        navigate(`/boards/${board.id}`, { state: { board } }) // 게시글의 ID를 URL에 포함하여 이동
    }

    /**
     * 컴포넌트가 마운트될 때 게시물에 첨부된 이미지를 로그에 출력
     * 이미지가 없을 경우 로그에 표시
     */
    useEffect(() => {
        if (board.images && board.images.length > 0) {
            console.log("이미지 목록 확인:", board.images) // 전체 이미지 배열 로그 출력
            board.images.forEach((image, index) => {
                console.log(`이미지 ${index + 1}:`, image.url) // 각 이미지의 URL을 로그 출력
            })
        } else {
            console.log("이미지가 없습니다:", board.id) // 이미지가 없을 때 게시글 ID 로그 출력
        }
    }, [board.images]) // board.images 배열이 변경될 때마다 실행

    return (
        <div
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105 h-full flex flex-col"
            onClick={handleCardClick} // 카드 클릭 시 handleCardClick 함수 실행
            style={{ minHeight: '350px' }} // 카드의 최소 높이 지정
        >
            {/* 여러 이미지를 렌더링하는 섹션 */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
                {board.images && board.images.length > 0 ? (
                    board.images.map((image, index) => (
                        <img
                            key={index} // 각 이미지에 고유한 키 할당
                            src={image.url} // 이미지의 URL
                            alt={image.filename} // 이미지 파일명 (대체 텍스트)
                            className="w-24 h-24 object-cover rounded-md"
                            style={{ flex: '1 1 0px' }} // 이미지가 일정한 크기를 유지하도록 스타일 설정
                            onError={() => console.error(`이미지 로드 오류: ${image.url}`)} // 이미지 로드 오류 시 로그 출력
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No images available</p> // 이미지가 없을 때 표시
                )}
            </div>

            <div className="flex-grow pt-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-1 truncate">
                    {board.title} {/* 게시물 제목을 렌더링, 긴 제목은 잘림(truncate) */}
                </h2>
                <p className="text-gray-600 mb-2 line-clamp-2">
                    {board.content} {/* 게시물 내용을 렌더링, 두 줄로 제한(line-clamp-2) */}
                </p>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>작성자: {board.authorNickname}</span> {/* 작성자 닉네임 표시 */}
                <span>
                    {board.updateDate
                        ? `업데이트: ${formatDate(board.updateDate)}` // 업데이트 날짜가 있는 경우 표시
                        : `작성일: ${formatDate(board.createDate)}`}
                </span>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold">조회수: {board.viewCount}</span> {/* 조회수 표시 */}
                </div>
                <LikeButton
                    boardId={board.id} // 게시물 ID 전달
                    likeCount={board.likeCount} // 좋아요 수 전달
                    onLike={onLike} // 좋아요 클릭 시 호출될 콜백 함수 전달
                />
            </div>
        </div>
    )
}
