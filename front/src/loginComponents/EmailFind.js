import { useState } from "react"
import { Link } from "react-router-dom"

export default function EmailFind() {
    const [nickname, setNickname] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleFindEmail = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch('http://localhost:8080/api/auth/find-usernickname', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nickname }),
            })

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('해당 닉네임으로 등록된 사용자가 없습니다.')
                } else {
                    throw new Error('아이디 찾기에 실패했습니다.')
                }
            }

            const data = await response.text()
            setSuccess(`아이디(이메일)는 ${data} 입니다.`)
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">아이디 찾기</h1>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 border border-green-300">{success}</div>}
                <form onSubmit={handleFindEmail}>
                    <div className="mb-4">
                        <label htmlFor="nickname"
                            className="block text-sm font-medium text-gray-700">닉네임</label>
                        <input
                            id="nickname"
                            type="text"
                            placeholder="닉네임을 입력하세요"
                            required
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
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
