import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// API 기본 URL 설정: 환경 변수에서 가져오거나 기본값으로 로컬호스트 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'

export default function BoardForm() {
    const { auth, logout } = useAuth()  // useAuth 훅에서 인증 정보와 로그아웃 함수를 가져옴
    const [title, setTitle] = useState('')  // 게시물 제목을 저장하는 상태
    const [content, setContent] = useState('')  // 게시물 내용을 저장하는 상태
    const [images, setImages] = useState([])  // 업로드된 이미지 파일들을 저장하는 상태
    const [success, setSuccess] = useState(null)  // 성공 메시지를 저장하는 상태
    const [error, setError] = useState(null)  // 오류 메시지를 저장하는 상태
    const [loading, setLoading] = useState(true)  // 로딩 상태를 관리하는 상태
    const navigate = useNavigate()  // 페이지 이동을 위한 useNavigate 훅

    // 로그인 상태 확인 및 로딩 상태 관리
    useEffect(() => {
        if (!auth.isLoggedIn) {
            navigate('/login') // 사용자가 로그인되지 않은 경우 로그인 페이지로 리디렉션
        } else {
            setLoading(false) // 로그인된 경우 로딩 상태 해제
        }
    }, [auth, navigate])

    // 이미지 파일이 변경될 때 상태를 업데이트하는 함수
    const handleImageChange = (e) => {
        setImages(e.target.files)  // 선택된 파일들을 images 상태에 저장
    }

    // 폼 제출 시 호출되는 함수
    const handleSubmit = async (e) => {
        e.preventDefault()  // 폼의 기본 제출 동작을 방지
        setError(null)  // 이전 오류 메시지를 초기화

        // 서버로 보낼 FormData 객체 생성
        const formData = new FormData()
        formData.append('board', new Blob([JSON.stringify({
            title,
            content,
            authorNickname: auth.user.nickname  // 게시물 작성자의 닉네임 추가
        })], { type: 'application/json' }))

        // 업로드된 이미지 파일들을 FormData에 추가
        Array.prototype.forEach.call(images, (image) => {
            formData.append('images', image)
        })

        try {
            // 서버에 POST 요청을 보내어 게시물 생성
            const response = await fetch(`${API_BASE_URL}/boards/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,  // JWT 토큰을 헤더에 추가하여 인증
                },
                body: formData,  // FormData 객체를 요청 본문으로 전달
            })

            if (response.status === 401) {
                logout()  // 인증 만료 시 자동 로그아웃
                throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.')
            }

            if (!response.ok) {
                const errorMessage = await response.text()  // 서버에서 반환하는 오류 메시지 가져오기
                throw new Error(`게시물 작성에 실패했습니다: ${errorMessage}`)
            }

            setSuccess('게시물이 성공적으로 작성되었습니다.')
            navigate('/boards')  // 게시물 작성 후 즉시 게시판 페이지로 리디렉션
        } catch (error) {
            setError(error.message)  // 오류 발생 시 오류 메시지 설정
            console.error('게시물 작성 실패:', error)
        }
    }

    // 로딩 상태일 때 표시할 UI
    if (loading) {
        return <div>Loading...</div>  // 로딩 중일 때 표시
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
                <h2 className='text-2xl font-bold text-center mb-4'>게시물 작성</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <input
                            type='text'
                            placeholder='제목'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className='mt-1 block w-full border 
                                     border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                    </div>
                    <div className='mb-4'>
                        <textarea
                            placeholder='내용'
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className='mt-1 block w-full border 
                                     border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                    </div>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange} // 이미지 파일 선택 시 상태 업데이트
                        className='mb-4'
                    />
                    <button
                        type='submit'
                        className='w-full py-2 px-4 bg-blue-500 
                                 text-white rounded-md hover:bg-blue-600  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                    >
                        작성
                    </button>
                </form>
            </div>
        </div>
    )
}
