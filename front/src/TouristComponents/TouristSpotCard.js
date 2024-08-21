import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TouristSpotCard({ spot, isExpanded, onToggleExpand, onViewMap }) {
    const navigate = useNavigate() // 페이지 이동을 위한 React Router의 내비게이션 훅

    // 스토리 요약을 40자까지만 보여주고, 그 이상일 경우 '...'으로 표시
    const truncatedInfo = spot.trrsrtStrySumryCn.length > 40
        ? `${spot.trrsrtStrySumryCn.substring(0, 40)}...`
        : spot.trrsrtStrySumryCn

    // 컴포넌트가 렌더링될 때마다 관광지 데이터를 콘솔에 출력 (디버깅 용도)
    useEffect(() => {
        console.log('TouristSpotCard 렌더링:', spot)
    }, [spot])

    // 지도 보기 버튼 클릭 시 호출되는 함수
    const handleViewMap = () => {
        console.log('지도에서 보기 클릭:', spot.areaClturTrrsrtNm) // 클릭된 관광지 이름을 콘솔에 출력
        onViewMap(spot) // 부모 컴포넌트에서 전달받은 onViewMap 콜백 함수 호출
        navigate('/map', { state: { selectedSpot: spot } }) // 지도 페이지로 이동하며 선택된 관광지 데이터를 전달
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
            <img
                src={`data:image/png;base64,${spot.imageData}`}  // Base64 인코딩된 이미지 데이터 사용
                alt={spot.areaClturTrrsrtNm} // 이미지의 대체 텍스트로 관광지 이름 사용
                className="w-full h-48 object-cover"
            />
            <div className="p-6 flex flex-col h-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 leading-tight">
                    {spot.areaClturTrrsrtNm} {/* 관광지 이름을 제목으로 표시 */}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                    {isExpanded ? spot.trrsrtStrySumryCn : truncatedInfo} {/* 확장 상태에 따라 스토리 전체 또는 요약본을 표시 */}
                </p>
                {spot.trrsrtStrySumryCn.length > 40 && (
                    <button
                        onClick={onToggleExpand} // 더보기/접기 버튼 클릭 시 호출
                        className="mb-4 text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                        {isExpanded ? '접기' : '더보기'} {/* 확장 상태에 따라 버튼 텍스트 변경 */}
                    </button>
                )}
                <p className="text-blue-500 hover:underline mb-4">
                    <a href={spot.trrsrtStryUrl} target="_blank" rel="noopener noreferrer">
                        자세히 보기 {/* 관광지 상세 정보 URL로 연결 */}
                    </a>
                </p>
                <p className="p-2 text-sm rounded-lg shadow-sm text-gray-600 bg-gray-100 leading-relaxed mb-4">
                    {spot.addr} {/* 관광지 주소 표시 */}
                </p>
                <button
                    onClick={handleViewMap} // 지도에서 보기 버튼 클릭 시 지도 페이지로 이동
                    className="mt-auto py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                    지도에서 보기 {/* 버튼 텍스트 */}
                </button>
            </div>
        </div>
    )
}
