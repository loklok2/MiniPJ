import React, { useEffect, useState } from 'react';
import ReviewBoard from './ReviewBoard';
import TransportInfo from './TransportInfo';

import defaultMarker from '../images/defaultMarker.png';
import selectedMarker from '../images/selectedMarker.png';
import busMarker from '../images/busMarker.png';
import subwayMarker from '../images/subwayMarker.png';
import trainMarker from '../images/trainMarker.png';
import transMarker from '../images/transMarker.png';

const NAVER_MAPS_CLIENT_ID = '8zmr5qp493';

export default function Map() {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [transMarkers, setTransMarkers] = useState([]);
    const [activeMarker, setActiveMarker] = useState(null);
    const [naverMap, setNaverMap] = useState(null);
    const [error, setError] = useState(null);
    const [resetMap, setResetMap] = useState(false); // 지도 초기화를 위한 상태

    useEffect(() => {
        loadNaverMapsApi();
    }, []);

    useEffect(() => {
        if (mapLoaded && naverMap) {
            fetchLocations();
        }
    }, [mapLoaded, naverMap]);

    useEffect(() => {
        if (naverMap && locations.length > 0) {
            initializeMap();
        }
    }, [naverMap, locations]);

    useEffect(() => {
        if (selectedLocation) {
            clearMarkers(); // 이전 선택된 위치의 대중교통 마커 삭제
            fetchAndDisplayTransportMarkers(selectedLocation);
        }
    }, [selectedLocation]);

    useEffect(() => {
        if (activeMarker) {
            updateMarkerIcon(activeMarker, selectedMarker);
        }
    }, [activeMarker]);

    // resetMap 상태 변화 감지 및 지도 초기화
    useEffect(() => {
        if (resetMap) {
            resetMapToInitialState();
            setResetMap(false); // 초기화 작업 후 상태를 다시 false로 변경
        }
    }, [resetMap]);

    const loadNaverMapsApi = () => {
        if (window.naver && window.naver.maps) {
            initializeMapInstance();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAPS_CLIENT_ID}`;
        script.onload = initializeMapInstance;
        script.onerror = () => {
            setError('네이버 지도 API 로드 실패');
            console.error('Naver Maps API 로드 실패');
        };
        document.head.appendChild(script);
    };

    const initializeMapInstance = () => {
        const mapInstance = new window.naver.maps.Map('map', {
            center: new window.naver.maps.LatLng(35.1796, 129.0756),
            zoom: 11,
        });
        setNaverMap(mapInstance);
        setMapLoaded(true);

        // 지도 클릭 이벤트 추가
        mapInstance.addListener('click', handleMapClick);
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/locations/all');
            if (!response.ok) throw new Error('위치 데이터를 가져오는 데 실패했습니다.');
            const data = await response.json();
            setLocations(data);
        } catch (err) {
            setError('데이터를 가져오는 중 오류가 발생했습니다.');
            console.error('데이터 가져오기 실패:', err);
        }
    };

    const initializeMap = () => {
        locations.forEach((location) => {
            const marker = createMarker(location);
            marker.addListener('click', () => handleLocationClick(location, marker));
        });
    };

    const createMarker = (location) => {
        const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo),
            map: naverMap,
            title: location.areaClturTrrsrtNm,
        });
        updateMarkerIcon(marker, defaultMarker);
        return marker;
    };

    const updateMarkerIcon = (marker, iconUrl) => {
        marker.setIcon({
            url: iconUrl,
            size: new window.naver.maps.Size(32, 32),
            origin: new window.naver.maps.Point(0, 0),
            anchor: new window.naver.maps.Point(16, 32),
        });
    };

    const handleLocationClick = (location, marker) => {
        setActiveMarker((prevMarker) => {
            if (prevMarker && prevMarker !== marker) {
                updateMarkerIcon(prevMarker, defaultMarker); // 이전 마커 아이콘을 기본으로 되돌림
            }
            return marker;
        });

        updateMarkerIcon(marker, selectedMarker); // 현재 선택된 마커의 아이콘 변경
        setSelectedLocation(location);
    };

    const handleMapClick = () => {
        // 지도 초기화를 위한 상태를 true로 변경
        setResetMap(true);
    };

    const resetMapToInitialState = () => {
        if (naverMap) {
            if (activeMarker) {
                updateMarkerIcon(activeMarker, defaultMarker);
                setActiveMarker(null);
            }
            setSelectedLocation(null);
            clearMarkers(); // 대중교통 마커 삭제

            // 지도 초기 상태로 되돌리기
            naverMap.setCenter(new window.naver.maps.LatLng(35.1796, 129.0756));
            naverMap.setZoom(11);
        }
    };

    const fetchAndDisplayTransportMarkers = async (location) => {
        try {
            const transData = await fetchTransportData(location.keyId);
            const newTransMarkers = displayTransportMarkers(transData);
            setTransMarkers(newTransMarkers);
            fitMapBounds(newTransMarkers, location);
        } catch (err) {
            setError('대중교통 데이터를 가져오는 중 오류가 발생했습니다.');
            console.error('대중교통 데이터 가져오기 실패:', err);
        }
    };

    const fetchTransportData = async (keyId) => {
        const response = await fetch(`http://localhost:8080/api/tourtrans/${keyId}`);
        if (!response.ok) throw new Error('교통 데이터를 가져오는 데 실패했습니다.');
        return response.json();
    };

    const displayTransportMarkers = (transports) => {
        return transports.map((transport) => {
            const iconUrl = getIconUrl(transport.value);
            return new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(transport.fcltyLa, transport.fcltyLo),
                map: naverMap,
                title: transport.pbtrnspFcltyNm,
                icon: {
                    url: iconUrl,
                    size: new window.naver.maps.Size(32, 32),
                    origin: new window.naver.maps.Point(0, 0),
                    anchor: new window.naver.maps.Point(16, 32),
                },
            });
        });
    };

    const clearMarkers = () => {
        transMarkers.forEach((marker) => marker.setMap(null));
        setTransMarkers([]);
    };

    const fitMapBounds = (markers, location) => {
        const bounds = new window.naver.maps.LatLngBounds();
        bounds.extend(new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo));
        markers.forEach((marker) => bounds.extend(marker.getPosition()));
        naverMap.fitBounds(bounds);
    };

    const getIconUrl = (transDataValue) => {
        switch (transDataValue) {
            case 'b':
                return busMarker;
            case 's1':
            case 's2':
            case 's3':
            case 's4':
                return subwayMarker;
            case 's5':
                return trainMarker;
            default:
                return transMarker;
        }
    };

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
