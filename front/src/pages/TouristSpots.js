import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SearchBar from '../utils/SearchBar'
import Pagination from '../utils/Pagination'
import TouristSpotCard from '../touristComponents/TouristSpotCard'

export default function TouristSpots() {
    // 상태 변수들
    const [spots, setSpots] = useState([]) // 모든 관광지 데이터를 저장하는 상태
    const [filteredSpots, setFilteredSpots] = useState([]) // 필터링된 관광지 데이터를 저장하는 상태
    const [loading, setLoading] = useState(true) // 데이터를 로딩 중인지 여부를 나타내는 상태
    const [error, setError] = useState(null) // 에러 메시지를 저장하는 상태
    const [expandedSpots, setExpandedSpots] = useState({}) // 각 관광지 카드의 확장 여부를 저장하는 상태
    const [searchText, setSearchText] = useState('') // 검색 텍스트를 저장하는 상태
    const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem('currentPage')) || 1) // 현재 페이지 번호를 저장하는 상태, 로컬 스토리지에서 불러옴
    const itemsPerPage = 6 // 한 페이지에 표시할 항목 수

    // React Router 훅
    const location = useLocation() // 현재 페이지의 위치 정보를 가져옴 (예: URL의 쿼리 파라미터 등)
    const navigate = useNavigate() // 페이지 간 이동을 제어하는 훅
    const { selectedPhoto, searchQuery } = location.state || {} // 이전 페이지에서 전달된 상태를 가져옴 (선택된 사진 URL 또는 검색 쿼리)

    // 관광지 데이터를 가져오는 useEffect 훅
    useEffect(() => {
        const fetchTouristSpots = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/locations/all') // 관광지 데이터를 가져오는 API 호출
                const data = await response.json() // 응답 데이터를 JSON 형식으로 파싱
                setSpots(data) // 모든 관광지 데이터를 상태에 저장

                // 이전 페이지에서 전달된 검색 쿼리 또는 선택된 사진 URL을 기반으로 데이터를 필터링
                if (searchQuery) {
                    const filtered = data.filter(spot =>
                        spot.areaClturTrrsrtNm.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    setFilteredSpots(filtered)
                } else if (selectedPhoto) {
                    const filtered = data.filter(spot => spot.imageUrl === selectedPhoto)
                    setFilteredSpots(filtered)
                } else {
                    setFilteredSpots(data) // 필터링 조건이 없을 경우 모든 데이터를 표시
                }
            } catch (error) {
                setError(error.message) // 에러 발생 시 에러 메시지를 상태에 저장
            } finally {
                setLoading(false) // 데이터 로딩이 끝났음을 표시
            }
        }

        fetchTouristSpots() // 데이터 가져오기 함수 호출
    }, []) // selectedPhoto 또는 searchQuery가 변경될 때마다 실행

    // 페이지 변경 시 로컬 스토리지에 현재 페이지 번호 저장
    useEffect(() => {
        localStorage.setItem('currentPage', currentPage)
    }, [currentPage])

    // 검색어를 기반으로 관광지 데이터를 필터링하는 함수
    const handleSearch = () => {
        const filtered = spots.filter(spot =>
            spot.areaClturTrrsrtNm.toLowerCase().includes(searchText.toLowerCase())
        )
        setFilteredSpots(filtered)
        setCurrentPage(1) // 새로운 검색 시 페이지를 1로 리셋
    }

    // 현재 페이지에 표시할 관광지 데이터를 계산하는 변수들
    const indexOfLastSpot = currentPage * itemsPerPage // 현재 페이지에서의 마지막 항목 인덱스
    const indexOfFirstSpot = indexOfLastSpot - itemsPerPage // 현재 페이지에서의 첫 항목 인덱스
    const currentSpots = filteredSpots.slice(indexOfFirstSpot, indexOfLastSpot) // 현재 페이지에 표시할 관광지 데이터
    const totalPages = Math.ceil(filteredSpots.length / itemsPerPage) // 전체 페이지 수 계산

    // 페이지 번호가 변경될 때 호출되는 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    // 데이터를 로딩 중일 때 표시할 UI
    if (loading) {
        return <div className="text-center text-xl py-10">로딩 중...</div>
    }

    // 에러가 발생했을 때 표시할 UI
    if (error) {
        return <div className="text-center text-red-500 text-xl py-10">오류: {error}</div>
    }

    // 관광지 목록과 페이지 네비게이션을 렌더링
    return (
        <div className="container max-w-screen-lg mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">관광지 정보</h1>

            {/* 검색 바 섹션 */}
            <SearchBar
                searchText={searchText}
                onSearchTextChange={setSearchText}
                onSearch={handleSearch}
            />

            {/* 관광지 카드 섹션 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentSpots.length > 0 ? (
                    currentSpots.map((spot) => {
                        const isExpanded = expandedSpots[spot.dataNo] || false

                        return (
                            <TouristSpotCard
                                key={spot.dataNo}
                                spot={spot}
                                isExpanded={isExpanded}
                                onToggleExpand={() => setExpandedSpots(prev => ({ ...prev, [spot.dataNo]: !isExpanded }))}
                                onViewMap={() => navigate('/map', { state: { selectedSpot: spot } })}
                            />
                        )
                    })
                ) : (
                    <div className="text-center text-gray-500">검색 결과가 없습니다.</div>
                )}
            </div>

            {/* 페이지 네비게이션 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}
