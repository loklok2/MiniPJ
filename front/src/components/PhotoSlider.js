import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { SlArrowLeft, SlArrowRight } from "react-icons/sl"

export default function PhotoSlider({ photos = [], onPhotoClick }) {
    const [currentIndex, setCurrentIndex] = useState(0) // 현재 슬라이더의 인덱스를 관리
    const [randomPhotos, setRandomPhotos] = useState([]) // 랜덤으로 선택된 사진들을 관리
    const [isClickable, setIsClickable] = useState(true) // 사용자가 버튼을 클릭할 수 있는 상태인지 관리
    const [isImagesLoaded, setIsImagesLoaded] = useState(false) // 이미지가 모두 로드되었는지 관리
    const slideIntervalRef = useRef(null) // 자동 슬라이드의 인터벌을 관리하기 위한 ref
    const location = useLocation()  // 현재 페이지의 위치를 가져오기 위한 훅

    // 사진 목록에서 랜덤하게 세 개의 사진을 선택하는 함수
    const selectRandomPhotos = (photos) => {
        // [...photos]는 전개 연산자(spread operator)를 사용, photos 배열을 직접 수정하지 않고, 원본 배열을 유지 새로운 배열을 생성
        // Array.prototype.sort()는 기본적으로 배열을 정렬하는 함수, 비교 함수(compare function)를 인수로 받을 수 있습니다.(비교 함수는 두 요소의 상대적인 순서를 결정하는 데 사용)
        // 비교 함수 () => 0.5 - Math.random(): 무작위로 음수 또는 양수를 반환하기 때문에, 배열의 요소들이 무작위로 섞일 가능성이 높아지고, 비교 함수가 양수와 음수 모두를 반환하기 때문에, 요소들의 상대적 순서가 자주 바뀝니다.
        const shuffled = [...photos].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, 3)
    }

    // 사진 목록이 변경되면 랜덤으로 세 장의 사진을 선택하여 상태를 업데이트
    useEffect(() => {
        if (photos.length > 0) {
            const selectedPhotos = selectRandomPhotos(photos)
            setRandomPhotos(selectedPhotos)
        }
    }, [photos])

    // 랜덤으로 선택된 사진과 이미지 로드 상태가 설정되면 자동 슬라이드 기능을 시작
    useEffect(() => {
        // randomPhotos 배열에 요소가 있고, 모든 이미지가 로드된 상태라면 아래 코드 블록 실행
        if (randomPhotos.length > 0 && isImagesLoaded) {
            // setInterval을 사용하여 5초(5000ms)마다 슬라이드를 자동으로 전환하는 타이머 설정
            slideIntervalRef.current = setInterval(() => {
                // 슬라이드가 전환될 때 클릭을 일시적으로 비활성화하여 중복 클릭을 방지
                setIsClickable(false)

                // currentIndex를 업데이트하여 다음 슬라이드로 전환
                // (현재 인덱스 + 1) % 슬라이드 개수 -> 마지막 슬라이드에서 첫 번째 슬라이드로 순환                
                setCurrentIndex((prevIndex) =>
                    (prevIndex + 1) % randomPhotos.length
                )

                // 슬라이드 전환 후 1초(1000ms) 후에 클릭을 다시 활성화
                setTimeout(() => {
                    setIsClickable(true)
                }, 1000)

            }, 5000)    // 이 타이머는 5초마다 실행됨
        }

        // useEffect의 클린업 함수: 컴포넌트가 언마운트되거나, randomPhotos 또는 isImagesLoaded가 변경될 때
        // 현재 설정된 인터벌 타이머를 해제하여 메모리 누수를 방지하고, 불필요한 타이머 동작을 중지
        return () => clearInterval(slideIntervalRef.current)
    }, [randomPhotos, isImagesLoaded])  // randomPhotos 또는 isImagesLoaded가 변경될 때마다 이 useEffect가 재실행됨

    // 사용자가 뒤로 가기를 하거나 페이지를 떠날 때 슬라이드를 초기화
    useEffect(() => {
         // useEffect의 반환 함수로, 정리 작업을 수행
        return () => {
            clearInterval(slideIntervalRef.current)
            setCurrentIndex(0)
            setIsImagesLoaded(false)
            setIsClickable(true)
        }
    }, [location])

    // 이전 버튼 클릭 시 슬라이더의 인덱스를 감소
    const handlePrevClick = () => {
        if (isClickable) {
            setCurrentIndex((prevIndex) =>
                (prevIndex - 1 + randomPhotos.length) % randomPhotos.length
            )
        }
    }

    // 다음 버튼 클릭 시 슬라이더의 인덱스를 증가
    const handleNextClick = () => {
        if (isClickable) {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % randomPhotos.length
            )
        }
    }

    // 사진을 클릭했을 때 해당 사진의 URL을 부모 컴포넌트로 전달
    const handlePhotoClick = (photoUrl) => {
        if (isClickable) {
            setIsClickable(false)
            clearInterval(slideIntervalRef.current)
            onPhotoClick(photoUrl)
        }
    }

    // 모든 이미지가 로드된 후 호출되어 로드 상태를 true로 설정
    const handleImageLoad = () => {
        setIsImagesLoaded(true)
    }

    // 사진이 없는 경우 컴포넌트가 렌더링되지 않도록 처리
    if (randomPhotos.length === 0) {
        return null
    }

    return (
        <div className="relative w-full h-[400px] overflow-hidden">
            <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
                onClick={handlePrevClick}
                disabled={!isClickable || !isImagesLoaded}
            >
                <SlArrowLeft size={30} />
            </button>
            <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
                onClick={handleNextClick}
                disabled={!isClickable || !isImagesLoaded}
            >
                <SlArrowRight size={30} />
            </button>
            {randomPhotos.map((photo, index) => (
                <img
                    key={index}
                    src={photo}
                    alt={`Slide ${index + 1}`}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={handleImageLoad}
                    onClick={() => handlePhotoClick(photo)}
                />
            ))}
        </div>
    )
}
