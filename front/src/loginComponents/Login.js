import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import MyPage from '../pages/MyPage'

export default function Login({ onLogin }) {
  const { auth, login } = useAuth()  // useAuth 훅 사용
  const [isSignUp, setIsSignUp] = useState(false)

  const handleLogin = (userIn) => {
    login(userIn); // login 함수를 통해 상태를 업데이트
    onLogin(userIn)
  }

  const handleSignUp = (userIn) => {
    login({ ...userIn, token: '' }) // 회원가입 후 로그인 상태를 업데이트
    setIsSignUp(false) // 회원가입 후 로그인 폼으로 돌아가기
  }

  useEffect(() => {
    const storedAuthState = localStorage.getItem('authState');
    if (storedAuthState) {
      const parsedAuthState = JSON.parse(storedAuthState);
      login(parsedAuthState.user); // storedAuthState에서 user 정보를 추출해 로그인 상태 복원
    }
  }, [login])

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {auth.isLoggedIn ? (
        <MyPage user={auth.user} />
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
