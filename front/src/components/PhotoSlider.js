import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl'

// PhotoSlider 컴포넌트는 주어진 사진들을 무작위로 섞어서 슬라이드 쇼 형태로 보여줍니다.
// 사용자는 이전/다음 버튼을 클릭하거나, 이미지를 클릭하여 해당 이미지를 선택할 수 있습니다.
export default function PhotoSlider({ photos = [], onPhotoClick }) {
    // 슬라이드에서 현재 보여주고 있는 이미지의 인덱스를 관리하는 상태입니다.
    // 초기값은 0이며, 이는 첫 번째 이미지를 의미합니다.
    const [currentIndex, setCurrentIndex] = useState(0)
    
    // 무작위로 섞인 사진들의 배열을 관리하는 상태입니다.
    // 초기값은 빈 배열이며, `photos` 배열이 변경될 때마다 이 배열이 갱신됩니다.
    const [randomPhotos, setRandomPhotos] = useState([])
    
    // 버튼이나 이미지가 클릭 가능한 상태인지 관리하는 상태입니다.
    // `false`인 경우 사용자의 클릭을 무시하며, 슬라이드 전환 중이나 이미지 로드 중에 비활성화됩니다.
    const [isClickable, setIsClickable] = useState(true)
    
    // 모든 이미지가 로드되었는지 여부를 관리하는 상태입니다.
    // 초기값은 `false`이며, 이미지가 모두 로드된 후에 `true`로 설정됩니다.
    const [isImagesLoaded, setIsImagesLoaded] = useState(false)
    
    // 자동 슬라이드 기능을 관리하기 위한 타이머의 참조를 저장합니다.
    // `useRef`를 사용하여 타이머 ID를 저장하고, 컴포넌트가 언마운트되거나 상태가 변경될 때 타이머를 해제합니다.
    const slideIntervalRef = useRef(null)
    
    // 현재 페이지의 URL 위치를 가져오기 위해 `useLocation` 훅을 사용합니다.
    // 이는 페이지가 변경될 때마다 슬라이드 쇼를 초기화하는 데 사용됩니다.
    const location = useLocation()

    // 배열을 무작위로 섞는 셔플 함수입니다.
    // Fisher-Yates 알고리즘을 사용하여 주어진 배열의 요소들을 무작위로 재배열합니다.
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            // 현재 요소와 무작위로 선택된 요소의 위치를 교환합니다.
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array // 섞인 배열을 반환합니다.
    }

    // `photos` 배열이 변경될 때마다 실행되는 `useEffect` 훅입니다.
    // 이 훅은 `photos` 배열을 무작위로 셔플하여 `randomPhotos` 상태에 저장합니다.
    useEffect(() => {
        if (photos.length > 0) { // `photos` 배열에 요소가 있는지 확인합니다.
            const shuffledPhotos = shuffleArray([...photos]) // 원본 배열을 복사한 후 셔플합니다.
            setRandomPhotos(shuffledPhotos) // 셔플된 배열을 상태로 설정합니다.
            console.log('Shuffled photos:', shuffledPhotos) // 셔플된 배열을 콘솔에 출력합니다.
        }
    }, [photos]) // `photos` 배열이 변경될 때마다 이 훅이 실행됩니다.

    // 슬라이드 쇼를 자동으로 진행하기 위한 `useEffect` 훅입니다.
    // `randomPhotos` 배열이 준비되고 모든 이미지가 로드되면 이 훅이 실행됩니다.
    useEffect(() => {
        if (randomPhotos.length > 0 && isImagesLoaded) { // 무작위 사진 배열과 이미지 로드 상태가 준비된 경우
            console.log('Images loaded and photos available, starting slide show')
            
            // 5초마다 자동으로 다음 슬라이드로 이동하기 위한 타이머를 설정합니다.
            slideIntervalRef.current = setInterval(() => {
                console.log('Auto sliding to the next image')
                setIsClickable(false) // 슬라이드가 전환될 때 클릭을 비활성화합니다.
                setCurrentIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % randomPhotos.length // 다음 인덱스를 계산합니다.
                    console.log('Next index:', nextIndex)
                    return nextIndex
                })
                
                // 슬라이드 전환이 완료된 후 1초 후에 클릭을 다시 활성화합니다.
                setTimeout(() => {
                    console.log('Making slides clickable again')
                    setIsClickable(true)
                }, 1000)
            }, 5000) // 5초마다 슬라이드가 전환됩니다.

            // 컴포넌트가 언마운트되거나 상태가 변경될 때 타이머를 해제합니다.
            return () => {
                console.log('Clearing slide interval')
                clearInterval(slideIntervalRef.current)
            }
        }
    }, [randomPhotos, isImagesLoaded]) // `randomPhotos` 또는 `isImagesLoaded`가 변경될 때마다 실행됩니다.

    // 페이지 이동이나 컴포넌트 언마운트 시 슬라이더를 초기화하는 `useEffect` 훅입니다.
    useEffect(() => {
        return () => {
            console.log('Location change detected, resetting slider')
            clearInterval(slideIntervalRef.current) // 자동 슬라이드 타이머를 해제합니다.
            setCurrentIndex(0) // 슬라이드 인덱스를 초기화합니다.
            setIsImagesLoaded(false) // 이미지 로드 상태를 초기화합니다.
            setIsClickable(true) // 클릭 가능 상태를 초기화합니다.
        }
    }, [location]) // 페이지 위치가 변경될 때마다 이 훅이 실행됩니다.

    // 이전 슬라이드로 이동하는 함수입니다.
    // 사용자가 이전 버튼을 클릭했을 때 호출됩니다.
    const handlePrevClick = () => {
        if (isClickable) { // 클릭 가능한 상태인지 확인합니다.
            console.log('Previous button clicked')
            setCurrentIndex((prevIndex) => {
                // 이전 인덱스를 계산하여 순환형 슬라이드를 구현합니다.
                const nextIndex = (prevIndex - 1 + randomPhotos.length) % randomPhotos.length
                console.log('Previous index:', nextIndex)
                return nextIndex
            })
        }
    }

    // 다음 슬라이드로 이동하는 함수입니다.
    // 사용자가 다음 버튼을 클릭했을 때 호출됩니다.
    const handleNextClick = () => {
        if (isClickable) { // 클릭 가능한 상태인지 확인합니다.
            console.log('Next button clicked')
            setCurrentIndex((prevIndex) => {
                // 다음 인덱스를 계산하여 순환형 슬라이드를 구현합니다.
                const nextIndex = (prevIndex + 1) % randomPhotos.length
                console.log('Next index:', nextIndex)
                return nextIndex
            })
        }
    }

    // 특정 이미지를 클릭했을 때 호출되는 함수입니다.
    const handlePhotoClick = (photoUrl, index) => {
        if (isClickable) { // 클릭 가능한 상태인지 확인합니다.
            console.log('Image clicked:', index, photoUrl)
            setIsClickable(false) // 클릭을 비활성화합니다.
            clearInterval(slideIntervalRef.current) // 자동 슬라이드 타이머를 해제합니다.
            onPhotoClick(photoUrl) // 클릭된 이미지의 URL을 부모 컴포넌트로 전달합니다.
            
            // 클릭 후 1초 후에 클릭 가능 상태로 변경합니다.
            setTimeout(() => {
                console.log('Making slides clickable again after click')
                setIsClickable(true)
            }, 1000)
        }
    }

    // 모든 이미지가 로드되었을 때 호출되는 함수입니다.
    // 이는 각 이미지에 `onLoad` 이벤트 핸들러로 연결됩니다.
    const handleImageLoad = () => {
        console.log('Image loaded')
        setIsImagesLoaded(true) // 이미지 로드 상태를 true로 설정합니다.
    }

    // 만약 `randomPhotos` 배열이 비어 있으면 아무 것도 렌더링하지 않습니다.
    if (randomPhotos.length === 0) {
        console.log('No photos available, rendering nothing')
        return null
    }

    // 슬라이드 쇼 UI를 렌더링합니다.
    return (
        <div className="relative w-full h-[400px] overflow-hidden">
            {/* 이전 슬라이드로 이동하는 버튼 */}
            <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
                onClick={handlePrevClick}
                disabled={!isClickable || !isImagesLoaded} // 클릭 가능 상태와 이미지 로드 상태를 확인합니다.
            >
                <SlArrowLeft size={25} />
            </button>

            {/* 다음 슬라이드로 이동하는 버튼 */}
            <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
                onClick={handleNextClick}
                disabled={!isClickable || !isImagesLoaded} // 클릭 가능 상태와 이미지 로드 상태를 확인합니다.
            >
                <SlArrowRight size={25} />
            </button>

            {/* 무작위로 셔플된 사진 배열을 렌더링합니다. */}
            {randomPhotos.map((photo, index) => (
                <img
                    key={`Slide ${index + 1}`} // 고유한 키 값을 지정하여 React가 효율적으로 업데이트할 수 있도록 합니다.
                    src={photo} // 이미지의 소스 URL을 지정합니다.
                    alt={`Slide ${index + 1}`} // 대체 텍스트를 지정하여 접근성을 향상시킵니다.
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`} // 현재 인덱스의 이미지만 보이도록 설정합니다.
                    onLoad={handleImageLoad} // 이미지가 로드된 후 `handleImageLoad` 함수를 호출합니다.
                    onClick={() => handlePhotoClick(photo, index)} // 이미지를 클릭했을 때 `handlePhotoClick` 함수를 호출합니다.
                    style={{ pointerEvents: index === currentIndex ? 'auto' : 'none' }} // 현재 인덱스의 이미지만 클릭할 수 있도록 설정합니다.
                />
            ))}
        </div>
    )
}
