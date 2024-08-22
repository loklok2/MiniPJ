import { useState } from "react"

// API 기본 URL 설정: 환경 변수에서 가져오거나 기본값으로 로컬호스트 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'

// 비밀번호 찾기 컴포넌트
export default function PasswordFind() {
    // 이메일 입력 상태 관리
    const [email, setEmail] = useState('') // 사용자가 입력한 이메일을 저장
    const [error, setError] = useState(null) // 에러 메시지를 저장
    const [loading, setLoading] = useState(false) // 로딩 상태를 저장
    const [message, setMessage] = useState(null) // 성공 메시지를 저장

    // 사용자가 이메일 입력 필드에 입력할 때 호출되는 함수
    const handleChange = (e) => {
        setEmail(e.target.value) // 이메일 상태 업데이트
    }

    // 폼 제출 시 호출되는 함수
    const handleSubmit = async (e) => {
        e.preventDefault() // 폼 기본 동작 방지 (페이지 새로고침 방지)
        setError(null) // 기존 에러 메시지 초기화
        setMessage(null) // 기존 성공 메시지 초기화
        setLoading(true) // 로딩 상태 시작

        try {
            // 비밀번호 재설정 요청을 서버에 보냄
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST', // HTTP 메소드 설정
                headers: {
                    'Content-Type': 'application/json', // 요청 본문 형식 JSON으로 설정
                },
                body: JSON.stringify({ username: email }) // 본문에 이메일 주소를 JSON 형태로 변환하여 추가
            })

            if (response.ok) {
                // 요청이 성공하면 성공 메시지 표시
                setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다.')
                setEmail('') // 이메일 입력 필드 초기화
            } else if (response.status === 404) {
                // 이메일이 존재하지 않는 경우 처리
                const errorData = await response.json()
                setError(errorData.message || '해당 이메일 주소를 가진 사용자를 찾을 수 없습니다.')
            } else {
                // 다른 오류 처리
                const errorData = await response.text()
                setError(errorData || '이메일 정보 오류')
            }
        } catch (error) {
            // 네트워크 또는 서버 오류 처리
            setError('서버 오류. 다시 시도해 주세요.')
            console.error('Error:', error) // 오류를 콘솔에 기록
        } finally {
            setLoading(false) // 로딩 상태 종료
        }
    }

    // UI 렌더링
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4">비밀번호 찾기</h2>

                {/* 성공 또는 오류 메시지 표시 */}
                {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 border border-green-300">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">{error}</div>}

                {/* 이메일 입력 폼 */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <p className="text-sm text-gray-700">가입 시 등록한 이메일을 입력하면 이메일로 임시 비밀번호를 보내드립니다.</p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">이메일 주소</label>
                        <input
                            id="userEmail" // 이메일 입력 필드의 ID
                            type="email" // 이메일 입력 필드 유형
                            placeholder="예) abcd@naver.com" // 이메일 입력 필드 플레이스홀더
                            value={email} // 입력된 이메일 값
                            onChange={handleChange} // 입력 값이 변경될 때 호출되는 함수
                            required // 필수 입력 필드 설정
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </div>
                    <button
                        type="submit" // 제출 버튼
                        disabled={loading} // 로딩 중일 때 버튼 비활성화
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {loading ? '이메일 발송 중...' : '이메일 발송하기'} {/* 로딩 상태에 따른 버튼 텍스트 변경 */}
                    </button>
                </form>
            </div>
        </div>
    )
}
