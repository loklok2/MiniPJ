import { useEffect, useState } from 'react';
import busMarker from '../images/bus_marker.png';
import subwayMarker from '../images/subway_marker.png';
import trainMarker from '../images/train_marker.png';
import defaultMarker from '../images/default_marker.png';
import ReviewBoard from './ReviewBoard';
import TransportInfo from './TransportInfo';

const NAVER_MAPS_CLIENT_ID = '9yspoa5cox';

export default function Map() {
    // 지도 로드 상태, 위치 데이터, 교통 데이터, 선택된 위치 등의 상태를 관리
    const [mapLoaded, setMapLoaded] = useState(false);
    const [locations, setLocations] = useState([]);
    const [transDatas, setTransDatas] = useState([]);
    const [transPorts, setTransPorts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [transMarkers, setTransMarkers] = useState([]);

    // 네이버 지도 API 로드를 위한 스크립트를 동적으로 추가하는 함수
    useEffect(() => {
        const loadNaverMapsApi = () => {
            if (window.naver) {
                // 네이버 지도 API가 이미 로드된 경우 바로 상태를 업데이트
                setMapLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAPS_CLIENT_ID}`;
            // 스크립트 로드 후 mapLoaded 상태를 true로 설정
            script.onload = () => setMapLoaded(true);
            script.onerror = () => {
                setError('네이버 지도 API 로드 실패');
                console.error('Naver Maps API 로드 실패');
            };

            // 스크립트를 문서의 head에 추가
            document.head.appendChild(script);
        };

        loadNaverMapsApi();
    }, []);

    // 지도 API가 로드된 후 관광지와 교통 데이터를 가져오는 함수
    useEffect(() => {
        if (!mapLoaded) return;

        const fetchData = async () => {
            try {
                // 비동기로 여러 API 요청을 동시에 실행
                const [locationResponse, transDataResponse, transPortResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/locations/all'),
                    fetch('http://localhost:8080/api/tourtrans/all'),
                    fetch('http://localhost:8080/api/transport/all')
                ]);

                // 각 API 응답에 대한 에러 처리
                if (!locationResponse.ok) throw new Error('위치 데이터를 가져오는 데 실패했습니다.');
                if (!transDataResponse.ok) throw new Error('교통 데이터를 가져오는 데 실패했습니다.');
                if (!transPortResponse.ok) throw new Error('교통 데이터를 가져오는 데 실패했습니다.');

                // API에서 가져온 데이터를 JSON 형식으로 변환하여 상태 업데이트
                const locationData = await locationResponse.json();
                const transData = await transDataResponse.json();
                const transPortData = await transPortResponse.json();

                setLocations(locationData);
                setTransDatas(transData);
                setTransPorts(transPortData);
            } catch (error) {
                setError('데이터를 가져오는 중 오류가 발생했습니다.');
                console.error('데이터 가져오기 실패:', error);
            }
        };

        fetchData();
    }, [mapLoaded]);

    // 관광지와 대중교통 마커를 지도에 표시하는 함수
    useEffect(() => {
        if (!mapLoaded || locations.length === 0) return;

        // 네이버 지도 초기화
        const map = new window.naver.maps.Map('map', {
            center: new window.naver.maps.LatLng(35.1796, 129.0756),
            zoom: 11 // 초기 확대 수준 설정
        });

        // 관광지 마커 설정
        locations.map((location) => {
            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo),
                map: map,
                title: location.areaClturTrrsrtNm
            });

            // 마커 클릭 이벤트 리스너 추가
            marker.addListener('click', () => {
                // 클릭한 위치를 선택된 위치로 설정
                setSelectedLocation(location);

                // 기존 대중교통 마커 제거
                // transMarkers.forEach(marker => marker.setMap(null));

                // 새로운 대중교통 마커 설정
                const relatedTransData = transDatas.filter(transData => transData.keyId === location.keyId);
                const newTransMarkers = relatedTransData.map((data) => {
                    // getIconUrl 함수에 transData.value와 transPorts를 전달합니다.
                    const iconUrl = getIconUrl(data.value, transPorts);

                    // 대중교통 마커 생성
                    const transMarker = new window.naver.maps.Marker({
                        position: new window.naver.maps.LatLng(data.fcltyLa, data.fcltyLo),
                        map: map,
                        title: data.pbtrnspFcltyNm,
                        icon: {
                            url: iconUrl,
                            scaledSize: new window.naver.maps.Size(20, 20)
                        }
                    });
                    return transMarker;
                });

                // 새로운 대중교통 마커 상태로 업데이트
                // setTransMarkers(newTransMarkers);

                // 지도 확대 및 중심 이동 - 클릭한 위치와 관련된 마커들만 보이도록 설정
                const bounds = new window.naver.maps.LatLngBounds();
                bounds.extend(new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo));
                newTransMarkers.forEach(marker => bounds.extend(marker.getPosition()));

                // 확대 크기 및 중심 이동
                map.fitBounds(bounds); // 선택한 위치 및 관련된 마커들이 보이도록 확대
            });

            return marker;
        });

        // 지도의 빈 공간 클릭 시 초기화
        window.naver.maps.Event.addListener(map, 'click', () => {
            // 대중교통 마커는 숨기기
            transMarkers.forEach(marker => marker.setMap(null));

            setTransMarkers([]); // 대중교통 마커 상태 초기화
            setSelectedLocation(null); // 선택된 위치 초기화
        });

    }, [mapLoaded, locations, transDatas, transPorts, transMarkers]);

    useEffect(() => {
        console.log("selectedLocation", selectedLocation);
    }, [selectedLocation])


    // 교통 수단의 타입에 따라 아이콘 URL을 반환하는 함수
    const getIconUrl = (transDataValue, transPortData) => {
        // `transPortData` 배열에서 `value`가 `transDataValue`와 일치하는 항목을 찾습니다.
        const matchedTransPort = transPortData.find(port => port.value === transDataValue);

        if (matchedTransPort) {
            // 타입에 따라 적절한 아이콘 URL을 반환합니다.
            switch (matchedTransPort.type) {
                case 'b':
                    return busMarker;
                case 's1':
                    return subwayMarker;
                case 's5':
                    return trainMarker;
                default:
                    return defaultMarker;
            }
        } else {
            // 일치하는 항목이 없을 경우 기본 아이콘을 반환합니다.
            return defaultMarker;
        }
    }

    return (
        <div className='w-full h-full bg-slate-100 flex'>
            <div className='w-1/4 h-full bg-white p-4'>
                {selectedLocation ? (
                    <>
                        <TransportInfo selectedLocation={selectedLocation} />
                        <ReviewBoard locationId={selectedLocation.keyId} />
                    </>
                ) : (
                    <p>마커를 클릭하여 위치 정보를 확인하세요.</p>
                )}
            </div>
            <div id="map" style={{ width: '70%', height: '500px' }} className='w-3/4 h-full'></div>
            {error && <p className='text-red-500'>{error}</p>}
        </div>
    );
}
