import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

// API 기본 URL 설정: 환경 변수에서 가져오거나 기본값으로 로컬호스트 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'

export default function BoardEdit() {
  
  // 게시물의 제목과 내용을 관리하는 상태
  const [formData, setFormData] = useState({ title: '', content: '' })
  
  // 업로드된 이미지 파일들을 저장하는 상태
  const [images, setImages] = useState([])
  
  // 이미지 미리보기를 위한 상태
  const [imagePreviews, setImagePreviews] = useState([])
  
  // 오류 메시지를 저장하는 상태
  const [error, setError] = useState(null)
  
  // 성공 메시지를 저장하는 상태
  const [success, setSuccess] = useState(null)
  
  // useParams 훅을 사용하여 URL의 파라미터에서 boardId를 가져옴
  const { boardId } = useParams()
  
  // useAuth 훅을 사용하여 인증 정보를 가져옴
  const { auth } = useAuth()

  // 페이지 이동을 위한 useNavigate 훅
  const navigate = useNavigate()

  // 게시물 데이터를 서버로부터 가져오는 비동기 함수
  const fetchBoard = useCallback(async () => {
    try {
      // boardId에 해당하는 게시물 데이터를 가져옴
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}`)

      // 응답이 성공적이지 않을 경우 오류를 발생시킴
      if (!response.ok) {
        console.log('Response:', response)
        throw new Error('게시물을 가져오는 중 오류가 발생했습니다.')
      }

      // 응답 데이터를 JSON 형식으로 파싱하여 상태에 저장
      const data = await response.json()
      setFormData({ title: data.title, content: data.content })

      // 기존 이미지를 미리보기로 설정
      setImagePreviews(data.images.map(image => image.url))
    } catch (error) {
      setError(error.message) // 오류가 발생하면 error 상태에 저장
    }
  }, [boardId])

  // 컴포넌트가 마운트될 때 fetchBoard 함수를 호출하여 게시물 데이터를 로드
  useEffect(() => {
    fetchBoard()
  }, [fetchBoard])

  // 입력 필드 값이 변경될 때 상태를 업데이트하는 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  // 이미지 파일이 변경될 때 상태를 업데이트하고 미리보기를 생성하는 함수
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)

    // 업로드된 파일들의 미리보기를 생성하여 상태에 저장
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  // 게시물 수정 요청을 처리하는 비동기 함수
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // 폼 데이터를 전송하기 위한 FormData 객체 생성
    const formDataToSend = new FormData()
    formDataToSend.append('board', JSON.stringify(formData)) // JSON 형식으로 직렬화된 게시물 데이터를 추가
    images.forEach((image) => {
      formDataToSend.append('images', image) // 이미지 파일들을 FormData에 추가
    })

    try {
      // PUT 요청으로 게시물 수정 요청을 전송
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`, // 인증 토큰을 헤더에 포함
        },
        body: formDataToSend, // 폼 데이터를 요청 본문으로 전송
      })

      // 응답이 성공적이지 않을 경우 오류를 발생시킴
      if (!response.ok) {
        const errorMessage = await response.text()
        throw new Error(`게시물 수정에 실패했습니다: ${errorMessage}`)
      }

      // 수정 성공 메시지를 상태에 저장하고, 2초 후에 해당 게시물 페이지로 이동
      setSuccess('게시물이 성공적으로 수정되었습니다.')
      setTimeout(() => navigate(`/boards/${boardId}`), 2000)
    } catch (error) {
      setError(error.message) // 오류가 발생하면 error 상태에 저장
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">게시물 수정</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="title"
              placeholder="제목"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <textarea
              name="content"
              placeholder="내용"
              value={formData.content}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">이미지</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="grid grid-cols-3 gap-2 mt-4">
              {imagePreviews.map((preview, index) => (
                <img key={index} src={preview} alt={`preview-${index}`} className="w-full h-auto object-cover rounded-md" />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            수정
          </button>
        </form>
      </div>
    </div>
  )
}
