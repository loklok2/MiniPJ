export default function TransportInfo({ selectedLocation }) {
    // 선택된 위치 정보가 없거나 해당 위치에 'areaClturTrrsrtNm' 속성이 없을 경우 기본 메시지를 반환
    if (!selectedLocation || !selectedLocation.areaClturTrrsrtNm) {
        return (
            <p className="text-gray-500 text-xl">
                선택된 위치 정보가 없습니다.
            </p>
        ) // 기본 메시지의 텍스트 크기를 크게 설정
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl h-full overflow-auto">
            {/* p-6: 내부 여백을 1.5rem 설정
                bg-white: 배경색을 흰색으로 설정
                rounded-lg: 요소의 모서리를 둥글게 설정
                shadow-lg: 큰 그림자를 추가하여 요소가 떠 있는 느낌을 줌
                transition-shadow: 그림자 변화에 애니메이션을 추가
                duration-300: 애니메이션 지속 시간을 0.3초로 설정
                ease-in-out: 애니메이션의 속도 곡선을 설정
                hover:shadow-xl: 마우스를 올렸을 때 그림자를 더 크게 설정
                h-full: 높이를 부모 요소의 전체 높이로 설정
                overflow-auto: 내용이 넘칠 경우 스크롤 가능하도록 설정 */}

            {/* 관광지 이름 및 설명을 표시하는 섹션 */}
            <div className="bg-blue-50 p-6 rounded-lg mb-6 shadow-sm">
                {/* bg-blue-50: 연한 파란색 배경 설정
                    p-6: 내부 여백을 1.5rem 설정
                    rounded-lg: 모서리를 둥글게 설정
                    mb-6: 아래쪽 외부 여백을 1.5rem 설정
                    shadow-sm: 작은 그림자를 추가하여 요소가 떠 있는 느낌을 줌 */}

                {/* 관광지 이름을 크게 표시 */}
                <h3 className="text-3xl text-blue-700 font-bold mb-4 sm:text-2xl">
                    {selectedLocation.areaClturTrrsrtNm}
                </h3>
                {/* text-3xl: 텍스트 크기를 크게 설정 (약 1.875rem)
                    text-blue-700: 텍스트 색상을 진한 파란색으로 설정
                    font-bold: 텍스트를 굵게 표시
                    mb-4: 아래쪽 외부 여백을 1rem 설정
                    sm:text-2xl: 작은 화면에서는 텍스트 크기를 약 1.5rem로 줄임 */}

                {/* 관광지 설명을 적당한 크기로 표시 */}
                <p className="text-gray-800 text-lg leading-relaxed sm:text-base">
                    {selectedLocation.trrsrtStryNm}
                </p>
                {/* text-gray-800: 텍스트 색상을 어두운 회색으로 설정
                    text-lg: 텍스트 크기를 약 1.125rem로 설정
                    leading-relaxed: 줄 간격을 넓게 설정하여 가독성을 높임
                    sm:text-base: 작은 화면에서는 텍스트 크기를 약 1rem로 줄임 */}
            </div>

            {/* 해시태그 스타일로 관광지의 핵심 키워드를 표시하는 섹션 */}
            <div className="mb-6">
                <h4 className="inline-block bg-blue-100 text-blue-600 font-semibold text-lg py-2 px-4 rounded-full shadow-sm sm:text-base">
                    # {selectedLocation.coreKwrdCn}
                </h4>
                {/* inline-block: 요소를 인라인 블록으로 설정하여 필요한 만큼의 너비를 차지하도록 함
                    bg-blue-100: 배경색을 연한 파란색으로 설정
                    text-blue-600: 텍스트 색상을 파란색으로 설정
                    font-semibold: 텍스트를 조금 더 굵게 표시
                    text-lg: 텍스트 크기를 약 1.125rem로 설정
                    py-2: 위아래 여백을 0.5rem 설정
                    px-4: 좌우 여백을 1rem 설정
                    rounded-full: 모서리를 둥글게 설정하여 해시태그 스타일로 만듦
                    shadow-sm: 작은 그림자를 추가하여 요소가 떠 있는 느낌을 줌
                    sm:text-base: 작은 화면에서는 텍스트 크기를 약 1rem로 줄임 */}
            </div>

            {/* 관광지 주소 정보를 표시하는 섹션 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
                {/* bg-gray-50: 배경색을 밝은 회색으로 설정
                    p-6: 내부 여백을 1.5rem 설정
                    rounded-lg: 모서리를 둥글게 설정
                    shadow-sm: 작은 그림자를 추가하여 요소가 떠 있는 느낌을 줌
                    mb-6: 아래쪽 외부 여백을 1.5rem 설정 */}

                {/* 주소 제목을 크게 표시 */}
                <h5 className="text-2xl text-gray-800 font-semibold mb-3 sm:text-xl">
                    주소
                </h5>
                {/* text-2xl: 텍스트 크기를 크게 설정 (약 1.5rem)
                    text-gray-800: 텍스트 색상을 어두운 회색으로 설정
                    font-semibold: 텍스트를 굵게 표시
                    mb-3: 아래쪽 외부 여백을 0.75rem 설정
                    sm:text-xl: 작은 화면에서는 텍스트 크기를 약 1.25rem로 줄임 */}

                {/* 주소 내용을 적당한 크기로 표시 */}
                <p className="text-gray-700 leading-relaxed text-lg sm:text-base">
                    {selectedLocation.addr}
                </p>
                {/* text-gray-700: 텍스트 색상을 어두운 회색으로 설정
                    leading-relaxed: 줄 간격을 넓게 설정하여 가독성을 높임
                    text-lg: 텍스트 크기를 약 1.125rem로 설정
                    sm:text-base: 작은 화면에서는 텍스트 크기를 약 1rem로 줄임 */}
            </div>
        </div>
    )
}
