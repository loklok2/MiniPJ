import { useState } from "react"
import { Link } from "react-router-dom"

// API 기본 URL 설정: 환경 변수에서 가져오거나 기본값으로 로컬호스트 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'

export default function EmailFind() {
    // 닉네임을 저장하는 상태 변수
    const [nickname, setNickname] = useState('')

    // 오류 메시지를 저장하는 상태 변수
    const [error, setError] = useState(null)

    // 성공 메시지를 저장하는 상태 변수
    const [success, setSuccess] = useState(null)

    // 아이디(이메일)를 찾기 위한 함수
    const handleFindEmail = async (e) => {
        e.preventDefault() // 폼 제출 시 페이지 리로드 방지
        setError(null) // 오류 메시지 초기화
        setSuccess(null) // 성공 메시지 초기화

        try {
            // 서버에 닉네임을 보내어 이메일을 찾는 POST 요청
            const response = await fetch(`${API_BASE_URL}/auth/find-usernickname`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // JSON 형식으로 데이터 전송
                },
                body: JSON.stringify({ nickname }), // 닉네임을 JSON 형태로 전송
            })

            // 서버 응답이 성공적이지 않은 경우 에러 처리
            if (!response.ok) {
                if (response.status === 404) {
                    // 닉네임이 존재하지 않는 경우
                    throw new Error('해당 닉네임으로 등록된 사용자가 없습니다.')
                } else {
                    // 다른 이유로 실패한 경우
                    throw new Error('아이디 찾기에 실패했습니다.')
                }
            }

            // 서버로부터 응답된 데이터 (이메일) 가져오기
            const data = await response.text()
            // 성공 메시지 설정
            setSuccess(`아이디(이메일)는 ${data} 입니다.`)
        } catch (error) {
            // 오류가 발생하면 오류 메시지를 설정
            setError(error.message)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">아이디 찾기</h1>
                {/* 오류 메시지 표시 */}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">{error}</div>}
                {/* 성공 메시지 표시 */}
                {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 border border-green-300">{success}</div>}
                
                {/* 아이디 찾기 폼 */}
                <form onSubmit={handleFindEmail}>
                    <div className="mb-4">
                        <label htmlFor="nickname"
                            className="block text-sm font-medium text-gray-700">닉네임</label>
                        <input
                            id="nickname"
                            type="text"
                            placeholder="닉네임을 입력하세요"
                            required // 필수 입력 필드로 설정
                            value={nickname} // 닉네임 상태를 입력 값에 바인딩
                            onChange={(e) => setNickname(e.target.value)} // 입력 값이 변경될 때 닉네임 상태 업데이트
                            className="mt-1 block w-full border 
                                     border-gray-300 rounded-md shadow-sm
                                     focus:border-blue-500 focus:ring focus:ring-blue-500
                                       focus:ring-opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 
                                 text-white rounded-md hover:bg-blue-600    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        아이디 찾기
                    </button>
                </form>
                
                {/* 로그인 페이지로 돌아가기 버튼 */}
                <div className="mt-4 text-center">
                    <Link to="/login">
                        <button
                            className="w-full py-2 px-4 bg-blue-500 
                                     text-white rounded-md hover:bg-blue-600    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            로그인 페이지
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
