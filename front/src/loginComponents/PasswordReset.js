import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// API 기본 URL 설정: 환경 변수에서 가져오거나 기본값으로 로컬호스트 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'

export default function PasswordReset() {
    // 인증 관련 함수(로그아웃 등)를 가져오는 커스텀 훅
    const { logout } = useAuth()
    // 새로운 비밀번호 입력을 위한 상태 변수
    const [newPassword, setNewPassword] = useState('')
    // 비밀번호 재설정의 상태(success, error 등)를 저장하는 상태 변수
    const [status, setStatus] = useState(null)
    // 로딩 상태를 관리하기 위한 상태 변수
    const [loading, setLoading] = useState(false)
    // 현재 페이지의 URL 정보에 접근하기 위한 훅
    const location = useLocation()
    // 페이지 이동을 위한 훅
    const navigate = useNavigate()
    // URLSearchParams를 사용하여 쿼리 파라미터에서 토큰을 가져옴
    const query = new URLSearchParams(location.search)
    // 'token'이라는 이름의 쿼리 파라미터 값을 가져옴
    const resetToken = query.get('token')

    // 비밀번호 재설정 요청을 처리하는 함수
    const handlePasswordReset = async () => {
        // 새 비밀번호가 입력되지 않은 경우 오류 상태로 설정하고 함수 종료
        if (!newPassword) {
            setStatus('error')
            return
        }

        setLoading(true) // 로딩 상태를 true로 설정

        try {
            // 서버에 비밀번호 재설정 요청을 보냄
            const response = await fetch(`${API_BASE_URL}/auth/reset-password-form`, {
                method: 'POST', // HTTP POST 메소드 사용
                headers: {
                    'Content-Type': 'application/json', // 요청 본문이 JSON 형식임을 명시
                },
                // 요청 본문에 토큰과 새 비밀번호를 JSON 형식으로 포함
                body: JSON.stringify({ token: resetToken, newPassword }),
            })

            // 서버 응답이 성공적인 경우
            if (response.ok) {
                setStatus('success') // 상태를 성공으로 설정
                logout()  // 비밀번호 재설정이 성공하면 로그아웃 처리
            } else {
                // 서버 응답이 실패한 경우, 오류 메시지를 상태에 설정
                const errorData = await response.text()
                setStatus(errorData || '비밀번호 변경에 실패했습니다.')
            }
        } catch (err) {
            // 요청 중 오류 발생 시, 상태를 오류로 설정하고 콘솔에 오류 로그 출력
            setStatus('error')
            console.error('Error:', err)
        } finally {
            // 요청 완료 후 로딩 상태를 false로 설정
            setLoading(false)
        }
    }

    // 비밀번호 변경 성공 시 로그인 페이지로 리디렉션하는 효과
    useEffect(() => {
        if (status === 'success') {
            navigate('/login') // 비밀번호 변경 성공 시 로그인 페이지로 이동
        }
    }, [status, navigate])

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
                <h2 className='text-2xl font-bold text-center mb-4'>비밀번호 변경</h2>
                
                {/* 비밀번호 변경 성공 메시지 */}
                {status === 'success' && <p className="text-green-500">비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다...</p>}
                
                {/* 비밀번호 변경 실패 메시지 */}
                {status === 'error' && <p className="text-red-500">비밀번호 변경에 실패했습니다. 올바른 토큰을 사용했는지 확인하세요.</p>}
                
                <div className='mb-4'>
                    {/* 새 비밀번호 입력 필드 */}
                    <input
                        type='password' // 입력 필드 유형을 비밀번호로 설정
                        placeholder='새 비밀번호' // 입력 필드에 표시될 플레이스홀더 텍스트
                        value={newPassword} // 입력된 비밀번호 값을 상태와 연동
                        onChange={(e) => setNewPassword(e.target.value)} // 입력값 변경 시 상태 업데이트
                        disabled={loading} // 로딩 중일 때 입력 필드 비활성화
                        className='mt-1 block w-full border border-gray-300 rounded-md 
                                   shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                    />
                </div>
                
                {/* 비밀번호 변경 버튼 */}
                <button
                    onClick={handlePasswordReset} // 버튼 클릭 시 비밀번호 재설정 함수 호출
                    disabled={loading} // 로딩 중일 때 버튼 비활성화
                    className='w-full py-2 px-4 bg-blue-500 text-white rounded-md 
                             hover:bg-blue-600 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:ring-opacity-50'
                >
                    {loading ? '변경 중...' : '비밀번호 변경'} {/* 로딩 상태에 따라 버튼 텍스트 변경 */}
                </button>
            </div>
        </div>
    )
}
