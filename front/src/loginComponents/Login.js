import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { authState } from '../atoms/authAtom'

import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import MyPage from '../pages/MyPage'

export default function Login({ onLogin }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(authState);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = (userIn) => {
    setUser(userIn);
    onLogin(userIn);
    setIsLoggedIn({ isLoggedIn: true, token: userIn.token, user: userIn });
    localStorage.setItem('token', userIn.token); // JWT토큰을 로컬스토리지에 저장
  };

  const handleSignUp = (userIn) => {
    localStorage.setItem('user', JSON.stringify(userIn));
    setUser(userIn);
    setIsLoggedIn({ isLoggedIn: true, token: '', user: userIn });
    setIsSignUp(false); // 회원가입 후 로그인 폼으로 돌아가기
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn({ isLoggedIn: true, token });
    } else {
      setIsLoggedIn({ isLoggedIn: false });
    }
  }, [setIsLoggedIn])

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {isLoggedIn.isLoggedIn ? (
        <MyPage />
      ) : isSignUp ? (
        <SignUpForm onSignUp={handleSignUp} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
      <button
        className="mt-4 text-blue-500 hover:underline"
        onClick={() => setIsSignUp((prev) => !prev)}
      >
        {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
      </button>
    </div>
  )
}
