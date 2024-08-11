import { useEffect, useState } from 'react';

export default function Map() {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);  // 모달에 표시할 위치 정보
    const [showMore, setShowMore] = useState(false);    // 설명 전체 보기 상태
    const [infoWindowExpanded, setInfoWindowExpanded] = useState(null); // InfoWindow의 전체 보기 상태

    useEffect(() => {
        const loadNaverMapsApi = () => {
            if (window.naver) {
                setMapLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=9yspoa5cox'; // 실제 Naver 클라이언트 ID
            script.onload = () => setMapLoaded(true);
            script.onerror = () => {
                setError('네이버 지도 API 로드 실패')
                console.error('Naver Maps API 로드 실패')
            }

            document.head.appendChild(script);
        }

        loadNaverMapsApi();
    }, [])

    useEffect(() => {
        if (!mapLoaded || !window.naver) return;

        const fetchLocationData = async () => {
            try {
                // const timestamp = new Date().getTime(); // 캐시를 방지하기 위한 타임스탬프
                const response = await fetch(`http://localhost:8080/api/locations/all`);
                if (!response.ok) {
                    throw new Error('위치 데이터를 가져오는 데 실패했습니다.');
                }
                const data = await response.json();
                setLocations(data);
            } catch (error) {
                setError('위치 데이터를 가져오는 중 오류가 발생했습니다.');
                console.error('위치 데이터 가져오기 실패:', error);
            }
        }

        fetchLocationData();
    }, [mapLoaded])

    useEffect(() => {
        if (!mapLoaded || !window.naver || locations.length === 0) return;

        const initializeMap = () => {
            var map = new window.naver.maps.Map('map', {
                center: new window.naver.maps.LatLng(35.1796, 129.0756), // 부산의 좌표로 설정
                zoom: 11
            })

            locations.forEach(location => {
                const marker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo),
                    map: map,
                    title: location.areaClturTrrsrtNm // 마커에 제목 설정
                })

                // 정보표시창
                const infoWindow = new window.naver.maps.InfoWindow({
                    content: `
                        <div style="padding: 10px; font-size: 14px;">
                            <strong>${location.areaClturTrrsrtNm}</strong><br>
                            위도: ${location.trrsrtLa}<br>
                            경도: ${location.trrsrtLo}<br>
                        </div>
                    `,
                })

                // 마커에 클릭 이벤트 추가
                window.naver.maps.Event.addListener(marker, 'click', () => {
                    // alert(`You clicked on: ${location.areaClturTrrsrtNm}`);
                    // 여기서 추가적인 동작(예: 모달 띄우기, 정보창 표시 등)을 수행.

                    // InfoWindow 표시
                    infoWindow.open(map, marker);

                    // 모달 창에 표시할 위치 정보 설정
                    setSelectedLocation(location);
                    setInfoWindowExpanded(null);
                })

            })
        }

        initializeMap();
    }, [mapLoaded, locations])

    // 설명 전체 보기 토글 함수
    const handleShowMoreToggle = () => {
        setShowMore(!showMore);
    }

    return (
        <div className='w-full h-full bg-slate-100 flex justify-center items-center'>
            <div id="map" style={{ width: '70%', height: '300px' }}></div>
            {error && <p className='text-red-500'>{error}</p>}

            {/* 모달 창 */}
            {selectedLocation && (
                <div className='fixed inset-0 z-50 bg-black bg-opacity-50 
                                flex items-center justify-center'>
                    <div className='p-5 w-1/2 bg-white rounded-lg'>
                        <h2 className='mb-4 text-xl font-bold'>{selectedLocation.areaClturTrrsrtNm}</h2>
                        <p>위도: {selectedLocation.trrsrtLa}</p>
                        <p>경도: {selectedLocation.trrsrtLo}</p>
                        <p>
                            설명: {showMore ? selectedLocation.trrsrtStrySumryCn : selectedLocation.trrsrtStrySumryCn?.slice(0, 100)}
                            {selectedLocation.trrsrtStrySumryCn && selectedLocation.trrsrtStrySumryCn.length > 100 && (
                                <button className='ml-2 text-blue-500'
                                    onClick={handleShowMoreToggle}>
                                    {showMore ? '간단히 보기' : '더보기'}
                                </button>
                            )}
                        </p>
                        <button className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
                            onClick={() => setSelectedLocation(null)}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
