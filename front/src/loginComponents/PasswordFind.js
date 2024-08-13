import { useState } from "react";

export default function PasswordFind() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email })
            });

            if (response.ok) {
                setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
                setEmail('');
            } else {
                const errorData = await response.text();
                setError(errorData || '이메일 정보 오류');
            }
        } catch (error) {
            setError('서버 오류. 다시 시도해 주세요.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4">비밀번호 찾기</h2>
                {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 border border-green-300">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <p className="text-sm text-gray-700">가입 시 등록한 이메일을 입력하면 이메일로 임시 비밀번호를 보내드립니다.</p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">이메일 주소</label>
                        <input
                            id="userEmail"
                            type="email"
                            placeholder="예) abcd@naver.com"
                            value={email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {loading ? '이메일 발송 중...' : '이메일 발송하기'}
                    </button>
                </form>
            </div>
        </div>
    );
}
