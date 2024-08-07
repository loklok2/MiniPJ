import LoginForm from "../components/LoginForm";
import Loginout from "../components/Loginout";
import { useRecoilState } from "recoil";
import { stLogin } from "../components/StAtom";
import { useEffect, useState } from "react";  // 회원가입 폼 표시 상태
import SignUpForm from "../components/SignUpForm";

export default function Login() {
  const [user, setUser] = useState();
  const [isLogin, setIsLogin] = useRecoilState(stLogin);
  const [isSignUp, setIsSingUp] = useState(false);  // 회원가입 폼 표시 상태

  const handleLogin = (userIn) => {
    localStorage.setItem('user', userIn);
    setUser(userIn);
    setIsLogin(true);
  }

  const handleSignUp = (userIn) => {
    localStorage.setItem('user', userIn)
    setUser(userIn);
    setIsLogin(true);
    setIsSingUp(false); // 회원가입 후 로그인 폼으로 돌아가기
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsLogin(false);
  }

  useEffect(() => {
    const tmUser = localStorage.getItem('user');

    if (tmUser) {
      setUser(tmUser);
      setIsLogin(true);
    }
    else setIsLogin(false);

  }, [setIsLogin])

  return (
    <div className="w-full h-full 
                    flex flex-col justify-center items-center">
      {user ? (
        <Loginout user={user} onLogout={handleLogout} />
      ) : isSignUp ? (
        <SignUpForm onSignUp={handleSignUp} />
      ) : (
        <div>
          <LoginForm onLogin={handleLogin} />
        </div>
      )}
    </div>
  )
}