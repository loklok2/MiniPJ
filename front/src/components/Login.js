import LoginForm from "./LoginForm" ;
import Loginout from "./Loginout";
import { useRecoilState } from "recoil";
import { stLogin } from "./StAtom";
import { useEffect, useState } from "react";

export default function Login() {
  const [user, setUser] = useState() ;
  const [isLogin, setIsLogin] = useRecoilState(stLogin) ;

  const handleLogin = (userIn) => {
    localStorage.setItem('user', userIn) ;      
    setUser(userIn) ;
    setIsLogin(true) ;
  }

  const handleLogout = () => {
    localStorage.removeItem('user') ;      
    setUser(null) ;
    setIsLogin(false) ;
  }

  useEffect(()=>{
    const tmUser = localStorage.getItem('user') ;
   
    if (tmUser) {
      setUser(tmUser) ;
      setIsLogin(true) ;
    }
    else  setIsLogin(false) ;

  }, [setIsLogin])

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      { user ? <Loginout user={user} onLogout ={handleLogout} /> 
             : <LoginForm onLogin={handleLogin} />
      }       
    </div>
  )
}