import React, { useState, useEffect } from 'react'
import TransportInfo from './TransportInfo'

// 마커 아이콘 이미지 파일 임포트
import defaultMarker from '../images/defaultMarker.png'
import selectedMarker from '../images/selectedMarker.png'
import busMarker from '../images/busMarker.png'
import subwayMarker1 from '../images/subwayMarker1.png'
import subwayMarker2 from '../images/subwayMarker2.png'
import subwayMarker3 from '../images/subwayMarker3.png'
import donghaeLineMarker from '../images/donghaeLineMarker.png'
import trainMarker from '../images/trainMarker.png'
import transMarker from '../images/transMarker.png'

// 네이버 지도 API 클라이언트 ID 상수
const NAVER_MAPS_CLIENT_ID = '8zmr5qp493'

export default function Map() {
    // 상태 변수 선언
    const [mapLoaded, setMapLoaded] = useState(false) // 네이버 지도 API가 로드되었는지 여부를 추적하는 상태
    const [locations, setLocations] = useState([]) // 관광지 정보를 저장하는 상태
    const [selectedLocation, setSelectedLocation] = useState(null) // 선택된 관광지 정보를 저장하는 상태
    const [transMarkerObjects, setTransMarkerObjects] = useState([]) // 대중교통 마커와 InfoWindow 객체를 관리하는 상태
    const [activeMarker, setActiveMarker] = useState(null) // 현재 선택된 관광지 마커를 저장하는 상태
    const [activeInfoWindow, setActiveInfoWindow] = useState(null) // 현재 활성화된 관광지 정보창을 저장하는 상태
    const [naverMap, setNaverMap] = useState(null) // 네이버 지도 인스턴스를 저장하는 상태
    const [error, setError] = useState(null) // 오류 메시지를 저장하는 상태
    const [resetMap, setResetMap] = useState(false) // 지도를 초기화할지 여부를 추적하는 상태
    const [transportInfo, setTransportInfo] = useState([]) // 대중교통 정보를 저장하는 상태

    // 네이버 지도 API 로드를 담당하는 useEffect 훅
    useEffect(() => {
        loadNaverMapsApi()
    }, [])

    // 지도와 관광지 정보를 가져오는 useEffect 훅
    useEffect(() => {
        if (mapLoaded && naverMap) {
            fetchLocations()
        }
    }, [mapLoaded, naverMap])

    // 관광지 정보를 가져온 후 마커를 초기화하는 useEffect 훅
    useEffect(() => {
        if (naverMap && locations.length > 0) {
            initializeMap()
        }
    }, [naverMap, locations])

    // 선택된 관광지 정보가 변경되었을 때 대중교통 마커를 초기화하는 useEffect 훅
    useEffect(() => {
        if (selectedLocation) {
            clearMarkers() // 기존 마커를 제거
            fetchAndDisplayTransportMarkers(selectedLocation)
        }
    }, [selectedLocation])

    // 선택된 마커의 아이콘을 변경하는 useEffect 훅
    useEffect(() => {
        if (activeMarker) {
            updateMarkerIcon(activeMarker, selectedMarker)
        }
    }, [activeMarker])

    // 지도 초기화 요청이 있을 때 초기화하는 useEffect 훅
    useEffect(() => {
        if (resetMap) {
            resetMapToInitialState()
            setResetMap(false)
        }
    }, [resetMap])

    // 네이버 지도 API를 로드하는 함수
    const loadNaverMapsApi = () => {
        // 네이버 지도 객체가 이미 로드된 경우 초기화
        if (window.naver && window.naver.maps) {
            initializeMapInstance()
            return
        }

        // 스크립트를 통해 네이버 지도 API 로드
        const script = document.createElement('script')
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAPS_CLIENT_ID}`
        script.onload = initializeMapInstance // 스크립트 로드 완료 후 지도 초기화
        script.onerror = () => {
            setError('네이버 지도 API 로드 실패')
            console.error('Naver Maps API 로드 실패')
        }
        document.head.appendChild(script)
    }

    // 네이버 지도 인스턴스를 초기화하는 함수
    const initializeMapInstance = () => {
        // 지도 인스턴스 생성
        const mapInstance = new window.naver.maps.Map('map', {
            center: new window.naver.maps.LatLng(35.1796, 129.0756), // 지도의 초기 중심 위치 (위도, 경도)
            zoom: 11, // 지도의 초기 줌 레벨 (숫자가 클수록 확대)
        })
        setNaverMap(mapInstance)
        setMapLoaded(true)

        mapInstance.addListener('click', handleMapClick) // 지도를 클릭했을 때의 이벤트 핸들러 추가
    }

    // 모든 관광지 정보를 가져오는 함수
    const fetchLocations = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/locations/all')
            if (!response.ok) throw new Error('위치 데이터를 가져오는 데 실패했습니다.')
            const data = await response.json()
            setLocations(data)
        } catch (err) {
            setError('데이터를 가져오는 중 오류가 발생했습니다.')
            console.error('데이터 가져오기 실패:', err)
        }
    }

    // 모든 관광지 마커를 초기화하는 함수
    const initializeMap = () => {
        locations.forEach((location) => {
            const marker = createMarker(location) // 마커 생성
            const infoWindow = new window.naver.maps.InfoWindow({
                content: `<div style="padding: 10px; font-size: 12px;">${location.areaClturTrrsrtNm}</div>`, // 정보창에 표시될 내용
                disableAutoPan: true, // 정보창이 열릴 때 자동으로 지도 중심이 이동하지 않도록 설정
            })

            // 마커 클릭 이벤트 추가
            marker.addListener('click', () => handleLocationClick(location, marker, infoWindow))
        })
    }

    // 주어진 관광지 정보로 마커를 생성하는 함수
    const createMarker = (location) => {
        const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo), // 마커 위치 설정 (위도, 경도)
            map: naverMap, // 마커를 표시할 지도 인스턴스
            title: location.areaClturTrrsrtNm, // 마커에 마우스를 올렸을 때 표시될 제목 (툴팁)
        })
        updateMarkerIcon(marker, defaultMarker) // 마커 아이콘 초기화
        return marker
    }

    // 마커의 아이콘을 업데이트하는 함수
    const updateMarkerIcon = (marker, iconUrl) => {
        marker.setIcon({
            url: iconUrl, // 마커 이미지 URL
            size: new window.naver.maps.Size(32, 32), // 마커 이미지 크기
            origin: new window.naver.maps.Point(0, 0), // 마커 이미지의 원점 좌표
            anchor: new window.naver.maps.Point(16, 32), // 마커의 기준점 (이미지의 아래 중앙에 위치)
        })
    }

    // 특정 관광지 마커를 클릭했을 때 호출되는 함수
    const handleLocationClick = (location, marker, infoWindow) => {
        // 이전에 활성화된 마커를 기본 마커로 되돌리기
        setActiveMarker((prevMarker) => {
            if (prevMarker && prevMarker !== marker) {
                updateMarkerIcon(prevMarker, defaultMarker)
            }
            return marker
        })

        updateMarkerIcon(marker, selectedMarker) // 선택된 마커의 아이콘을 변경
        setSelectedLocation(location) // 선택된 위치를 상태에 저장

        // 이전에 활성화된 정보창을 닫기
        if (activeInfoWindow) {
            activeInfoWindow.close()
        }

        infoWindow.open(naverMap, marker) // 새로운 정보창 열기
        setActiveInfoWindow(infoWindow) // 현재 활성화된 정보창을 상태에 저장
    }

    // 지도를 클릭했을 때 호출되는 함수 (지도 초기화 요청)
    const handleMapClick = () => {
        setResetMap(true)
    }

    // 지도를 초기 상태로 되돌리는 함수
    const resetMapToInitialState = () => {
        if (naverMap) {
            if (activeMarker) {
                updateMarkerIcon(activeMarker, defaultMarker) // 활성화된 마커를 기본 마커로 되돌리기
                setActiveMarker(null)
            }
            if (activeInfoWindow) {
                activeInfoWindow.close() // 활성화된 정보창 닫기
                setActiveInfoWindow(null)
            }
            setSelectedLocation(null) // 선택된 위치 초기화
            clearMarkers() // 대중교통 마커 초기화
            setTransportInfo([]) // 대중교통 정보 초기화

            // 지도 중심과 줌 레벨을 초기 상태로 되돌리기
            naverMap.setCenter(new window.naver.maps.LatLng(35.1796, 129.0756))
            naverMap.setZoom(11)
        }
    }

    // 특정 관광지에 대한 대중교통 마커를 가져와서 표시하는 함수
    const fetchAndDisplayTransportMarkers = async (location) => {
        try {
            const transData = await fetchTransportData(location.keyId) // 대중교통 데이터를 가져옴
            const newTransMarkerObjects = displayTransportMarkers(transData) // 대중교통 마커를 표시
            setTransMarkerObjects(newTransMarkerObjects)
            setTransportInfo(transData) // 대중교통 정보를 상태에 저장
            fitMapBounds(newTransMarkerObjects.map((obj) => obj.marker), location) // 지도 경계를 마커에 맞춤
        } catch (err) {
            setError('대중교통 데이터를 가져오는 중 오류가 발생했습니다.')
            console.error('대중교통 데이터 가져오기 실패:', err)
        }
    }

    // 특정 관광지에 대한 대중교통 정보를 가져오는 함수
    const fetchTransportData = async (keyId) => {
        const response = await fetch(`http://localhost:8080/api/tourtrans/${keyId}`)
        if (!response.ok) throw new Error('교통 데이터를 가져오는 데 실패했습니다.')
        return response.json()
    }

    // 대중교통 마커를 표시하는 함수
    const displayTransportMarkers = (transports) => {
        return transports.map((transport) => {
            const iconUrl = getIconUrl(transport.value) // 대중교통 종류에 따라 마커 아이콘 설정
            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(transport.fcltyLa, transport.fcltyLo), // 마커 위치 설정 (위도, 경도)
                map: naverMap, // 마커를 표시할 지도 인스턴스
                icon: {
                    url: iconUrl, // 마커 이미지 URL
                    size: new window.naver.maps.Size(32, 32), // 마커 이미지 크기
                    origin: new window.naver.maps.Point(0, 0), // 마커 이미지의 원점 좌표
                    anchor: new window.naver.maps.Point(16, 32), // 마커의 기준점 (이미지의 아래 중앙에 위치)
                },
            })

            // 정보창 생성 및 클릭 시 표시
            const infoWindow = new window.naver.maps.InfoWindow({
                content: `<div style="padding: 10px; font-size: 12px;">${transport.pbtrnspFcltyNm}</div>`, // 정보창에 표시될 내용
                disableAutoPan: true, // 정보창이 열릴 때 자동으로 지도 중심이 이동하지 않도록 설정
            })

            marker.addListener('click', () => {
                if (infoWindow.getMap()) {
                    infoWindow.close()
                } else {
                    clearInfoWindows() // 다른 정보창 닫기
                    infoWindow.open(naverMap, marker)
                }
            })

            return { marker, infoWindow } // 마커와 정보창을 함께 반환
        })
    }

    // 모든 대중교통 마커와 정보창을 제거하는 함수
    const clearMarkers = () => {
        transMarkerObjects.forEach(({ marker, infoWindow }) => {
            marker.setMap(null) // 마커를 지도에서 제거
            infoWindow.close() // 정보창 닫기
        })
        setTransMarkerObjects([])
    }

    // 모든 활성화된 정보창을 닫는 함수
    const clearInfoWindows = () => {
        transMarkerObjects.forEach(({ infoWindow }) => infoWindow.close())
    }

    // 지도의 경계를 대중교통 마커에 맞추는 함수
    const fitMapBounds = (markers, location) => {
        const bounds = new window.naver.maps.LatLngBounds() // 지도 경계를 나타내는 객체 생성
        bounds.extend(new window.naver.maps.LatLng(location.trrsrtLa, location.trrsrtLo)) // 관광지 위치를 경계에 포함
        markers.forEach((marker) => bounds.extend(marker.getPosition())) // 모든 대중교통 마커를 경계에 포함
        naverMap.fitBounds(bounds) // 지도의 경계를 설정된 경계에 맞춤
    }

    // 대중교통 데이터 값에 따라 아이콘 URL을 반환하는 함수
    const getIconUrl = (transDataValue) => {
        switch (transDataValue) {
            case 'b':
                return busMarker // 버스 마커 아이콘
            case 's1':
                return subwayMarker1 // 1호선 지하철 마커 아이콘
            case 's2':
                return subwayMarker2 // 2호선 지하철 마커 아이콘
            case 's3':
                return subwayMarker3 // 3호선 지하철 마커 아이콘
            case 's4':
                return donghaeLineMarker // 광역전철(동해선) 마커 아이콘
            case 's5':
                return trainMarker // 기차 마커 아이콘
            default:
                return transMarker // 기타 대중교통 마커 아이콘
        }
    }

    return (
        <div className='w-full h-screen bg-slate-100 flex flex-col pt-[60px]'>
            <div className='w-full h-3/4 flex'>
                <div className='w-1/4 h-full bg-white p-4'>
                    {selectedLocation ? (
                        <>
                            <TransportInfo selectedLocation={selectedLocation} />
                        </>
                    ) : (
                        <p>마커를 클릭하여 위치 정보를 확인하세요.</p>
                    )}
                </div>
                <div id="map" style={{ width: '70%', height: '100%' }} className='w-3/4 h-full'></div>
                {error && <p className='text-red-500'>{error}</p>}
            </div>
        </div>
    )
}
