import { useEffect, useState } from 'react';

export default function Map() {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [locations, setLocations] = useState([]);
    const [transport, setTransport] = useState([]);
    const [transData, setTransData] = useState([]);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);  // 모달에 표시할 위치 정보
    const [showMore, setShowMore] = useState(false);    // 설명 전체 보기 상태
    const [infoWindowExpanded, setInfoWindowExpanded] = useState({}); // InfoWindow의 전체 보기 상태

    // 네이버 지도 API 로드
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
                setError('네이버 지도 API 로드 실패');
                console.error('Naver Maps API 로드 실패');
            }

            document.head.appendChild(script);
        }

        loadNaverMapsApi();
    }, []);

    // 데이터 fetch
    useEffect(() => {
        if (!mapLoaded || !window.naver) return;

        const fetchData = async () => {
            try {
                // const timestamp = new Date().getTime(); // 캐시를 방지하기 위한 타임스탬프
                const locationResponse = await fetch(`http://localhost:8080/api/locations/all`);
                const transDataResponse = await fetch('http://localhost:8080/api/trans/all');
                const transPortationResponse = await fetch('http://localhost:8080/api/transport/all');

                if (!locationResponse.ok || !transDataResponse.ok || !transPortationResponse.ok) {
                    throw new Error('데이터를 가져오는 데 실패했습니다.');
                }

                const locationData = await locationResponse.json();
                const transData = await transDataResponse.json();
                const transport = await transPortationResponse.json();

                // 여기서 데이터를 확인
                console.log('locationData:', locationData);
                console.log('transData:', transData);
                console.log('transport:', transport);

                setLocations(locationData);
                setTransData(transData);
                setTransport(transport);
            } catch (error) {
                setError('데이터를 가져오는 중 오류가 발생했습니다.');
                console.error('데이터 가져오기 실패:', error);
            }
        }

        fetchData();
    }, [mapLoaded]);

    // 지도 초기화 및 마커 추가
    useEffect(() => {
        if (!mapLoaded || !window.naver || locations.length === 0 || transData.length === 0) return;

        const initializeMap = () => {
            const map = new window.naver.maps.Map('map', {
                center: new window.naver.maps.LatLng(35.1796, 129.0756), // 부산의 좌표로 설정
                zoom: 11
            });

            transport.forEach(loc => {
                // transData 배열에서 해당 transport에 맞는 정류장 정보 찾기
                const correspondingTrans = transData.find(trans => trans.value === loc.value);

                if (correspondingTrans) {
                    // 위도와 경도를 로그로 확인
                    console.log('correspondingLocation:', correspondingTrans);
                    console.log('위도:', correspondingTrans.fcltyLa, '경도:', correspondingTrans.fcltyLo);

                    const marker = new window.naver.maps.Marker({
                        position: new window.naver.maps.LatLng(correspondingTrans.fcltyLa, correspondingTrans.fcltyLo),
                        map: map,
                        title: correspondingTrans.pbtrnspFcltyNm // 마커에 제목 설정
                    });

                    const infoWindow = new window.naver.maps.InfoWindow({
                        content: `
                            <div style="padding: 10px; font-size: 14px;">
                                <strong>정류장명: ${correspondingTrans.pbtrnspFcltyNm}</strong><br><br>
                                주소: ${correspondingTrans.pbtrnspFcltyAddr}<br>
                                설명: ${infoWindowExpanded[loc.id] ? correspondingTrans.pbtrnspFcltyDesc : correspondingTrans.pbtrnspFcltyDesc?.slice(0, 100)}...
                                <button class="ml-2 text-blue-500" onclick="toggleShowMore(${loc.id})">
                                    ${infoWindowExpanded[loc.id] ? '간단히 보기' : '더보기'}
                                </button>
                            </div>
                        `,
                    });

                    // 마커에 클릭 이벤트 추가
                    window.naver.maps.Event.addListener(marker, 'click', () => {
                        // alert(`You clicked on: ${location.areaClturTrrsrtNm}`);
                        // 여기서 추가적인 동작(예: 모달 띄우기, 정보창 표시 등)을 수행.

                        // InfoWindow 표시
                        infoWindow.open(map, marker);
                        setSelectedLocation(correspondingTrans);
                        // 정보 창
                        setInfoWindowExpanded(prevState => ({
                            ...prevState,
                            [loc.id]: !prevState[loc.id],
                        }))
                    })
                }
                else {
                    console.warn(`transport value와 일치하는 transData가 없습니다: ${loc.value}`);
                }
            })
        }

        initializeMap();
    }, [mapLoaded, locations, transData, transport]);

    // 설명 전체 보기 토글 함수
    const handleShowMoreToggle = () => {
        setShowMore(!showMore);
    };

    return (
        <div className='w-full h-full bg-slate-100 flex justify-center items-center'>
            <div id="map" style={{ width: '70%', height: '500px' }}></div>
            {error && <p className='text-red-500'>{error}</p>}

            {/* 모달 창 */}
            {selectedLocation && (
                <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='p-5 w-1/2 bg-white rounded-lg'>
                        <h2 className='mb-4 text-xl font-bold'>정류장명: {selectedLocation.pbtrnspFcltyNm}</h2>
                        <p>위도: {selectedLocation.fcltyLa}</p>
                        <p>경도: {selectedLocation.fcltyLo}</p>
                        <p>주소: {selectedLocation.pbtrnspFcltyAddr}</p>
                        {/* <img src={`${selectedLocation.trrSrtStryUrl}`}
                             alt={selectedLocation.areaClturTrrsrtNm}
                             onError={(e) => e.target.src = '../image/오류이미지.jpg'}
                             className='w-full h-auto mt-4 rounded'
                        /> */}
                        <p>
                            설명: {showMore ? selectedLocation.pbtrnspFcltyDesc : selectedLocation.pbtrnspFcltyDesc?.slice(0, 100)}
                            {selectedLocation.pbtrnspFcltyDesc && selectedLocation.pbtrnspFcltyDesc.length > 100 && (
                                <button className='ml-2 text-blue-500' onClick={handleShowMoreToggle}>
                                    {showMore ? '간단히 보기' : '더보기'}
                                </button>
                            )}
                        </p>
                        <button className='mt-4 px-4 py-2 bg-blue-500 text-white rounded' onClick={() => setSelectedLocation(null)}>
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
