import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUpForm({ onSignUp }) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const nicknameRef = useRef();
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleSignUp = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const nickname = nicknameRef.current.value;

    if (!email || !password || !nickname) {
      setStatus({
        loading: false,
        error: '빈 곳을 입력하세요.',
        success: ''
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password, nickname }),
      });

      if (!response.ok) {
        throw new Error('회원가입에 실패했습니다. 정보를 확인해 주세요.');
      }

      const data = await response.json();

      setStatus({
        loading: false,
        error: '',
        success: '이메일을 확인하여 인증을 완료해 주세요.'
      });

      onSignUp({ email: data.email, nickname: data.nickname });
    } catch (err) {
      setStatus({
        loading: false,
        error: err.message,
        success: ''
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
        {status.error && <div className="p-3 mb-4 rounded bg-red-100 text-red-700 border border-red-300">{status.error}</div>}
        {status.success && <div className="p-3 mb-4 rounded bg-green-100 text-green-700 border border-green-300">{status.success}</div>}
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              id="email"
              type="email"
              ref={emailRef}
              placeholder="email@domain.com"
              required
              className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
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
              className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">닉네임</label>
            <input
              id="nickname"
              type="text"
              ref={nicknameRef}
              placeholder="nickname"
              required
              className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${status.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={status.loading}
          >
            {status.loading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>
        <Link to="/login">
          <button
            className="w-full py-2 px-4 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            로그인 페이지
          </button>
        </Link>
      </div>
    </div>
  );
}
