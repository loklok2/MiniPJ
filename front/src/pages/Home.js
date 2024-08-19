import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PhotoSlider from '../components/PhotoSlider'
import SearchBar from '../utils/SearchBar'

export default function Home() {
  const navigate = useNavigate() // 페이지 이동을 위한 useNavigate 훅

  // 이미지 슬라이더에 표시할 이미지 URL을 저장하는 상태
  const [imagesForSlider, setImagesForSlider] = useState([])

  // 검색 필드에 입력된 텍스트를 저장하는 상태
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    // 서버에서 이미지 데이터를 가져오는 함수
    const fetchImages = async () => {
      const response = await fetch('http://localhost:8080/api/locations/all')
      const data = await response.json()

      // API 응답에서 각 이미지의 서버 URL을 생성하여 imagesForSlider 상태에 저장
      const imageUrls = data
        .map(spot => `http://localhost:8080/api/locations/image/${spot.dataNo}`)
        .filter(url => url)

      // // API 응답에서 이미지 URL을 추출하여 imagesForSlider 상태에 저장
      // const imageUrls = data.map(spot => spot.imageUrl).filter(url => url)

      setImagesForSlider(imageUrls)
    }

    // 컴포넌트가 마운트될 때 이미지 데이터를 가져옴
    fetchImages()
  }, [])

  // 검색어를 기반으로 TouristSpots 페이지로 이동하는 함수
  const handleSearch = () => {
    navigate('/tourlist', { state: { searchQuery: searchText } })
  }

  // 사용자가 이미지를 클릭했을 때 해당 이미지를 기반으로 TouristSpots 페이지로 이동하는 함수
  const handlePhotoClick = (photoUrl) => {
    navigate('/tourlist', { state: { selectedPhoto: photoUrl } })
  }

  return (
    <div className="w-full h-full bg-gray-50 py-12">
      {/* PhotoSlider 컴포넌트를 사용하여 이미지 슬라이더를 표시 */}
      <div className="max-w-screen-lg mx-auto mb-8">  {/* mb-8을 추가하여 아래 여백을 더 줌 */}
        <PhotoSlider photos={imagesForSlider} 
                     onPhotoClick={handlePhotoClick} />
      </div>

      {/* SearchBar 컴포넌트를 사용하여 검색 필드를 표시 */}
      <div className="max-w-screen-lg mx-auto">
        <SearchBar
          searchText={searchText}  // 검색 텍스트 상태 전달
          onSearchTextChange={setSearchText}  // 검색 텍스트 변경 시 호출될 함수 전달
          onSearch={handleSearch}  // 검색 버튼 클릭 시 호출될 함수 전달
        />
      </div>

      {/* 추가 콘텐츠 섹션 (현재는 빈 상태) */}
      <div className="mt-16">
        <p className="text-center text-gray-600 text-lg">콘텐츠 추가...</p>
      </div>
    </div>
  )
}
