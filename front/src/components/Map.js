import { useEffect, useState, useCallback } from 'react';
import { NaverMap, Marker, InfoWindow, useNavermaps, useMap } from 'react-naver-maps';

// 네이버 지도 API 키
const NAVER_MAPS_CLIENT_ID = '9yspoa5cox'; // 실제 Naver 클라이언트 ID

export default function Map() {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [locations, setLocations] = useState([]);
    const [transportation, setTransportation] = useState([]);
    const [trans, setTrans] = useState([]);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);  // 모달에 표시할 위치 정보
    const [infoWindowExpanded, setInfoWindowExpanded] = useState({}); // InfoWindow의 전체 보기 상태
    const { map } = useMap();
    const { naver } = useNavermaps();

    useEffect(() => {
        if (naver && !mapLoaded) {
            setMapLoaded(true);
        }
    }, [naver, mapLoaded])

    // 네이버 지도 API 로드
    useEffect(() => {
        if (window.naver) {
            setMapLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAPS_CLIENT_ID}`;
        script.onload = () => setMapLoaded(true);
        script.onerror = () => {
            setError('네이버 지도 API 로드 실패');
            console.error('Naver Maps API 로드 실패');
        }

        document.head.appendChild(script);
    }, []);

    // 데이터 fetch
    useEffect(() => {
        if (!mapLoaded || !window.naver) return;

        const fetchData = async () => {
            try {
                const [locationResponse, transDataResponse, transPortationResponse] = await Promise.all([
                    fetch(`http://localhost:8080/api/locations/all`),
                    fetch('http://localhost:8080/api/trans/all'),
                    fetch('http://localhost:8080/api/transport/all'),
                ])

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
                setTrans(transData);
                setTransportation(transport);
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

        // 클러스터링 초기화
        const clusterIcons = [
            {
                content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://example.com/img/cluster-marker-1.png);background-size:contain;"></div>',
                size: new window.naver.maps.Size(40, 40),
                anchor: new window.naver.maps.Point(20, 20),
            },
            // 다른 클러스터 아이콘 추가 가능
        ];

        const markers = [];
        const map = new window.naver.maps.Map('map', {
            center: new window.naver.maps.LatLng(35.1796, 129.0756), // 부산의 좌표로 설정
            zoom: 11
        });

        transport.forEach(loc => {
            // transData 배열에서 해당 transport에 맞는 정류장 정보를 모두 가져오기
            const correspondingTransList = transData.filter(trans => trans.value === loc.value);

            if (correspondingTransList.length > 0) {
                correspondingTransList.forEach(correspondingTrans => {
                    // 위도와 경도를 로그로 확인
                    console.log('correspondingTrans:', correspondingTrans);
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
                                </div>
                            `,
                    });

                    // 마커에 클릭 이벤트 추가
                    window.naver.maps.Event.addListener(marker, 'click', () => {
                        infoWindow.open(map, marker);
                        setSelectedLocation(correspondingTrans);
                        // 정보 창
                        setInfoWindowExpanded(prevState => ({
                            ...prevState,
                            [loc.id]: !prevState[loc.id],
                        }));
                    });
                });
            } else {
                console.warn(`No matching transData found for transport value: ${loc.value}`);
            }
        });


        initializeMap();
    }, [mapLoaded, locations, transData, transport]);

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
                        <button className='mt-4 px-4 py-2 bg-blue-500 text-white rounded' onClick={() => setSelectedLocation(null)}>
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
