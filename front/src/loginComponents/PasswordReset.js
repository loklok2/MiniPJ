import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


export default function PasswordReset() {
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();  // useAuth 훅에서 로그아웃 함수를 가져옴

    // URLSearchParams를 사용하여 쿼리 파라미터에서 토큰을 가져옵니다.
    const query = new URLSearchParams(location.search);
    const resetToken = query.get('token');

    const handlePasswordReset = async () => {
        if (!newPassword) {
            setStatus('error');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: resetToken, newPassword }),
            });

            if (response.ok) {
                setStatus('success');
                logout();  // 비밀번호 재설정이 성공하면 로그아웃 처리
            } else {
                const errorData = await response.text();
                setStatus(errorData || '비밀번호 변경에 실패했습니다.');
            }
        } catch (err) {
            setStatus('error');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (status === 'success') {
            navigate('/login');
        }
    }, [status, navigate]);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
                <h2 className='text-2xl font-bold text-center mb-4'>비밀번호 변경</h2>
                {status === 'success' && <p className="text-green-500">비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다...</p>}
                {status === 'error' && <p className="text-red-500">비밀번호 변경에 실패했습니다. 올바른 토큰을 사용했는지 확인하세요.</p>}
                <div className='mb-4'>
                    <input
                        type='password'
                        placeholder='새 비밀번호'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                        className='mt-1 block w-full border border-gray-300 rounded-md 
                                   shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                    />
                </div>
                <button
                    onClick={handlePasswordReset}
                    disabled={loading}
                    className='w-full py-2 px-4 bg-blue-500 text-white rounded-md 
                             hover:bg-blue-600 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:ring-opacity-50'
                >
                    {loading ? '변경 중...' : '비밀번호 변경'}
                </button>
            </div>
        </div>
    );
}
