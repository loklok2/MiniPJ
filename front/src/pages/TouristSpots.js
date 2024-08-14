import { useState, useEffect } from "react"

export default function TouristSpots() {
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedSpots, setExpandedSpots] = useState({});

    // 페이징을 위한 상태 관리
    const [currentPage, setCurrentPage] = useState(
        parseInt(localStorage.getItem('currentPage')) || 1
    );
    const itemsPerPage = 6;     // 한 페이지에 표시할 항목 수
    const maxPageNumbers = 3;   // 최대 페이지 번호 버튼 수

    // 관광지 데이터를 가져오는 API 요청
    const fetchTouristSpots = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/locations/all');

            if (!response.ok) {
                throw new Error('데이터를 가져오는데 실패했습니다.');
            }

            const data = await response.json();
            setSpots(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTouristSpots();
    }, [])

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage])

    // 페이지 이동 처리 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    // 현재 페이지에 표시할 데이터 계산
    const indexOfLastPage = currentPage * itemsPerPage;
    const indexOfFirstPage = indexOfLastPage - itemsPerPage;
    const currentPages = spots.slice(indexOfFirstPage, indexOfLastPage);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(spots.length / itemsPerPage);

    // 페이지 범위 계산
    const getPageNumbers = () => {
        const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
        const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);
        return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    }

    // 관광지 정보 확장/축소 토글 함수
    const toggleExpand = (spotId) => {
        setExpandedSpots((prev) => ({
            ...prev,
            [spotId]: !prev[spotId]
        }));
    }

    // 로딩 상태 처리
    if (loading) {
        return <div className="text-center text-xl py-10">로딩 중...</div>;
    }

    // 오류 처리
    if (error) {
        return <div className="text-center text-red-500 text-xl py-10">오류: {error}</div>;
    }

    // 관광지 목록 렌더링
    return (
        <div className="container max-w-screen-lg mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-12">관광지 정보</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {currentPages.length > 0 ? (
                    currentPages.map((spot) => {
                        const isExpanded = expandedSpots[spot.dataNo] || false;
                        const truncatedInfo = spot.trrsrtStrySumryCn.length > 40
                            ? `${spot.trrsrtStrySumryCn.substring(0, 40)}...`
                            : spot.trrsrtStrySumryCn;

                        return (
                            <div key={spot.dataNo}
                                className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <img
                                    src="https://lh3.googleusercontent.com/proxy/pkYo-dY6Nwt6Z_1RBkqmB42AFIv_3KBUB7zlfdj89aTSv70_R9bLvOg4BUaXy_fsPi1dFED-Ux5nltU-bIXo_w"
                                    alt={spot.areaClturTrrsrtNm}
                                    className="w-full h-48 object-cover sm:h-64"
                                />
                                <div className="p-4 md:p-6">
                                    <h2 className="text-2xl font-semibold mb-4">{spot.areaClturTrrsrtNm}</h2>
                                    <p className="text-gray-500 mb-2">
                                        {isExpanded ? spot.trrsrtStrySumryCn : truncatedInfo}
                                    </p>
                                    {spot.trrsrtStrySumryCn.length > 40 && (
                                        <button
                                            onClick={() => toggleExpand(spot.dataNo)}
                                            className="mb-4 text-blue-500 hover:text-blue-700 focus:outline-none"
                                        >
                                            {isExpanded ? '접기' : '더보기'}
                                        </button>
                                    )}
                                    <p className="mt-4 text-blue-500 hover:underline">
                                        <a href={spot.trrsrtStryUrl} target="_blank" rel="noopener noreferrer">
                                            자세히 보기
                                        </a>
                                    </p>
                                    <p className="mt-6 p-2 text-sm rounded-lg shadow-sm text-gray-600 bg-gray-100">
                                        {spot.addr}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center text-gray-500">관광지가 없습니다.</div>
                )}
            </div>

            {/* 페이지 네비게이션 */}
            <div className="flex justify-center mt-8 space-x-2">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-300 text-gray-700"
                >
                    처음
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-300 text-gray-700"
                >
                    &lt;
                </button>
                {getPageNumbers().map((pageNumber) => (
                    <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-1 rounded ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                    >
                        {pageNumber}
                    </button>   
                ))}
                <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-gray-300 text-gray-700"
                >
                    &gt;
                </button>
                <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-gray-300 text-gray-700"
                >
                    마지막
                </button>
            </div>

        </div>
    )
}
