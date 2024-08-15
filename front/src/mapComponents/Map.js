import React, { useEffect, useState } from 'react';
import ReviewBoard from './ReviewBoard';
import TransportInfo from './TransportInfo';

// 이미지 파일을 import
import defaultLocation from '../images/defaultLocation.png';
import selectedLocation from '../images/selectedLocation.png';
import busMarker from '../images/busMarker.png';
import subwayMarker from '../images/subwayMarker.png';
import trainMarker from '../images/trainMarker.png';
import defaultMarker from '../images/defaultMarker.png';

const NAVER_MAPS_CLIENT_ID = '9yspoa5cox';

export default function Map() {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [transMarkers, setTransMarkers] = useState([]);
    const [activeMarker, setActiveMarker] = useState(null);
    const [prevActiveMarker, setPrevActiveMarker] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadNaverMapsApi(setMapLoaded, setError);
    }, []);

    useEffect(() => {
        if (mapLoaded) {
            fetchLocations(setLocations, setError);
        }
    }, [mapLoaded]);

    useEffect(() => {
        if (mapLoaded && locations.length > 0) {
            initializeMap(locations, mapLoaded);
        }
    }, [mapLoaded, locations]);

    return (
        <div className='w-full h-full bg-slate-100 flex'>
            <Sidebar selectedLocation={selectedLocation} />
            <div id="map" style={{ width: '70%', height: '500px' }} className='w-3/4 h-full'></div>
            {error && <p className='text-red-500'>{error}</p>}
        </div>
    );
}

// 로직 분리된 Sidebar 컴포넌트
function Sidebar({ selectedLocation }) {
    return (
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
    );
}

// 네이버 지도 API 로드
function loadNaverMapsApi(setMapLoaded, setError) {
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

// 위치 데이터 가져오기
async function fetchLocations(setLocations, setError) {
    try {
        const response = await fetch('http://localhost:8080/api/locations/all');
        if (!response.ok) throw new Error('위치 데이터를 가져오는 데 실패했습니다.');

        const data = await response.json();
        setLocations(data);
    } catch (error) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
        console.error('데이터 가져오기 실패:', error);
    }
}

// 지도 초기화 함수
function initializeMap(locations, mapLoaded) {
    const map = new window.naver.maps.Map('map', {
        center: new window.naver.maps.LatLng(35.1796, 129.0756),
        zoom: 11,
    });

    locations.forEach((location) => {
        const marker = createMarker(map, location, mapLoaded);
        marker.addListener('click', () => {
            handleLocationClick(location, marker, map);
        });
    });

    window.naver.maps.Event.addListener(map, 'click', () => {
        resetMapState();
    });
}

// 마커 생성 함수
function createMarker(map, location, mapLoaded) {
    return new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo),
        map: map,
        title: location.areaClturTrrsrtNm,
        icon: getMarkerIcon(mapLoaded, location),
    });
}

// 마커 아이콘 반환 함수
function getMarkerIcon(activeMarker, location) {
    return {
        url: activeMarker && activeMarker.getTitle() === location.areaClturTrrsrtNm ? selectedLocation : defaultLocation,
        size: new window.naver.maps.Size(32, 32),
        origin: new window.naver.maps.Point(0, 0),
        anchor: new window.naver.maps.Point(16, 32),
    };
}

// 마커 클릭 처리 함수
async function handleLocationClick(location, marker, map) {
    if (prevActiveMarker) {
        resetMarkerIcon(prevActiveMarker);
        clearMarkers(prevTransMarkers);
    }

    updateMarkerIcon(marker, selectedLocation);
    setActiveMarker(marker);
    setPrevActiveMarker(marker);
    setSelectedLocation(location);

    try {
        const transData = await fetchTransportData(location.keyId);
        const newTransMarkers = displayTransportMarkers(transData, map);
        setTransMarkers(newTransMarkers);
        setPrevTransMarkers(newTransMarkers);
        fitMapBounds(newTransMarkers, location, map);
    } catch (error) {
        console.error('대중교통 데이터 가져오기 실패:', error);
    }
}

// 대중교통 데이터 가져오기
async function fetchTransportData(keyId) {
    const response = await fetch(`http://localhost:8080/api/tourtrans/${keyId}`);
    if (!response.ok) throw new Error('교통 데이터를 가져오는 데 실패했습니다.');

    return response.json();
}

// 대중교통 마커 표시 함수
function displayTransportMarkers(transports, map) {
    return transports.map((transport) => {
        const iconUrl = getIconUrl(transport.value);
        return createTransportMarker(map, transport, iconUrl);
    });
}

// 대중교통 마커 생성 함수
function createTransportMarker(map, transport, iconUrl) {
    return new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(transport.fcltyLa, transport.fcltyLo),
        map: map,
        title: transport.pbtrnspFcltyNm,
        icon: {
            url: iconUrl,
            size: new window.naver.maps.Size(32, 32),
            origin: new window.naver.maps.Point(0, 0),
            anchor: new window.naver.maps.Point(16, 32),
        },
    });
}

// 마커 초기화 함수
function clearMarkers(markers) {
    markers.forEach((marker) => marker.setMap(null));
}

// 마커 아이콘 리셋 함수
function resetMarkerIcon(marker) {
    updateMarkerIcon(marker, defaultLocation);
}

// 마커 아이콘 업데이트 함수
function updateMarkerIcon(marker, iconUrl) {
    marker.setIcon({
        url: iconUrl,
        size: new window.naver.maps.Size(32, 32),
        origin: new window.naver.maps.Point(0, 0),
        anchor: new window.naver.maps.Point(16, 32),
    });
}

// 맵 경계 설정 함수
function fitMapBounds(markers, location, map) {
    const bounds = new window.naver.maps.LatLngBounds();
    bounds.extend(new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo));
    markers.forEach((marker) => bounds.extend(marker.getPosition()));
    map.fitBounds(bounds);
}

// 대중교통 아이콘 URL 반환 함수
function getIconUrl(transDataValue) {
    switch (transDataValue) {
        case 'b':
            return busMarker;
        case 's1':
            return subwayMarker;
        case 's5':
            return trainMarker;
        default:
            return defaultMarker;
    }
}
