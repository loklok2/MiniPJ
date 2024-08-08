import { useEffect, useState } from 'react';

export default function Map() {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadNaverMapsApi = () => {
            if (window.naver) {
                setMapLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=9yspoa5cox'; // 실제 Naver 클라이언트 ID로 교체
            script.onload = () => setMapLoaded(true);
            script.onerror = () => console.error('Naver Maps API 로드 실패');
            document.head.appendChild(script);
        };

        loadNaverMapsApi();
    }, []);

    useEffect(() => {
        if (!mapLoaded || !window.naver) return;

        const fetchLocationData = async () => {
            try {
                const timestamp = new Date().getTime(); // 캐시를 방지하기 위한 타임스탬프
                const response = await fetch(`http://localhost:8080/api/locations/all?t=${timestamp}`);
                if (!response.ok) {
                    throw new Error('위치 데이터를 가져오는 데 실패했습니다.');
                }
                const data = await response.json();
                setLocations(data);
            } catch (error) {
                setError('위치 데이터를 가져오는 중 오류가 발생했습니다.');
                console.error('위치 데이터 가져오기 실패:', error);
            }
        };

        fetchLocationData();
    }, [mapLoaded]);

    useEffect(() => {
        if (!mapLoaded || !window.naver || locations.length === 0) return;

        const initializeMap = () => {
            const map = new window.naver.maps.Map('map', {
                center: new window.naver.maps.LatLng(35.1796, 129.0756), // 부산의 좌표로 설정
                zoom: 12
            });

            locations.forEach(location => {
                new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo),
                    map: map,
                    title: location.areaClturTrrsrtNm // 마커에 제목 설정
                });
            });
        };

        initializeMap();
    }, [mapLoaded, locations]);

    return (
        <div className='w-full h-full bg-slate-100 flex justify-center items-center'>
            <div id="map" style={{ width: '70%', height: '300px' }}></div>
            {error && <p className='text-red-500'>{error}</p>}
        </div>
    );
}
