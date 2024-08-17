export default function LikeButton({ boardId, likeCount, onLike }) {
    const handleLike = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/boards/${boardId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // 필요한 경우 JWT 토큰 추가
                },
            });

            if (!response.ok) {
                throw new Error('좋아요 증가에 실패했습니다.');
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const updatedBoard = await response.json();
                onLike(updatedBoard); // 부모 컴포넌트에 업데이트된 게시글 정보 전달
            } else {
                throw new Error('서버에서 예상치 못한 응답이 반환되었습니다.');
            }
        } catch (error) {
            console.error('좋아요 증가 실패:', error);
            alert('좋아요 증가에 실패했습니다.');
        }
    };

    return (
        <button
            onClick={handleLike}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
            ❤️ {likeCount}
        </button>
    );
}
