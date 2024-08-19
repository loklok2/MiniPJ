import { useEffect } from 'react';

// TouristSpotCard 컴포넌트는 개별 관광지 정보를 카드 형태로 보여줌
// spot: 관광지 정보 객체로, 이름, 이미지 URL, 스토리 요약 등을 포함
// isExpanded: 카드의 확장 상태를 나타내는 불리언 값
// onToggleExpand: 카드의 확장/축소를 전환하는 함수
// onViewMap: '지도에서 보기' 버튼 클릭 시 호출되는 함수

export default function TouristSpotCard({ spot, isExpanded, onToggleExpand, onViewMap }) {
    // 관광지 스토리 요약을 40자까지만 보여주고, 그 이상일 경우 ...으로 표시
    const truncatedInfo = spot.trrsrtStrySumryCn.length > 40
        ? `${spot.trrsrtStrySumryCn.substring(0, 40)}...`
        : spot.trrsrtStrySumryCn

    // 서버에서 제공하는 이미지 URL 생성
    const imageSrc = `http://localhost:8080/api/locations/image/${spot.dataNo}`;

    useEffect(() => {
        console.log('TouristSpotCard 렌더링:', spot);
        console.log('이미지 URL:', imageSrc);
    }, [spot, imageSrc]);

    const handleToggleExpand = () => {
        console.log('스토리 확장/축소 전환:', spot.areaClturTrrsrtNm, 'isExpanded:', !isExpanded);
        onToggleExpand();
    };

    const handleViewMap = () => {
        console.log('지도에서 보기 클릭:', spot.areaClturTrrsrtNm);
        onViewMap();
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
            {/* 관광지 이미지 */}
            <img
                src={imageSrc}  // 인코딩된 이미지 데이터 사용
                alt={spot.areaClturTrrsrtNm}  // 이미지의 대체 텍스트로 관광지 이름을 설정
                className="w-full h-48 object-cover"
            />
            <div className="p-6 flex flex-col h-full">
                {/* 관광지 이름 */}
                <h2 className="text-xl font-semibold text-gray-800 mb-3 leading-tight">
                    {spot.areaClturTrrsrtNm}
                </h2>
                {/* 관광지 스토리 요약 */}
                <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                    {isExpanded ? spot.trrsrtStrySumryCn : truncatedInfo}
                </p>
                {/* 스토리 확장/축소 버튼 (스토리가 40자 이상일 때만 표시) */}
                {spot.trrsrtStrySumryCn.length > 40 && (
                    <button
                        onClick={onToggleExpand}  // 클릭 시 확장/축소 전환
                        className="mb-4 text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                        {isExpanded ? '접기' : '더보기'}
                    </button>
                )}
                {/* '자세히 보기' 링크 */}
                <p className="text-blue-500 hover:underline mb-4">
                    <a href={spot.trrsrtStryUrl} target="_blank" rel="noopener noreferrer">
                        자세히 보기
                    </a>
                </p>
                {/* 관광지 주소 */}
                <p className="p-2 text-sm rounded-lg shadow-sm text-gray-600 bg-gray-100 leading-relaxed mb-4">
                    {spot.addr}
                </p>
                {/* '지도에서 보기' 버튼 */}
                <button
                    onClick={onViewMap}  // 클릭 시 onViewMap 함수 호출
                    className="mt-auto py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                    지도에서 보기
                </button>
            </div>
        </div>
    )
}
