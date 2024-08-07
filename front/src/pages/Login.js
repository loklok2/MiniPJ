import React, { useEffect, useState } from 'react';
import LoginForm from "../components/LoginForm";
import { useRecoilState } from "recoil";
import { stLogin } from "../components/StAtom";
import SignUpForm from "../components/SignUpForm";
import MyPage from "../components/MyPage";

export default function Login() {
  const [user, setUser] = useState();
  const [isLogin, setIsLogin] = useRecoilState(stLogin);
  const [isSignUp, setIsSignUp] = useState(false);  // 회원가입 폼 표시 상태

  const handleLogin = (userIn) => {
    setUser(userIn);
    setIsLogin(true);
  }

  const handleSignUp = (userIn) => {
    localStorage.setItem('user', userIn);
    setUser(userIn);
    setIsLogin(true);
    setIsSignUp(false); // 회원가입 후 로그인 폼으로 돌아가기
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }

  }, [setIsLogin]);

  return (
    <div className="w-full h-full 
                    flex flex-col justify-center items-center">
      {isLogin ? (
        <MyPage />
      ) : isSignUp ? (
        <SignUpForm onSignUp={handleSignUp} />
      ) : (
        <div>
          <LoginForm onLogin={handleLogin} />
          <button
            onClick={() => setIsSignUp(true)}
            className="mt-4 bg-blue-500 text-white 
                       py-2 px-4 rounded hover:bg-blue-600 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            회원가입
          </button>
        </div>
      )}
    </div>
  );
}
