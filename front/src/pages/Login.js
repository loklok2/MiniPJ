import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

import LoginForm from '../loginComponents/LoginForm'
import SignUpForm from '../loginComponents/SignUpForm'
import MyPage from './MyPage'

export default function Login({ onLogin }) {
  // useAuth 훅을 사용하여 인증 상태와 로그인 함수를 가져옴
  const { auth, login } = useAuth()

  // isSignUp 상태는 회원가입 폼과 로그인 폼을 전환하는 역할을 함
  const [isSignUp, setIsSignUp] = useState(false)

  // 로그인 시 호출되는 함수, 로그인 상태를 업데이트하고 상위 컴포넌트에 로그인된 사용자 정보를 전달
  const handleLogin = (userIn) => {
    login(userIn) // login 함수를 통해 상태를 업데이트
    onLogin(userIn) // 로그인된 사용자 정보를 상위 컴포넌트로 전달
  }

  // 회원가입 시 호출되는 함수, 회원가입 후 로그인 상태를 업데이트하고 로그인 폼으로 돌아감
  const handleSignUp = (userIn) => {
    login({ ...userIn, token: '' }) // 회원가입 후 로그인 상태를 업데이트, 초기 상태로 빈 토큰을 설정
    setIsSignUp(false) // 회원가입 후 로그인 폼으로 돌아가기 위해 isSignUp 상태를 false로 설정
  }

  // 컴포넌트가 마운트될 때 로컬 스토리지에 저장된 인증 상태를 복원
  useEffect(() => {
    const storedAuthState = localStorage.getItem('authState')
    if (storedAuthState) {
      const parsedAuthState = JSON.parse(storedAuthState)
      login(parsedAuthState.user) // storedAuthState에서 user 정보를 추출해 로그인 상태 복원
    }
  }, [login])

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {/* 로그인 상태에 따라 MyPage, 회원가입 폼, 로그인 폼을 조건부로 렌더링 */}
      {auth.isLoggedIn ? (
        <MyPage user={auth.user} />
      ) : isSignUp ? (
        <SignUpForm onSignUp={handleSignUp} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  )
}
