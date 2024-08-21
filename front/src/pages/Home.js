import { useState, useEffect, useCallback } from 'react'  // React의 상태 관리와 사이드 이펙트를 관리하기 위해 useState, useEffect, useCallback 훅을 가져옴
import { useNavigate } from 'react-router-dom'  // 페이지 탐색을 위해 React Router의 useNavigate 훅을 가져옴
import PhotoSlider from '../components/PhotoSlider'  // 이미지 슬라이더 컴포넌트를 가져옴
import SearchBar from '../utils/SearchBar'  // 검색 바 컴포넌트를 가져옴

// 환경 변수에서 API 기본 URL을 가져옴. 만약 설정되지 않았다면 기본값으로 'http://localhost:8080/api'를 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'
console.log('API_BASE_URL:', API_BASE_URL)  // 현재 API_BASE_URL 값을 콘솔에 출력

// Home 컴포넌트: 메인 페이지 역할을 하며, 이미지 슬라이더와 검색 바를 포함
export default function Home() {
  // error: 오류 메시지를 저장하는 상태 변수
  const [error, setError] = useState(null)
  
  // navigate: 페이지 이동을 위한 useNavigate 훅
  const navigate = useNavigate()

  // imagesForSlider: 슬라이더에 표시할 이미지 URL들을 저장하는 상태 변수
  const [imagesForSlider, setImagesForSlider] = useState([])

  // searchText: 검색 바에 입력된 텍스트를 저장하는 상태 변수
  const [searchText, setSearchText] = useState("")

  // loading: 데이터 로딩 상태를 나타내는 부울 상태 변수. 로딩 중일 때 true
  const [loading, setLoading] = useState(false)

  // useEffect 훅: 컴포넌트가 마운트될 때 한 번 실행되어 서버에서 이미지를 가져옴
  useEffect(() => {
    // 서버에서 이미지 데이터를 가져오는 비동기 함수
    const fetchImages = async () => {
      try {
        console.log('서버에서 이미지를 가져오는 중...')  // 요청 시작을 알리는 로그
        const response = await fetch(`${API_BASE_URL}/locations/all`)  // API 호출

        console.log('응답상태:', response.status)  // 응답 상태 코드 출력

        // 응답이 실패한 경우 (HTTP 상태 코드가 200번대가 아닌 경우)
        if (!response.ok) {
          // 404 오류인 경우
          if (response.status === 404) {
            setError('요청한 리소스를 찾을 수 없습니다.')
          } else {
            setError(`HTTP 오류! 상태: ${response.status}`)
          }
          throw new Error(`HTTP 오류! 상태: ${response.status}`)  // 오류를 던짐
        }
        
        const data = await response.json()  // 응답 데이터를 JSON 형태로 변환
        console.log('가져온 데이터:', data)  // 받아온 데이터를 로그로 출력

        // 각 관광지 데이터에서 이미지 URL을 생성하고, 이를 imagesForSlider 상태에 저장
        const imageUrls = data
          .map(spot => `${API_BASE_URL}/locations/image/${spot.dataNo}`)  // 이미지 URL 생성
          .filter(url => url)  // URL이 존재하는 경우에만 필터링

        setImagesForSlider(imageUrls)  // 상태에 이미지 URL 배열을 저장
      } catch (error) {
        setError('이미지를 가져오는 중 오류가 발생했습니다.')  // 오류 메시지 설정
        console.error(error)  // 오류를 콘솔에 출력
      }
    }

    // 컴포넌트가 마운트될 때 fetchImages 함수 호출
    fetchImages()
  }, [])  // 의존성 배열이 비어 있으므로, 컴포넌트가 처음 마운트될 때만 실행됨

  // handleSearch: 검색어를 기반으로 TouristSpots 페이지로 이동하는 함수
  const handleSearch = useCallback(() => {
    navigate('/tourlist', { state: { searchQuery: searchText } })  // 검색어를 상태로 전달하며 페이지 이동
  }, [navigate, searchText])  // navigate와 searchText가 변경될 때만 이 함수를 다시 생성

  // handlePhotoClick: 사용자가 이미지 슬라이더의 사진을 클릭했을 때 호출되는 함수
  const handlePhotoClick = useCallback((photoUrl) => {
    setLoading(true)  // 로딩 상태를 true로 설정하여 로딩 중임을 표시
    navigate('/tourlist', { state: { selectedPhoto: photoUrl } })  // 선택한 사진 URL을 상태로 전달하며 페이지 이동
  }, [navigate])  // navigate가 변경될 때만 이 함수를 다시 생성

  return (
    <div className="w-full h-full bg-gray-50 py-12">
      {/* PhotoSlider 컴포넌트를 사용하여 이미지 슬라이더를 표시 */}
      <div className="max-w-screen-lg mx-auto mb-8">  {/* max-width를 설정하고 중앙 정렬, 하단에 여백 추가 */}
        <PhotoSlider photos={imagesForSlider}  // 슬라이더에 사용할 이미지 URL 배열을 props로 전달
          onPhotoClick={handlePhotoClick} />  {/* 이미지 클릭 시 호출될 함수를 props로 전달 */}
      </div>

      {/* SearchBar 컴포넌트를 사용하여 검색 바를 표시 */}
      <div className="max-w-screen-lg mx-auto">
        <SearchBar
          searchText={searchText}  // 검색 필드의 텍스트 상태를 props로 전달
          onSearchTextChange={setSearchText}  // 검색 텍스트 변경 시 호출될 함수 전달
          onSearch={handleSearch}  // 검색 버튼 클릭 시 호출될 함수 전달
        />
      </div>
      
      {/* 로딩 상태가 true일 때 로딩 중 메시지를 표시 */}
      {loading && <div className="text-center text-xl py-10">로딩 중...</div>}
      
      {/* 오류가 발생한 경우, 오류 메시지를 표시 */}
      {error && <div className="text-center text-red-500 py-10">{error}</div>}
    </div>
  )
}
