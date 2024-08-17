import { useState, useEffect } from 'react';
import SearchBar from '../utils/SearchBar';
import Pagination from '../utils/Pagination';
import BoardCard from '../boardComponents/BoardCard';

export default function BoardList() {
    const [boards, setBoards] = useState([]);
    const [filteredBoards, setFilteredBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem('currentPage')) || 1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchBoards = async () => {
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
        setCurrentPage(1); // Reset to the first page after a search
    };

    const handleLike = async (boardId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/boards/${boardId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Include auth token if required
                },
            });

            if (!response.ok) {
                throw new Error('좋아요 증가에 실패했습니다.');
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const updatedBoard = await response.json();
                setBoards(prevBoards => prevBoards.map(board => board.id === boardId ? updatedBoard : board));
                setFilteredBoards(prevFilteredBoards => prevFilteredBoards.map(board => board.id === boardId ? updatedBoard : board));
            } else {
                throw new Error('서버에서 예상치 못한 응답이 반환되었습니다.');
            }
        } catch (error) {
            console.error('좋아요 증가 실패:', error);
            alert('좋아요 증가에 실패했습니다.');
        }
    };

    // Define currentBoards and totalPages
    const indexOfLastBoard = currentPage * itemsPerPage;
    const indexOfFirstBoard = indexOfLastBoard - itemsPerPage;
    const currentBoards = filteredBoards.slice(indexOfFirstBoard, indexOfLastBoard); // Slice filteredBoards based on pagination
    const totalPages = Math.ceil(filteredBoards.length / itemsPerPage); // Calculate total pages

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return <div className="text-center text-xl py-10">로딩 중...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 text-xl py-10">오류: {error}</div>;
    }

    return (
        <div className="container max-w-screen-lg mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">게시판 목록</h1>

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
        </div>
    );
}
