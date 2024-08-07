import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUpForm({ onSignUp }) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const nicknameRef = useRef();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();

    // Clear previous errors
    setError('');
    setSuccess('');

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const nickname = nicknameRef.current.value;

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

    if (nickname === '') {
      setError('닉네임을 입력하세요.');
      nicknameRef.current.focus();
      return;
    }

    fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password: password, nickname: nickname }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('회원가입에 실패했습니다. 정보를 확인해 주세요.');
        }
        return response.json();
      })
      .then(() => {
        setSuccess('이메일을 확인하여 인증을 완료해 주세요.');
        onSignUp(email); // 회원가입 성공 시 부모 컴포넌트로 사용자 정보를 전달
      })
      .catch(err => {
        setError(err.message);
      });
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-lg p-8 bg-white rounded-lg shadow-lg'>
        <h1 className='text-2xl font-bold text-center mb-6'>회원가입</h1>
        {error && <div className='p-3 mb-4 rounded bg-red-100 text-red-700 border border-red-300'>{error}</div>}
        {success && <div className='p-3 mb-4 rounded bg-green-100 text-green-700 border border-green-300'>{success}</div>}
        <form onSubmit={handleSignUp}>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>이메일</label>
            <input
              id='email'
              type='text'
              ref={emailRef}
              placeholder='email@domain.com'
              required
              className='w-full mt-1 block border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>비밀번호</label>
            <input
              id='password'
              type='password'
              ref={passwordRef}
              placeholder='••••••••'
              required
              className='w-full mt-1 block border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='nickname' className='block text-sm font-medium text-gray-700'>닉네임</label>
            <input
              id='nickname'
              type='text'
              ref={nicknameRef}
              placeholder='nickname'
              required
              className='w-full mt-1 block border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            />
          </div>

          <button type='submit'
            className='w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'>
            회원가입
          </button>
        </form>
        <Link to="/login">
          <button
            className='w-full py-2 px-4 mt-4 bg-blue-500 text-white rounded-md
                         hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'>
            로그인 페이지
          </button>
        </Link>
      </div>
    </div>
  );
}
