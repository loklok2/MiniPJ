import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../utils/SearchBar';
import Pagination from '../utils/Pagination';
import TouristSpotCard from '../touristComponents/TouristSpotCard';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export default function TouristSpots() {
    const [spots, setSpots] = useState([]);
    const [filteredSpots, setFilteredSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedSpots, setExpandedSpots] = useState({});
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem('currentPage')) || 1);
    const itemsPerPage = 6;

    const location = useLocation();
    const navigate = useNavigate();
    const { selectedPhoto, searchQuery } = location.state || {};

    useEffect(() => {
        const fetchTouristSpots = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/locations/all`);
                const data = await response.json();
                setSpots(data);
                
                // 데이터 로드 후 상태 업데이트
                if (searchQuery) {
                    filterSpots(data, searchQuery);
                } else if (selectedPhoto) {
                    filterSpotsByPhoto(data, selectedPhoto);
                } else {
                    setFilteredSpots(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);  // 로딩 상태 업데이트
            }
        };
    
        fetchTouristSpots();
    }, [searchQuery, selectedPhoto]);

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    const filterSpots = (data, query) => {
        const filtered = data.filter(spot =>
            spot.areaClturTrrsrtNm.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSpots(filtered);
    };
    
    const filterSpotsByPhoto = (data, photo) => {
        const filtered = data.filter(spot => {
            const imageDataBase64 = `data:image/png;base64,${spot.imageData.trim()}`;
            return imageDataBase64 === photo.trim();
        });
        setFilteredSpots(filtered);
    };

    const handleSearch = () => {
        const filtered = spots.filter(spot =>
            spot.areaClturTrrsrtNm.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredSpots(filtered);
        setCurrentPage(1);
    };

    const handleViewMap = (spot) => {
        navigate('/map', { state: { selectedSpot: spot } });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastSpot = currentPage * itemsPerPage;
    const indexOfFirstSpot = indexOfLastSpot - itemsPerPage;
    const currentSpots = filteredSpots.slice(indexOfFirstSpot, indexOfLastSpot);
    const totalPages = Math.ceil(filteredSpots.length / itemsPerPage);

    if (loading) {
        return <div className="text-center text-xl py-10">로딩 중...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 text-xl py-10">오류: {error}</div>;
    }

    return (
        <div className="container max-w-screen-lg mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">관광지 정보</h1>
            <SearchBar
                searchText={searchText}
                onSearchTextChange={setSearchText}
                onSearch={handleSearch}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentSpots.length > 0 ? (
                    currentSpots.map((spot) => {
                        const isExpanded = expandedSpots[spot.dataNo] || false;
                        const imageSrc = `data:image/png;base64,${spot.imageData}`;

                        return (
                            <TouristSpotCard
                                key={spot.dataNo}
                                spot={{ ...spot, imageUrl: imageSrc }}
                                isExpanded={isExpanded}
                                onToggleExpand={() => setExpandedSpots(prev => ({ ...prev, [spot.dataNo]: !isExpanded }))}
                                onViewMap={handleViewMap}
                            />
                        );
                    })
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
