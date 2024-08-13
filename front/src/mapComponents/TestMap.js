import { useEffect, useState } from 'react';

const NAVER_MAPS_CLIENT_ID = '9yspoa5cox';

export default function MapWithLineString() {
    const [mapLoaded, setMapLoaded] = useState(false);

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
                console.error('Naver Maps API 로드 실패');
            };

            document.head.appendChild(script);
        };

        loadNaverMapsApi();
    }, []);

    useEffect(() => {
        if (!mapLoaded) return;

        const map = new window.naver.maps.Map('map', {
            center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울의 중심 좌표
            zoom: 13
        });

        // LINESTRING 데이터
        const lineString = "LINESTRING (494624.3471523258 279537.423193331, 494622.6061019609 279537.7156839407, 494618.0446399227 279536.4426862712, 494612.0411093048 279534.37312290416, 494606.7144040189 279531.5303262178, 494601.38769877964 279528.6875295938, 494596.38487256545 279526.85205470555, 494593.16122885526 279525.70453263854, 494588.4810366906 279525.09938046685, 494583.24499473313 279524.37662544264, 494578.0068152852 279523.76685577433, 494573.22349025495 279522.3796179496, 494567.2910954714 279519.0056919682)";

        // 좌표 배열로 변환
        const path = lineString
            .replace("LINESTRING (", "")
            .replace(")", "")
            .split(", ")
            .map(coord => {
                const [x, y] = coord.split(" ").map(parseFloat);
                // 좌표 변환이 필요한 경우 아래의 EPSG:3857 -> EPSG:4326 변환 로직을 사용합니다.
                const latLng = naver.maps.TransCoord.fromTM128ToLatLng(new naver.maps.Point(x, y));
                return new naver.maps.LatLng(latLng.y, latLng.x);
            });

        // Polyline 설정
        const polyline = new window.naver.maps.Polyline({
            map: map,
            path: path,
            strokeColor: '#FF0000',
            strokeWeight: 5,
            strokeOpacity: 0.8,
        });

        // 지도 범위 설정
        const bounds = new window.naver.maps.LatLngBounds();
        path.forEach(point => bounds.extend(point));
        map.fitBounds(bounds);

    }, [mapLoaded]);

    return (
        <div id="map" style={{ width: '100%', height: '500px' }}></div>
    );
}
