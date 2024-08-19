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
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const error = params.get('error')

    if (token) {
      login({ token })
      navigate('/')
    } else if (error) {
      console.error("OAuth2 에러:", error)
      navigate('/login')
    }

  }, [login, navigate])
    
  return null
}
