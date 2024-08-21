import { useState, useEffect } from 'react'  // useState, useEffect 훅 임포트
import { useNavigate } from 'react-router-dom'  // useNavigate 훅 임포트
import SearchBar from '../utils/SearchBar'  // SearchBar 컴포넌트 임포트
import Pagination from '../utils/Pagination'  // Pagination 컴포넌트 임포트
import BoardCard from '../boardComponents/BoardCard'  // BoardCard 컴포넌트 임포트

// API 기본 URL 설정: 환경 변수에서 가져오거나 기본값으로 로컬호스트 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'

export default function BoardList() {
    // 상태(state) 변수 설정
    const [boards, setBoards] = useState([])  // 전체 게시판 목록을 저장하는 상태
    const [searchText, setSearchText] = useState('')  // 검색어를 저장하는 상태
    const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem('currentPage')) || 1)  // 현재 페이지를 저장하는 상태
    const itemsPerPage = 6  // 한 페이지에 표시할 게시물 수
    const [loading, setLoading] = useState(true)  // 데이터 로딩 상태를 관리하는 상태
    const [error, setError] = useState(null)  // 오류 메시지를 저장하는 상태
    const navigate = useNavigate()  // 페이지 이동을 위한 useNavigate 훅

    // useEffect 훅: 컴포넌트가 마운트될 때 한 번 실행되어 게시판 목록을 가져옴
    useEffect(() => {
        const fetchBoards = async () => {
            setLoading(true)  // 데이터를 로드하는 동안 로딩 상태를 true로 설정
            try {
                const response = await fetch(`${API_BASE_URL}/boards/public`)  // API를 호출하여 게시판 목록 데이터를 가져옴
                if (!response.ok) {
                    throw new Error('게시판 목록을 가져오는 중 오류가 발생했습니다.')  // 응답이 성공적이지 않으면 오류를 발생시킴
                }
                const data = await response.json()  // 응답 데이터를 JSON 형식으로 파싱
                setBoards(data)  // 파싱된 데이터를 boards 상태에 저장
            } catch (error) {
                setError(error.message)  // 오류가 발생하면 error 상태에 오류 메시지를 저장
            } finally {
                setLoading(false)  // 데이터 로딩이 완료되면 로딩 상태를 false로 설정
            }
        }

        fetchBoards()  // 게시판 목록을 가져오는 함수 호출
    }, [])  // 빈 의존성 배열로 컴포넌트 마운트 시에만 실행

    // useEffect 훅: currentPage가 변경될 때마다 로컬 스토리지에 현재 페이지 정보를 저장
    useEffect(() => {
        localStorage.setItem('currentPage', currentPage)  // 현재 페이지 정보를 로컬 스토리지에 저장
    }, [currentPage])  // currentPage가 변경될 때마다 실행

    // 게시물 좋아요 업데이트를 처리하는 함수
    const handleLike = (updatedBoard) => {
        setBoards(prevBoards =>
            prevBoards.map(board => board.id === updatedBoard.id ? updatedBoard : board)  // 좋아요가 눌린 게시물을 업데이트된 내용으로 교체
        )
    }

    // 검색 버튼 클릭 시 호출되는 함수
    const handleSearch = () => {
        setCurrentPage(1)  // 검색 결과를 첫 번째 페이지로 표시하기 위해 현재 페이지를 1로 설정
    }

    // 새 게시물 작성 페이지로 이동하는 함수
    const handleCreateBoard = () => {
        navigate('/boards/create')  // 게시글 작성 페이지로 이동
    }

    // 페이지네이션에서 페이지가 변경될 때 호출되는 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)  // 선택된 페이지 번호로 currentPage 상태를 업데이트
    }

    // 필터링된 게시물 목록을 계산
    const filteredBoards = boards.filter(board =>
        board.title.toLowerCase().includes(searchText.toLowerCase())  // 검색어와 일치하는 게시물 필터링
    )

    // 현재 페이지에 해당하는 게시물 목록을 계산
    const indexOfLastBoard = currentPage * itemsPerPage  // 현재 페이지에서 마지막으로 표시될 게시물의 인덱스 계산
    const indexOfFirstBoard = indexOfLastBoard - itemsPerPage  // 현재 페이지에서 첫 번째로 표시될 게시물의 인덱스 계산
    const currentBoards = filteredBoards.slice(indexOfFirstBoard, indexOfLastBoard)  // 현재 페이지에 표시될 게시물 목록 슬라이스
    const totalPages = Math.ceil(filteredBoards.length / itemsPerPage)  // 전체 페이지 수 계산

    // 로딩 상태일 때 보여줄 컴포넌트
    if (loading) {
        return <div className="text-center text-xl py-10">로딩 중...</div>  // 데이터가 로딩 중일 때 표시
    }

    // 오류가 발생했을 때 보여줄 컴포넌트
    if (error) {
        let errorMessage;
        if (error.message.includes('Network')) {
            errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.';
        } else if (error.message.includes('404')) {
            errorMessage = '데이터를 찾을 수 없습니다. 잘못된 요청입니다.';
        } else {
            errorMessage = `오류가 발생했습니다: ${error.message}`;
        }
        return <div className="text-center text-red-500 text-xl py-10">{errorMessage}</div>;
    }


    // 게시판 목록을 렌더링하는 컴포넌트
    return (
        <div className="container max-w-screen-lg mx-auto px-4 py-12 relative">
            {/* 페이지 제목 */}
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">여행지 공유</h1>

            {/* 검색 바 컴포넌트 */}
            <SearchBar
                searchText={searchText}
                onSearchTextChange={setSearchText}
                onSearch={handleSearch}
            />

            {/* 게시물 카드 리스트 */}
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
                    <div className="text-center text-gray-500">
                        검색 결과가 없습니다.
                        <div className="mt-4">
                            <p>다른 검색어를 시도해보세요:</p>
                            <button onClick={() => setSearchText('추천 키워드1')} className="text-blue-500">추천 키워드1</button>
                            <button onClick={() => setSearchText('추천 키워드2')} className="text-blue-500">추천 키워드2</button>
                        </div>
                    </div>
                )}

            </div>

            {/* 페이지네이션 컴포넌트 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* 게시물 작성 버튼 */}
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={handleCreateBoard}
                    className="py-3 px-6 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    여행공유하기
                </button>
            </div>
        </div>
    )
}
