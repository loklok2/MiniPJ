import { useState } from "react";
import { Link } from 'react-router-dom';

export default function PasswordFind() {
    const [user, setUser] = useState({ username: '' });
    const [findError, setFindError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFindError(null);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/find-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: user.username })
            });

            setIsLoading(false);

            if (response.ok) {
                // 응답 성공
                setAlert('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
                setUser({ username: '' }); // 입력 필드 초기화
            } else {
                setFindError('이메일 정보 오류');
            }
        } catch (error) {
            setIsLoading(false);
            setFindError('서버 오류. 다시 시도해 주세요.');
            console.error('Error:', error);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4">비밀번호 찾기</h2>
                {alert && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">{alert}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <p className="text-sm text-gray-700">가입 시 등록한 이메일을 입력하면 이메일로 임시 비밀번호를 보내드립니다.</p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">이메일 주소</label>
                        <input
                            id="userEmail"
                            name="username"
                            type="email"
                            placeholder=" 예) abcd@naver.com"
                            value={user.username}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {isLoading ? '이메일 발송 중...' : '이메일 발송하기'}
                    </button>
                    {findError && <div className="mt-4 text-red-500">{findError}</div>}
                </form>

                {/* 비밀번호 재설정 페이지로 이동하는 링크 추가 */}
                <div className="mt-4 text-center">
                    <Link to="/password-reset" className="text-blue-500 hover:text-blue-700">비밀번호 재설정하기</Link>
                </div>
            </div>
        </div>
    );
}
