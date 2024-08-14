import { useState } from 'react';

export default function TransportInfo({ selectedLocation }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!selectedLocation || !selectedLocation.areaClturTrrsrtNm) {
        return <p className="text-gray-500">선택된 위치 정보가 없습니다.</p>;
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const truncatedInfo = selectedLocation.trrsrtStryNm.substring(0, 40) + (selectedLocation.trrsrtStryNm.length > 40 ? '...' : '');

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                관광지명: <span className="text-blue-600">{selectedLocation.areaClturTrrsrtNm}</span>
            </h2>
            <p className={`text-sm text-gray-700 mb-4 ${isExpanded ? 'max-h-full' : 'max-h-10'} overflow-hidden`}>
                <span className="font-medium">관광지정보: </span>
                {isExpanded ? selectedLocation.trrsrtStryNm : truncatedInfo}
            </p>
            <p className="text-sm text-gray-600">
                <span className="font-medium">주소: </span>
                {selectedLocation.addr}
            </p>
            {selectedLocation.trrsrtStryNm.length > 40 && (
                <button
                    onClick={toggleExpand}
                    className="mt-4 text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300 focus:outline-none"
                >
                    {isExpanded ? '접기' : '더보기'}
                </button>
            )}
        </div>
    );
}
