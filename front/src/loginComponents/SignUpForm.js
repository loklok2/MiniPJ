import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// API 기본 URL 설정: 환경 변수에서 가져오거나 기본값으로 로컬호스트 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export default function SignUpForm({ onSignUp }) {
  // useRef를 사용하여 이메일, 비밀번호, 닉네임 입력 필드의 값을 참조
  const emailRef = useRef();
  const passwordRef = useRef();
  const nicknameRef = useRef();

  // 상태 관리를 위해 useState를 사용하여 로딩 상태, 오류 메시지, 성공 메시지를 관리
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  // 회원가입 폼 제출 시 호출되는 함수
  const handleSignUp = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작을 방지
    setStatus({ loading: true, error: '', success: '' }); // 로딩 상태로 변경, 이전 오류 및 성공 메시지 초기화

    // 입력 필드에서 값 가져오기
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const nickname = nicknameRef.current.value;

    // 입력 필드 유효성 검사
    if (!email || !password || !nickname) {
      setStatus({
        loading: false,
        error: '빈 곳을 입력하세요.',
        success: ''
      });
      return;
    }

    try {
      // 회원가입 API 요청
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password, nickname }), // JSON 형식으로 데이터 전송
      });

      if (!response.ok) {
        throw new Error('회원가입에 실패했습니다. 정보를 확인해 주세요.'); // 오류 발생 시 에러 메시지 설정
      }

      const data = await response.json(); // 서버에서 반환된 데이터 파싱

      setStatus({
        loading: false,
        error: '',
        success: '이메일을 확인하여 인증을 완료해 주세요.' // 성공 메시지 설정
      });

      onSignUp({ email: data.email, nickname: data.nickname }); // 상위 컴포넌트로 회원가입 정보 전달
    } catch (err) {
      setStatus({
        loading: false,
        error: err.message,
        success: '' // 오류 발생 시 오류 메시지 설정
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
        {/* 오류 또는 성공 메시지를 화면에 표시 */}
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
              placeholder="닉네임을 입력하세요"
              required
              className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${status.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={status.loading} // 로딩 상태일 때 버튼 비활성화
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
