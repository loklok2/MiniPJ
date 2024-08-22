import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// API 기본 URL 설정: 환경 변수에서 가져오거나 기본값으로 로컬호스트 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'

export default function LoginForm({ onLogin }) {
    const { login } = useAuth()    // useAuth 훅을 사용하여 login 함수를 가져옴
    const emailRef = useRef() // 이메일 입력 필드를 참조하기 위한 useRef 훅
    const passwordRef = useRef() // 비밀번호 입력 필드를 참조하기 위한 useRef 훅
    const [error, setError] = useState(null) // 오류 메시지를 저장하는 상태
    const navigate = useNavigate() // 페이지 이동을 위한 useNavigate 훅

    // 로그인 폼 제출 처리 함수
    const handleSignIn = async (e) => {
        e.preventDefault() // 폼의 기본 제출 동작을 방지

        setError(null) // 기존 오류 메시지를 초기화

        const email = emailRef.current.value // 이메일 입력 필드의 현재 값을 가져옴
        const password = passwordRef.current.value // 비밀번호 입력 필드의 현재 값을 가져옴

        // 이메일이 비어 있을 경우 오류 메시지를 설정하고 이메일 필드에 포커스
        if (email === '') {
            setError('이메일을 입력하세요.')
            emailRef.current.focus()
            return
        }

        // 비밀번호가 비어 있을 경우 오류 메시지를 설정하고 비밀번호 필드에 포커스
        if (password === '') {
            setError('비밀번호를 입력하세요.')
            passwordRef.current.focus()
            return
        }

        try {
            // 서버에 로그인 요청을 전송
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password }), // JSON 형식으로 사용자 입력을 전송
            })

            // 응답 상태에 따라 오류 메시지 설정
            if (response.status === 400) {
                setError('잘못된 요청입니다. 입력 값을 확인하세요.')
                return
            } else if (response.status === 401) {
                setError('인증에 실패했습니다. 이메일과 비밀번호를 확인하세요.')
                return
            } else if (response.status === 409) {  // 이메일 중복 에러 처리
                setError('이 이메일은 이미 사용 중입니다.')
                return
            } else if (response.status === 500) {
                setError('서버 오류가 발생했습니다. 잠시 후 다시 시도하세요.')
                return
            }

            // 응답 데이터를 JSON 형식으로 파싱
            const data = await response.json()
            console.log("Received data:", data) // 응답 데이터를 로그로 출력

            // 토큰이 있을 경우 로그인 처리 및 홈으로 리디렉션
            if (data.token) {
                login({
                    id: data.user?.id || "", // 유연하게 처리: ID가 없으면 빈 문자열
                    username: data.user?.username || email, // 유연하게 처리: username이 없으면 이메일 사용
                    nickname: data.user?.nickname || "", // 유연하게 처리: nickname이 없으면 빈 문자열
                    token: data.token,
                })
                onLogin(data)   // 상위 컴포넌트에 로그인 정보 전달
                navigate('/')   // 로그인 후 홈으로 리디렉션
            } else {
                setError('로그인 실패. 이메일과 비밀번호를 확인하세요.')
            }
        } catch (err) {
            // 네트워크 오류 발생 시 오류 메시지 설정
            setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하거나 나중에 다시 시도하세요.')
        }
    }

    // OAuth2 로그인 처리 함수
    const handleOAuth2Login = (provider) => {
        const oauth2Url = {
            Google: 'http://localhost:8080/oauth2/authorization/google',
            Naver: 'http://localhost:8080/oauth2/authorization/naver',
            Kakao: 'http://localhost:8080/oauth2/authorization/kakao',
        }

        console.log("Provider: ", provider) // provider 값을 로그로 출력하여 확인
        console.log("OAuth2 URLs: ", oauth2Url) // oauth2Url 객체를 로그로 출력하여 확인

        // 선택된 OAuth2 제공자 URL로 리디렉션
        if (oauth2Url[provider]) {
            window.location.href = oauth2Url[provider]
        } else {
            setError(`${provider} 로그인 URL을 불러오지 못 했습니다.`)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">{error}</div>}

                <form onSubmit={handleSignIn}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
                        <input
                            id="email"
                            type="email"
                            ref={emailRef}
                            placeholder="email@domain.com"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            ref={passwordRef}
                            placeholder="••••••••"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        로그인
                    </button>
                </form>

                <div className="mt-6 space-y-4">
                    <Link to="/signup">
                        <button
                            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            회원가입
                        </button>
                    </Link>

                    <div className="flex justify-between space-x-4">
                        <Link to="/emailfind" className="w-full">
                            <button
                                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                아이디 찾기
                            </button>
                        </Link>
                        <Link to="/passwordfind" className="w-full">
                            <button
                                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                비밀번호 찾기
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center my-4">
                    <hr className="flex-grow border-gray-300" />
                    <p className="text-xl font-bold text-center mx-4">소셜 로그인</p>
                    <hr className="flex-grow border-gray-300" />
                </div>

                <button
                    className="w-full py-2 px-4 mb-2 bg-red-500 text-white 
                               rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    onClick={() => handleOAuth2Login('Google')}
                >
                    Google 로그인
                </button>
                <button
                    className="w-full py-2 px-4 mb-2 bg-green-500 text-white 
                               rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    onClick={() => handleOAuth2Login('Naver')}
                >
                    Naver 로그인
                </button>
                <button
                    className="w-full py-2 px-4 mb-4 bg-yellow-500 text-white 
                               rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                    onClick={() => handleOAuth2Login('Kakao')}
                >
                    Kakao 로그인
                </button>
            </div>
        </div>
    )
}
