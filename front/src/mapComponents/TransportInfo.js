import { useState } from 'react';

export default function TransportInfo({ selectedLocation }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!selectedLocation || !selectedLocation.areaClturTrrsrtNm) {
        return <p className="text-gray-500">선택된 위치 정보가 없습니다.</p>;
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const truncatedInfo = selectedLocation.trrsrtStrySumryCn.substring(0, 40) + (selectedLocation.trrsrtStrySumryCn.length > 40 ? '...' : '');

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">관광지명: {selectedLocation.areaClturTrrsrtNm}</h2>
            <p className={`text-sm ${isExpanded ? 'max-h-full' : 'max-h-10'} overflow-hidden`}>
                관광지정보: {isExpanded ? selectedLocation.trrsrtStrySumryCn : truncatedInfo}
            </p>
            {selectedLocation.trrsrtStrySumryCn.length > 40 && (
                <button
                    onClick={toggleExpand}
                    className="mt-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                    {isExpanded ? '접기' : '더보기'}
                </button>
            )}
        </div>
    );
}
