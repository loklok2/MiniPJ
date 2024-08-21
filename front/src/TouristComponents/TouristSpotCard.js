import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TouristSpotCard({ spot, isExpanded, onToggleExpand, onViewMap }) {
    const navigate = useNavigate();

    // 스토리 요약을 40자까지만 보여주고, 그 이상일 경우 ...으로 표시
    const truncatedInfo = spot.trrsrtStrySumryCn.length > 40
        ? `${spot.trrsrtStrySumryCn.substring(0, 40)}...`
        : spot.trrsrtStrySumryCn;

    useEffect(() => {
        console.log('TouristSpotCard 렌더링:', spot);
    }, [spot]);

    const handleViewMap = () => {
        console.log('지도에서 보기 클릭:', spot.areaClturTrrsrtNm);
        onViewMap(spot);
        navigate('/map', { state: { selectedSpot: spot } });
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
            <img
                src={`data:image/png;base64,${spot.imageData}`}  // Base64 인코딩된 이미지 데이터 사용
                alt={spot.areaClturTrrsrtNm}
                className="w-full h-48 object-cover"
            />
            <div className="p-6 flex flex-col h-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 leading-tight">
                    {spot.areaClturTrrsrtNm}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                    {isExpanded ? spot.trrsrtStrySumryCn : truncatedInfo}
                </p>
                {spot.trrsrtStrySumryCn.length > 40 && (
                    <button
                        onClick={onToggleExpand}
                        className="mb-4 text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                        {isExpanded ? '접기' : '더보기'}
                    </button>
                )}
                <p className="text-blue-500 hover:underline mb-4">
                    <a href={spot.trrsrtStryUrl} target="_blank" rel="noopener noreferrer">
                        자세히 보기
                    </a>
                </p>
                <p className="p-2 text-sm rounded-lg shadow-sm text-gray-600 bg-gray-100 leading-relaxed mb-4">
                    {spot.addr}
                </p>
                <button
                    onClick={handleViewMap}
                    className="mt-auto py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                    지도에서 보기
                </button>
            </div>
        </div>
    );
}
