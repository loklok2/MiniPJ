import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

/*
서버로부터 OAuth2 인증 후 리디렉션된 URL을 처리합니다. 
서버가 JWT 토큰을 query parameter로 전달하면 이를 받아 클라이언트 측에서 처리하고, 로그인 상태를 업데이트
*/
export default function OAuth2RedirectHandler() {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    // URLSearchParams를 사용하여 URL의 쿼리 파라미터를 추출
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token') // 서버에서 제공하는 JWT 토큰
    const error = params.get('error')

    if (token) {
      // JWT 토큰이 존재하면 로그인 처리
      const decodedToken = jwtDecode(token); // 토큰을 디코딩하여 사용자 정보 추출
      login({
        token,
        id: decodedToken.id, // 디코딩한 토큰에서 사용자 ID 추출
        username: decodedToken.username,
        nickname: decodedToken.nickname,
      });
    } else if (error) {
      console.error("OAuth2 에러:", error);
      // navigate('/login');  // 로그인 페이지로 리디렉션
    }

  }, [login, navigate])
    
  return null
}
