import { useState, useEffect } from 'react';
import SearchBar from '../utils/SearchBar';
import Pagination from '../utils/Pagination';
import BoardCard from '../boardComponents/BoardCard';
import { useNavigate } from 'react-router-dom';

export default function BoardList() {
    const [boards, setBoards] = useState([]);
    const [filteredBoards, setFilteredBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem('currentPage')) || 1);
    const itemsPerPage = 6;
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBoards = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/boards/public');
                if (!response.ok) {
                    throw new Error('게시판 목록을 가져오는 중 오류가 발생했습니다.');
                }
                const data = await response.json();
                setBoards(data);
                setFilteredBoards(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBoards();
    }, []);

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    const handleSearch = () => {
        const filtered = boards.filter(board =>
            board.title.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredBoards(filtered);
        setCurrentPage(1);
    };

    const handleCreateBoard = () => {
        navigate('/boards/create')  // 게시글 작성 페이지로 이동
    }

    const handleLike = (updatedBoard) => {
        setBoards(prevBoards => prevBoards.map(board => board.id === updatedBoard.id ? updatedBoard : board))
        setFilteredBoards(prevFilteredBoards => prevFilteredBoards.map(board => board.id === updatedBoard.id ? updatedBoard : board))
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastBoard = currentPage * itemsPerPage;
    const indexOfFirstBoard = indexOfLastBoard - itemsPerPage;
    const currentBoards = filteredBoards.slice(indexOfFirstBoard, indexOfLastBoard);
    const totalPages = Math.ceil(filteredBoards.length / itemsPerPage);

    if (loading) {
        return <div className="text-center text-xl py-10">로딩 중...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 text-xl py-10">오류: {error}</div>;
    }   

    return (
        <div className="container max-w-screen-lg mx-auto px-4 py-12 relative">
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">여행지 공유</h1>

            <SearchBar
                searchText={searchText}
                onSearchTextChange={setSearchText}
                onSearch={handleSearch}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentBoards.length > 0 ? (
                    currentBoards.map((board) => (
                        <BoardCard
                            key={board.id}
                            board={board}
                            onLike={handleLike}
                        />
                    ))
                ) : (
                    <div className="text-center text-gray-500">검색 결과가 없습니다.</div>
                )}
            </div>


            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={handleCreateBoard}
                    className="py-3 px-6 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    여행공유하기
                </button>
            </div>

        </div>
    );
}
