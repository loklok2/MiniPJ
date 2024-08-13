export default function TransportInfo({ selectedLocation }) {
    if (!selectedLocation || !selectedLocation.areaClturTrrsrtNm) {
        return <p>선택된 위치 정보가 없습니다.</p>;
    }

    return (
        <div>
            <h2>위치 정보</h2>
            <p>위치명: {selectedLocation.areaClturTrrsrtNm}</p>
            <p>위도: {selectedLocation.trrsrtLa}</p>
            <p>경도: {selectedLocation.trrsrtLo}</p>
        </div>
    );
}