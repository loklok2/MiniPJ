import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PasswordReset() {
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const navigate = useNavigate();

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
                body: JSON.stringify({ token, newPassword }),
            });
    
            // 응답을 텍스트로 먼저 받아서 확인
            const responseText = await response.text();
            console.log("Server response:", responseText);
    
            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    navigate('/login'); // 로그인 페이지로 이동
                }, 2000); // 2초 후에 로그인 페이지로 이동 (사용자에게 피드백 시간을 주기 위함)
            } else {
                setStatus(responseText || '비밀번호 변경에 실패했습니다.');
            }
        } catch (err) {
            setStatus('error');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }
    

    useEffect(() => {
        if (!token) {
            setStatus('error');
        }
    }, [token]);

    return (
        <div className='password-reset'>
            <h2>비밀번호 변경</h2>
            <input
                type='password'
                placeholder='새 비밀번호'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
            />
            <button
                onClick={handlePasswordReset}
                disabled={loading}
            >
                {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
            {status === 'success' && <p className="text-green-500">비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다...</p>}
            {status === 'error' && <p className="text-red-500">비밀번호 변경에 실패했습니다. 올바른 토큰을 사용했는지 확인하세요.</p>}
        </div>
    );
}
