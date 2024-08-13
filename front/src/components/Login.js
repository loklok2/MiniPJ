import React, { useEffect, useState } from 'react'
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
  }

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
    </div>
  )
}
