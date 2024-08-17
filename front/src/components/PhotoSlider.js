import { useState, useEffect } from 'react'
import { SlArrowLeft, SlArrowRight } from "react-icons/sl"

// PhotoSlider 컴포넌트는 슬라이더 형식으로 사진을 보여줌
// photos: 슬라이더에 표시할 이미지 URL 배열
// onPhotoClick: 사용자가 이미지 클릭 시 호출되는 함수

export default function PhotoSlider({ photos = [], onPhotoClick }) {
    // 현재 슬라이더에서 표시 중인 이미지의 인덱스를 관리하는 상태
    const [currentIndex, setCurrentIndex] = useState(0)

    // 랜덤으로 선택된 이미지를 저장하는 상태
    const [randomPhotos, setRandomPhotos] = useState([])

    // 전달된 photos 배열에서 3개의 랜덤 이미지를 선택하는 함수
    const selectRandomPhotos = (photos) => {
        const shuffled = [...photos].sort(() => 0.5 - Math.random()) // photos 배열을 섞음
        return shuffled.slice(0, 3) // 섞은 배열에서 앞의 3개 요소를 선택
    }

    // photos 배열이 변경될 때마다 3개의 랜덤 이미지를 선택하여 randomPhotos 상태에 저장
    useEffect(() => {
        if (photos.length > 0) {
            setRandomPhotos(selectRandomPhotos(photos))
        }
    }, [photos])

    // 이전 이미지로 슬라이드를 이동시키는 함수
    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + randomPhotos.length) % randomPhotos.length
        )
    }

    // 다음 이미지로 슬라이드를 이동시키는 함수
    const handleNextClick = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + 1) % randomPhotos.length
        )
    }

    // 일정 시간마다 자동으로 다음 이미지로 슬라이드 이동
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % randomPhotos.length)
        }, 3000) // 3초마다 슬라이드 전환

        // 컴포넌트가 언마운트될 때 인터벌을 정리하여 메모리 누수를 방지
        return () => clearInterval(interval)
    }, [randomPhotos])

    // randomPhotos 배열이 비어 있으면 컴포넌트를 렌더링하지 않음
    if (randomPhotos.length === 0) {
        return null // 아무것도 렌더링하지 않음
    }

    return (
        <div className="relative w-full h-[400px] overflow-hidden">
            {/* 이전 이미지로 이동 버튼 */}
            <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
                onClick={handlePrevClick}
            >
                <SlArrowLeft size={30} />
            </button>
            {/* 다음 이미지로 이동 버튼 */}
            <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
                onClick={handleNextClick}
            >
                <SlArrowRight size={30} />
            </button>
            {/* 랜덤으로 선택된 이미지를 렌더링 */}
            {randomPhotos.map((photo, index) => (
                <img
                    key={index}  // 각 이미지의 고유 키
                    src={photo}  // 이미지 소스 URL
                    alt={`Slide ${index + 1}`}  // 이미지 대체 텍스트
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`} // 슬라이드 애니메이션
                    onClick={() => onPhotoClick(photo)}  // 이미지 클릭 시 onPhotoClick 함수 호출
                />
            ))}
        </div>
    )
}
