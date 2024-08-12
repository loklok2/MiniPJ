import { useEffect, useState } from 'react';
import ReviewBoard from './ReviewBoard';
import TransportInfo from './TransportInfo';

const NAVER_MAPS_CLIENT_ID = '9yspoa5cox'; // 실제 Naver 클라이언트 ID

export default function Map() {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [locations, setLocations] = useState([]);
    const [transDatas, setTransDatas] = useState([]);
    const [transPortations, setTransPortations] = useState([]);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [transMarkers, setTransMarkers] = useState([]);
    const [polylines, setPolylines] = useState([]);
    const [map, setMap] = useState(null);

    // 네이버 지도 API 로드
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
        }

        loadNaverMapsApi();
    }, []);

    // 데이터 fetch
    useEffect(() => {
        if (!mapLoaded) return;

        const fetchData = async () => {
            try {
                const [locationResponse, transDataResponse, transportationResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/locations/all'),
                    fetch('http://localhost:8080/api/tourtrans/all'),
                    fetch('http://localhost:8080/api/transport/all'),
                ]);

                if (!locationResponse.ok) throw new Error('위치 데이터를 가져오는 데 실패했습니다.');
                if (!transDataResponse.ok) throw new Error('교통 데이터를 가져오는 데 실패했습니다.');
                if (!transportationResponse.ok) throw new Error('정류장 데이터를 가져오는 데 실패했습니다.');

                const locationData = await locationResponse.json();
                const transData = await transDataResponse.json();
                const transportation = await transportationResponse.json();

                setLocations(locationData);
                setTransDatas(transData);
                setTransPortations(transportation);
            } catch (error) {
                setError('데이터를 가져오는 중 오류가 발생했습니다.');
                console.error('데이터 가져오기 실패:', error);
            }
        };

        fetchData();
    }, [mapLoaded]);

    // 마커 및 경로 설정
    useEffect(() => {
        if (!mapLoaded || !locations.length) return;

        const newMap = new window.naver.maps.Map('map', {
            center: new window.naver.maps.LatLng(35.1796, 129.0756),
            zoom: 11,
        });

        setMap(newMap);

        const newMarkers = locations.map((location) => {
            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo),
                map: newMap,
                title: location.areaClturTrrsrtNm,
            });

            marker.addListener('click', () => {
                // 기존 대중교통 마커와 경로 제거
                transMarkers.forEach((transMarker) => transMarker.setMap(null));
                setTransMarkers([]);
                polylines.forEach((polyline) => polyline.setMap(null));
                setPolylines([]);

                setSelectedLocation(location);

                const relatedTransData = transDatas.filter(transData =>
                    transData.keyId === location.keyId &&
                    transPortations.some(transport => transport.value === transData.value)
                );

                const newTransMarkers = relatedTransData.map((data) => {
                    const matchingTransport = transPortations.find(transport => transport.value === data.value);
                    if (matchingTransport) {
                        const markerIcon = matchingTransport.transPortation.includes('지하철') ? 'green' : 'blue';
                        const transMarker = new window.naver.maps.Marker({
                            position: new window.naver.maps.LatLng(data.fcltyLa, data.fcltyLo),
                            map: newMap,
                            title: data.pbtrnspFcltyNm,
                            icon: {
                                content: `<div style="background-color:${markerIcon}; width:20px; height:20px; border-radius:50%;"></div>`,
                            },
                        });

                        transMarker.addListener('click', () => {
                            const polyline = new window.naver.maps.Polyline({
                                path: [
                                    new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo),
                                    new window.naver.maps.LatLng(data.fcltyLa, data.fcltyLo)
                                ],
                                strokeColor: '#5347AA',
                                strokeWeight: 4,
                                map: newMap,
                            });
                            setPolylines((prevPolylines) => [...prevPolylines, polyline]);
                        });

                        return transMarker;
                    }
                    return null;
                }).filter(Boolean);

                setTransMarkers(newTransMarkers);

                newMap.setZoom(14);
                newMap.panTo(new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo));
            });

            return marker;
        });

        setMarkers(newMarkers);

        // 맵 클릭 시 모든 마커와 경로 제거
        window.naver.maps.Event.addListener(newMap, 'click', () => {
            newMarkers.forEach((marker) => marker.setMap(null));
            setMarkers([]);
            transMarkers.forEach((transMarker) => transMarker.setMap(null));
            setTransMarkers([]);
            polylines.forEach(polyline => polyline.setMap(null));
            setPolylines([]);
            setSelectedLocation(null);
            setMarkers(newMarkers); // 초기 마커 설정
            newMarkers.forEach((marker) => marker.setMap(newMap)); // 마커 다시 설정
            newMap.setZoom(11);
            newMap.panTo(new window.naver.maps.LatLng(35.1796, 129.0756));
        });

    }, [mapLoaded, locations, transDatas, transPortations]);

    return (
        <div className='w-full h-full bg-slate-100 flex'>
            <div className='w-1/4 h-full bg-white p-4'>
                {selectedLocation ? (
                    <>
                        <TransportInfo selectedLocation={selectedLocation} />
                        {selectedLocation.keyId ? (
                            <ReviewBoard locationId={selectedLocation.keyId} />
                        ) : (
                            <p>위치 정보가 없습니다.</p>
                        )}
                    </>
                ) : (
                    <p>마커를 클릭하여 위치 정보를 확인하세요.</p>
                )}
            </div>
            <div id="map"
                style={{ width: '70%', height: '500px' }}
                className='w-3/4 h-full'></div>
            {error && <p className='text-red-500'>{error}</p>}
        </div>
    );
}
