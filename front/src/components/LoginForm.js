import { useState, useRef } from "react";
import { Link } from 'react-router-dom';

export default function LoginForm({ onLogin }) {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState('');

    const handleSignIn = (e) => {
        e.preventDefault();

        // Clear previous errors
        setError('');

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

        fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password: password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    // 로그인 성공
                    localStorage.setItem('token', data.token); // token 저장
                    onLogin(email); // 로그인 성공 시 부모 컴포넌트로 사용자 정보를 전달
                } else {
                    // 서버에서 받은 오류메시지 처리
                    setError('이메일 인증 절차를 진행하십시오.');
                }
            })
            .catch(err => {
                setError('로그인 실패. 이메일 아이디와 비밀번호를 확인하십시오.');
            });
    };

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
                <Link to="/signup">
                    <button
                        className="w-full py-2 px-4 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        회원가입
                    </button>
                </Link>

                <div className="flex items-center my-4">
                    <hr className="flex-grow border-gray-300" />
                    <p className="text-xl font-bold text-center mx-4">소셜 로그인</p>
                    <hr className="flex-grow border-gray-300" />
                </div>

                <button
                    className="w-full py-2 px-4 mb-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    onClick={() => alert('Google OAuth2 로그인')}
                >
                    <i className="fab fa-google mx-2"></i>
                    Google 로그인
                </button>
                <button
                    className="w-full py-2 px-4 mb-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={() => alert('Naver OAuth2 로그인')}
                >
                    <i className="fab fa-nav mx-2"></i>
                    Naver 로그인
                </button>
                <button
                    className="w-full py-2 px-4 mb-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                    onClick={() => alert('Kakao OAuth2 로그인')}
                >
                    <i className="fab fa-kakao mx-2"></i>
                    Kakao 로그인
                </button>
            </div>
        </div>
    );
}
