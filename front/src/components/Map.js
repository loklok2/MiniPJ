import { useEffect, useState } from 'react';
import busMarker from '../images/bus_marker.png';
import subwayMarker from '../images/subway_marker.png';
import trainMarker from '../images/train_marker.png';
import defaultMarker from '../images/default_marker.png';
import ReviewBoard from './ReviewBoard';
import TransportInfo from './TransportInfo';

const NAVER_MAPS_CLIENT_ID = '9yspoa5cox';

export default function Map() {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [locations, setLocations] = useState([]);
    const [transDatas, setTransDatas] = useState([]);
    const [transPorts, setTransPorts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [transMarkers, setTransMarkers] = useState([]);
    const [locationMarkers, setLocationMarkers] = useState([]); // 관광지 마커 상태 추가

    useEffect(() => {
        const loadNaverMapsApi = () => {
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
            };

            document.head.appendChild(script);
        };

        loadNaverMapsApi();
    }, []);

    useEffect(() => {
        if (!mapLoaded) return;

        const fetchData = async () => {
            try {
                const [locationResponse, transDataResponse, transPortResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/locations/all'),
                    fetch('http://localhost:8080/api/tourtrans/all'),
                    fetch('http://localhost:8080/api/transportation/all')
                ]);

                if (!locationResponse.ok) throw new Error('위치 데이터를 가져오는 데 실패했습니다.');
                if (!transDataResponse.ok) throw new Error('교통 데이터를 가져오는 데 실패했습니다.');
                if (!transPortResponse.ok) throw new Error('교통 데이터를 가져오는 데 실패했습니다.');

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

    useEffect(() => {
        if (!mapLoaded || locations.length === 0) return;

        const map = new window.naver.maps.Map('map', {
            center: new window.naver.maps.LatLng(35.1796, 129.0756),
            zoom: 11 // 초기 확대 수준 설정
        });

        // 관광지 마커 설정
        const newLocationMarkers = locations.map((location) => {
            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo),
                map: map,
                title: location.areaClturTrrsrtNm
            });

            marker.addListener('click', () => {
                setSelectedLocation(location);

                // 새로운 대중교통 마커 설정
                const relatedTransData = transDatas.filter(transData => transData.keyId === location.keyId);
                const newTransMarkers = relatedTransData.map((data) => {
                    const matchedTransPort = transPorts.find(port => port.value === data.value);
                    const iconUrl = getIconUrl(matchedTransPort);

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

                // 지도 확대 및 중심 이동 - 클릭한 위치와 관련된 마커들만 보이도록 설정
                const bounds = new window.naver.maps.LatLngBounds();
                bounds.extend(new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo));
                newTransMarkers.forEach(marker => bounds.extend(marker.getPosition()));

                // 확대 크기 및 중심 이동
                map.fitBounds(bounds); // 선택한 위치 및 관련된 마커들이 보이도록 확대
            });

            return marker;
        });

        setLocationMarkers(newLocationMarkers); // 관광지 마커 상태 저장

        // 지도의 빈 공간 클릭 시 초기화
        window.naver.maps.Event.addListener(map, 'click', () => {
            // 관광지 마커는 항상 표시
            locationMarkers.forEach(marker => marker.setMap(map));

            // 대중교통 마커는 숨기기
            transMarkers.forEach(marker => marker.setMap(null));

            setTransMarkers([]); // 대중교통 마커 상태 초기화
            setSelectedLocation(null); // 선택된 위치 초기화
        });

    }, [mapLoaded, locations, transDatas, transPorts, transMarkers]);

    const getIconUrl = (matchedTransPort) => {
        if (matchedTransPort) {
            // `transData.value`와 `transPortData.value`가 일치하면 설정
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
            // 기본 아이콘 설정
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
