import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginForm({ onLogin }) {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [oauth2Url, setOauth2Url] = useState({})
    const [error, setError] = useState();
    const { login } = useAuth();    // useAuth 훅을 사용하여 login 함수를 가져옴
    const navigate = useNavigate()

    useEffect(() => {
        // 서버로부터 OAuth2 공급자 URL을 가져옴
        const fetchOAuth2Urls = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/auth/oauth2-urls')

                if (response.ok) {
                    const data = await response.json()
                    setOauth2Url(data)
                } else {
                    setError("OAuth2 공급자 URL을 가져오는 중 오류가 발생했습니다.")
                }
            } catch (error) {
                setError("네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.")
            }
        }

        fetchOAuth2Urls()
    }, [])

    const handleSignIn = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setError();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        if (email === '') {
            setError('이메일을 입력하세요.');
            emailRef.current.focus();
            return;
        }

        if (password === '') {
            setError('비밀번호를 입력하세요.');
            passwordRef.current.focus();
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password }),
            });

            if (response.status === 400) {
                setError('잘못된 요청입니다. 입력 값을 확인하세요.')
                return
            } else if (response.status === 401) {
                setError('인증에 실패했습니다. 이메일과 비밀번호를 확인하세요.')
                return
            } else if (response.status === 500) {
                setError('서버 오류가 발생했습니다. 잠시 후 다시 시도하세요.')
                return
            }

            const data = await response.json();

            if (data.token) {
                // 로그인 성공
                login({
                    id: data.id, // 서버에서 전달된 사용자 ID
                    username: data.username,
                    nickname: data.nickname,
                    token: data.token,
                });   // login 함수를 호출하여 상태를 업데이트하고 localStorage에 저장
                onLogin(data)   // 상위 컴포넌트에 로그인 정보 전달
                navigate('/');   // 로그인 후 홈으로 리디렉션
            } else {
                setError('로그인 실패. 이메일과 비밀번호를 확인하세요.');
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하거나 나중에 다시 시도하세요.');
        }
    }

    const handleOAuth2Login = (provider) => {
        if (oauth2Url[provider]) {
            window.location.href = oauth2Url[provider]  // 해당 OAuth2 공급자 URL로 리디렉션
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
                    onClick={() => handleOAuth2Login('google')}
                >
                    <i className="fab fa-google mx-2"></i>Google 로그인
                </button>
                <button
                    className="w-full py-2 px-4 mb-2 bg-green-500 text-white 
                               rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    onClick={() => handleOAuth2Login('naver')}
                >
                    <i className="fab fa-nav mx-2"></i>Naver 로그인
                </button>
                <button
                    className="w-full py-2 px-4 mb-4 bg-yellow-500 text-white 
                               rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                    onClick={() => handleOAuth2Login('kakao')}
                >
                    <i className="fab fa-kakao mx-2"></i>Kakao 로그인
                </button>
            </div>
        </div>
    );
}