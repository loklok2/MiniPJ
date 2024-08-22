import { useEffect } from 'react' // React의 useEffect 훅을 사용하여 컴포넌트의 생명주기 관리
import { useNavigate } from 'react-router-dom' // 리액트 라우터의 useNavigate 훅을 사용하여 페이지 이동 처리
import { useAuth } from '../hooks/useAuth' // 사용자 인증 정보를 관리하는 커스텀 훅을 사용

export default function OAuth2RedirectHandler() {
    const navigate = useNavigate() // 페이지 이동을 위한 네비게이트 함수 생성
    const { login } = useAuth() // 사용자 인증 처리 함수 가져오기

    /**
     * OAuth2 로그인 성공 처리 함수
     * @param {Object} data - OAuth2 로그인으로부터 전달된 사용자 데이터
     * @param {string} data.token - 인증 토큰
     * @param {string} data.id - 사용자 ID
     * @param {string} data.username - 사용자 이름
     * @param {string} data.nickname - 사용자 별명
     */
    const handleOAuth2LoginSuccess = (data) => {
        const { token, id, username, nickname } = data // 전달된 사용자 데이터 구조 분해

        console.log("OAuth2 로그인 성공:", data)  // 로그인 성공 시 콘솔에 데이터 출력

        login({
            id,
            username,
            nickname,
            token,
        }) // 로그인 처리: 사용자 데이터와 토큰을 저장

        navigate('/mypage') // 로그인 후 마이페이지로 리디렉션
    }

    useEffect(() => {
        // URL에서 쿼리 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token') // OAuth2 인증 토큰
        const id = urlParams.get('id') // 사용자 ID
        const username = urlParams.get('username') // 사용자 이름
        const nickname = urlParams.get('nickname') // 사용자 별명

        console.log("URL Params:", { token, id, username, nickname }) // 추출된 파라미터를 콘솔에 출력

        if (token) {
            // 토큰이 존재하면 로그인 성공 처리
            handleOAuth2LoginSuccess({ token, id, username, nickname })
        } else {
            // 토큰이 없으면 로그인 실패로 간주하고 로그인 페이지로 리디렉션
            navigate('/login')
        }
    }, []) // 컴포넌트가 마운트될 때 한 번 실행

    return null // 이 컴포넌트는 화면에 아무것도 렌더링하지 않음
}
