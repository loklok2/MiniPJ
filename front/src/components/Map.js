import React, { useEffect, useState } from 'react';

export default function Map() {
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        // 네이버 지도 API 스크립트를 동적으로 로드
        const loadNaverMapsApi = () => {
            if (window.naver) {
                setMapLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=9yspoa5cox'; // 네이버 클라이언트 ID로 교체
            script.onload = () => setMapLoaded(true);
            script.onerror = () => console.error('Failed to load Naver Maps API');
            document.head.appendChild(script);
        };

        loadNaverMapsApi();
    }, []);

    useEffect(() => {
        if (!mapLoaded || !window.naver) return;

        const initializeMap = () => {
            const map = new window.naver.maps.Map('map', {
                center: new window.naver.maps.LatLng(37.5665, 126.978),
                zoom: 10
            });

            fetch('/api/locations')
                .then(response => response.json())
                .then(locations => {
                    locations.forEach(location => {
                        new window.naver.maps.Marker({
                            position: new window.naver.maps.LatLng(location.latitude, location.longitude),
                            map: map
                        });
                    });
                })
                .catch(error => console.error('Error fetching locations:', error));
        };

        initializeMap();
    }, [mapLoaded]);

    return (
        <div className='w-full h-full bg-slate-100
                        flex justify-content-center items-center'>
            <div
                id="map"
                style={{ width: '70%', height: '300px' }}>

            </div>
        </div>
    )
}