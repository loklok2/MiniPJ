import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PhotoSlider from '../components/PhotoSlider'
import SearchBar from '../utils/SearchBar'

// API 기본 URL을 환경 변수에서 가져오며, 설정되지 않은 경우 로컬 서버 URL을 기본값으로 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'

export default function Home() {
  const [error, setError] = useState(null) // API 호출 시 발생하는 에러 메시지를 저장하는 상태 변수
  const [imagesForSlider, setImagesForSlider] = useState([]) // 슬라이더에 표시할 이미지 URL을 저장하는 상태 변수
  const [searchText, setSearchText] = useState('') // 검색바에 입력된 텍스트를 저장하는 상태 변수
  const [loading, setLoading] = useState(false) // 로딩 상태를 저장하는 변수, 로딩 중일 때 true로 설정
  const navigate = useNavigate() // React Router의 네비게이션 훅, 페이지 이동을 위해 사용

  // 컴포넌트가 마운트될 때 API에서 이미지를 가져오는 비동기 함수
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // API로부터 데이터를 가져오는 비동기 함수
        const response = await fetch(`${API_BASE_URL}/locations/all`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        // 이미지 데이터를 Base64로 인코딩하여 이미지 URL을 생성
        const imageUrls = data.map(spot => `data:image/png;base64,${spot.imageData}`)

        setImagesForSlider(imageUrls) // 슬라이더에 사용할 이미지 URL을 상태로 저장
      } catch (error) {
        setError('이미지를 가져오는 중 오류가 발생했습니다.') // 에러 발생 시 에러 메시지 설정
        console.error(error) // 콘솔에 에러 로그 출력
      }
    }

    fetchImages() // 이미지 데이터를 가져오는 함수 호출
  }, []) // 빈 배열을 의존성 배열로 전달해 컴포넌트가 처음 마운트될 때만 실행

  // 검색 기능을 처리하는 함수, useCallback을 사용하여 메모이제이션 수행
  const handleSearch = useCallback(() => {
    navigate('/tourlist', { state: { searchQuery: searchText } }) // 검색어와 함께 tourlist 페이지로 이동
  }, [navigate, searchText])

  // 사진 클릭 이벤트를 처리하는 함수, useCallback을 사용하여 메모이제이션 수행
  const handlePhotoClick = useCallback((photoUrl) => {
    if (!loading) {  // 로딩 중이 아닐 때만 클릭 이벤트 처리
      setLoading(true) // 로딩 상태로 설정
      navigate('/tourlist', { state: { selectedPhoto: photoUrl } }) // 선택한 사진과 함께 tourlist 페이지로 이동
    }
  }, [navigate, loading])

  return (
    <div className="w-full h-full bg-gray-50 py-12"> {/* 전체 배경 및 패딩 설정 */}
      <div className="max-w-screen-lg mx-auto mb-8"> {/* 중앙 정렬 및 최대 너비 설정 */}
        {/* 슬라이더 컴포넌트 */}
        <PhotoSlider photos={imagesForSlider} onPhotoClick={handlePhotoClick} /> 
      </div>
      <div className="max-w-screen-lg mx-auto"> {/* 중앙 정렬 및 최대 너비 설정 */}
        {/* 검색바 컴포넌트 */}
        <SearchBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onSearch={handleSearch}
        /> 
      </div>
      {/* 로딩 상태일 때 표시 */}
      {loading && <div className="text-center text-xl py-10">로딩 중...</div>} 
      {/* 에러 발생 시 표시 */}
      {error && <div className="text-center text-red-500 py-10">{error}</div>} 
    </div>
  )
}
