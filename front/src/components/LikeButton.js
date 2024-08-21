import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// API 기본 URL 설정: 환경 변수에서 가져오거나 기본값으로 로컬호스트 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'

export default function LikeButton({ boardId, commentId, likeCount, onLike }) {
    // React Router의 useNavigate 훅을 사용하여 페이지 이동 기능을 제공
    const navigate = useNavigate()

    // 사용자 인증 및 로그아웃 기능을 제공하는 useAuth 훅에서 auth와 logout 상태를 가져옴
    const { auth, logout } = useAuth()

    // '좋아요' 버튼 클릭 시 호출되는 함수
    const handleLike = async (e) => {
        e.stopPropagation() // 클릭 이벤트가 부모 요소로 전파되는 것을 방지

        // 사용자가 로그인되어 있지 않은 경우 로그인 페이지로 리디렉션
        if (!auth.token) {
            console.error('사용자가 로그인되지 않았습니다. 로그인 페이지로 리디렉션합니다.')
            navigate('/login') // 로그인 페이지로 이동
            return
        }

        try {
            // 게시글(boardId) 또는 댓글(commentId)에 따라 좋아요 요청 URL을 동적으로 설정
            const url = boardId
                ? `${API_BASE_URL}/boards/${boardId}/like` // 게시글에 대한 좋아요 요청 URL
                : `${API_BASE_URL}/comments/${commentId}/like` // 댓글에 대한 좋아요 요청 URL

            // 서버에 '좋아요' 요청을 보내는 fetch 함수 호출
            const response = await fetch(url, {
                method: 'POST', // POST 요청으로 좋아요를 증가시킴
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`, // JWT 토큰을 Authorization 헤더에 포함
                }
            })

            // JWT 토큰이 만료되었거나 유효하지 않은 경우 로그인 페이지로 리디렉션
            if (response.status === 401 || response.status === 500) {
                console.error('JWT 토큰이 만료되었거나 유효하지 않습니다. 로그인 페이지로 리디렉션합니다.')
                logout() // 로그아웃 처리
                navigate('/login')  // 로그인 페이지로 리디렉션
                return
            }

            // 요청이 성공하지 않은 경우 오류를 발생시킴
            if (!response.ok) {
                throw new Error('좋아요 증가에 실패했습니다.')
            }

            // 서버에서 반환된 업데이트된 게시물 데이터를 가져옴
            const updatedBoard = await response.json()

            // 부모 컴포넌트에 업데이트된 게시물 정보를 전달하여 상태를 업데이트
            onLike(updatedBoard)
        } catch (error) {
            console.error('좋아요 증가 실패:', error)
            alert('좋아요 증가에 실패했습니다.') // 오류 발생 시 사용자에게 알림
        }
    }

    return (
        <button
            onClick={handleLike} // 버튼 클릭 시 handleLike 함수 실행
            className="flex items-center space-x-1 bg-gradient-to-r from-pink-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <span>❤️</span> {/* 좋아요 아이콘 */}
            <span>{likeCount}</span> {/* 좋아요 개수 */}
        </button>
    )
}
