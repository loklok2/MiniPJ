import { useState, useRef } from "react";

export default function LoginForm({ onLogin }) {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState('');

    const handleSignIn = (e) => {
        e.preventDefault();
        // Clear previous errors
        setError('');
        
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        if (username === '') {
            setError('이메일을 입력하세요.');
            usernameRef.current.focus();
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
            body: JSON.stringify({ username: username, password: password }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.');
                }
                return response.json();
            })
            .then(data => {
                onLogin(username); // 로그인 성공 시 부모 컴포넌트로 사용자 정보를 전달
            })
            .catch(err => {
                console.error('Fetch error:', err); // 오류 로그 추가
                setError(err.message);
            });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-center text-2xl font-bold mb-4">로그인</h1>
                {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
                <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Your username</label>
                        <input
                            type="text"
                            ref={usernameRef}
                            placeholder="username"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="mt-3">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            ref={passwordRef}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Sign in
                    </button>
                </form>
                <button
                    className="w-full py-2 mt-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    onClick={() => alert('회원가입 페이지로 이동')}
                >
                    Sign Up
                </button>
                <div className="flex items-center my-4">
                    <hr className="flex-grow border-t" />
                    <p className="mx-3 text-gray-600 font-semibold">OR</p>
                    <hr className="flex-grow border-t" />
                </div>
                <button
                    className="w-full py-2 mb-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => alert('Google OAuth2 로그인')}
                >
                    <i className="fab fa-google mx-2"></i>
                    Sign in with Google
                </button>
                <button
                    className="w-full py-2 mb-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={() => alert('Naver OAuth2 로그인')}
                >
                    <i className="fab fa-naver mx-2"></i>
                    Sign in with Naver
                </button>
                <button
                    className="w-full py-2 mb-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    onClick={() => alert('Kakao OAuth2 로그인')}
                >
                    <i className="fab fa-kakao mx-2"></i>
                    Sign in with Kakao
                </button>
            </div>
        </div>
    );
}
