import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BoardList() {
    const [boards, setBoards] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/boards/public');

                if (!response.ok) {
                    throw new Error('게시물을 가져오는 중 오류가 발생했습니다.');
                }
                const data = await response.json();
                setBoards(data);
            } catch (error) {
                setError(error.message);
                console.error('데이터 가져오기 실패:', error);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-center">게시판 목록</h1>
                {/* 게시물 작성 링크 */}
                <Link
                    to="/boards/create"
                    className="px-4 py-2 bg-green-600 text-white font-semibold 
                               rounded-md hover:bg-green-700 transition-colors duration-300"
                >
                    게시물 작성
                </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {boards.map((board) => (
                    <div
                        key={board.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2 truncate">{board.title}</h2>
                            <p className="text-gray-700 text-sm truncate">{board.content}</p>
                            <p className="text-gray-500 text-sm">{board.author.nickname}</p> {/* 닉네임 표시 */}
                            {/* 댓글 보기 링크 */}
                            <Link
                                to={`/boards/${board.id}`}
                                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white
                                           font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300"
                            >
                                상세보기
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
