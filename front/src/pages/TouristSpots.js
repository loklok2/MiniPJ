import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SearchBar from '../utils/SearchBar'
import Pagination from '../utils/Pagination'
import TouristSpotCard from '../touristComponents/TouristSpotCard'

// API 기본 URL 설정: 환경 변수에서 가져오거나 기본값으로 로컬호스트 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'

export default function TouristSpots() {
    // 관광지 전체 데이터를 저장하는 상태
    const [spots, setSpots] = useState([])

    // 필터링된 관광지 데이터를 저장하는 상태
    const [filteredSpots, setFilteredSpots] = useState([])

    // 각 관광지 카드의 확장 여부를 관리하는 상태
    const [expandedSpots, setExpandedSpots] = useState({})
    
    // 검색 바에 입력된 텍스트를 저장하는 상태
    const [searchText, setSearchText] = useState('')
    
    // 현재 페이지 번호를 저장하는 상태, 로컬 스토리지에서 초기값을 가져옴
    const [currentPage, setCurrentPage] = useState(
        parseInt(localStorage.getItem('currentPage')) || 1
    )
    
    // 에러 메시지를 저장하는 상태
    const [error, setError] = useState(null)

    // 데이터 로딩 상태를 관리하는 상태
    const [loading, setLoading] = useState(true)

    // 한 페이지에 표시할 아이템 수 설정
    const itemsPerPage = 6

    // 현재 위치와 내비게이션 훅 설정
    const location = useLocation()
    const navigate = useNavigate()

    // 다른 페이지로부터 전달받은 상태 추출
    const { selectedPhoto, searchQuery } = location.state || {}

    // 컴포넌트 마운트 시 및 dependencies 변경 시 관광지 데이터 fetch
    useEffect(() => {
        const fetchTouristSpots = async () => {
            try {
                // API로부터 모든 관광지 데이터 fetch
                const response = await fetch(`${API_BASE_URL}/locations/all`)

                if (!response.ok) {
                    throw new Error(`서버 에러: ${response.status} ${response.statusText}`)
                }

                const data = await response.json()
                
                // 전체 관광지 데이터 상태 업데이트
                setSpots(data)
                
                // 전달받은 searchQuery 또는 selectedPhoto에 따라 필터링 적용
                if (searchQuery) {
                    filterSpots(data, searchQuery)
                } else if (selectedPhoto) {
                    filterSpotsByPhoto(data, selectedPhoto)
                } else {
                    setFilteredSpots(data)
                }
            } catch (error) {
                // 에러 발생 시 에러 상태 업데이트
                setError(error.message || '데이터를 가져오는 중 에러가 발생했습니다.')
            } finally {
                // 로딩 완료 후 로딩 상태 업데이트
                setLoading(false)
            }
        }

        fetchTouristSpots()
    }, [searchQuery, selectedPhoto])

    // currentPage 변경 시 로컬 스토리지에 현재 페이지 번호 저장
    useEffect(() => {
        localStorage.setItem('currentPage', currentPage)
    }, [currentPage])

    // 검색어를 기반으로 관광지 데이터 필터링하는 함수
    const filterSpots = (data, query) => {
        const filtered = data.filter(spot =>
            spot.areaClturTrrsrtNm.toLowerCase().includes(query.toLowerCase())
        )
        setFilteredSpots(filtered)
    }

    // 선택한 사진을 기반으로 관광지 데이터 필터링하는 함수
    const filterSpotsByPhoto = (data, photo) => {
        const filtered = data.filter(spot => {
            const imageDataBase64 = `data:image/png;base64,${spot.imageData.trim()}`
            return imageDataBase64 === photo.trim()
        })
        setFilteredSpots(filtered)
    }

    // 검색 바에서 검색 버튼 클릭 시 호출되는 함수
    const handleSearch = () => {
        if (searchText.trim() === '') {
            setFilteredSpots(spots)
        } else {
            const filtered = spots.filter(spot =>
                spot.areaClturTrrsrtNm.toLowerCase().includes(searchText.toLowerCase())
            )
            setFilteredSpots(filtered)
        }
        setCurrentPage(1) // 검색 후 페이지를 첫 페이지로 리셋
    }

    // 지도 보기 버튼 클릭 시 호출되는 함수
    const handleViewMap = (spot) => {
        navigate('/map', { state: { selectedSpot: spot } })
    }

    // 페이지네이션에서 페이지 변경 시 호출되는 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    // 현재 페이지에서 표시할 관광지의 시작 및 끝 인덱스 계산
    const indexOfLastSpot = currentPage * itemsPerPage
    const indexOfFirstSpot = indexOfLastSpot - itemsPerPage
    const currentSpots = filteredSpots.slice(indexOfFirstSpot, indexOfLastSpot)

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(filteredSpots.length / itemsPerPage)

    // 로딩 중일 때 표시할 컴포넌트
    if (loading) {
        return <div className="text-center text-xl py-10">로딩 중...</div>
    }

    // 에러 발생 시 표시할 컴포넌트
    if (error) {
        return <div className="text-center text-red-500 text-xl py-10">오류: {error}</div>
    }

    // 실제 렌더링되는 컴포넌트 반환
    return (
        <div className="container max-w-screen-lg mx-auto px-4 py-12">
            {/* 페이지 제목 */}
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">관광지 정보</h1>
            
            {/* 검색 바 컴포넌트 */}
            <SearchBar
                searchText={searchText}
                onSearchTextChange={setSearchText}
                onSearch={handleSearch}
            />
            
            {/* 관광지 카드 리스트 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentSpots.length > 0 ? (
                    currentSpots.map((spot) => {
                        // 해당 관광지 카드의 확장 상태 확인
                        const isExpanded = expandedSpots[spot.dataNo] || false
                        
                        // 이미지 데이터 변환
                        const imageSrc = `data:image/png;base64,${spot.imageData}`

                        return (
                            <TouristSpotCard
                                key={spot.dataNo}
                                spot={{ ...spot, imageUrl: imageSrc }}
                                isExpanded={isExpanded}
                                onToggleExpand={() =>
                                    setExpandedSpots(prev => ({
                                        ...prev,
                                        [spot.dataNo]: !isExpanded
                                    }))
                                }
                                onViewMap={handleViewMap}
                            />
                        )
                    })
                ) : (
                    // 검색 결과가 없을 때 표시할 메시지
                    <div className="text-center text-gray-500">검색 결과가 없습니다.</div>
                )}
            </div>
            
            {/* 페이지네이션 컴포넌트 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}
