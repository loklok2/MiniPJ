import React from 'react'
import { useRecoilState } from 'recoil';
import { resetPasswordState } from '../atoms/authAtom';
import { useNavigate } from 'react-router-dom';

export default function PasswordReset() {
    const [resetPassword, setResetPassword] = useRecoilState(resetPasswordState);
    const navigate = useNavigate();

    // 비밀번호 재설정 요청 API 호출
    const handleResetPassword = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    token: resetPassword.token,
                    newPassword: resetPassword.newPassword
                }),
            });

            if (response.ok) {
                setResetPassword({ ...resetPassword, status: 'success' });
                setTimeout(() => navigate('/login'), 2000); // 2초 후 로그인 
            } else {
                setResetPassword({ ...resetPassword, status: 'error' });
            }
        } catch (error) {
            console.error('서버 오류. 다시 시도해 주세요.');
        }
    }

    return (
        <div className='password-reset'>
            <h2>비밀번호 변경</h2>
            <input
                type='text'
                placeholder='비밀번호 재설정 토큰'
                value={resetPassword.token}
                onChange={(e) => setResetPassword({ ...resetPassword, token: e.target.value })}
            />
            <input
                type='password'
                placeholder='새 비밀번호'
                value={resetPassword.newPassword}
                onChange={(e) => setResetPassword({ ...resetPassword, newPassword: e.target.value })}
            />
            <button onClick={handleResetPassword}>비밀번호 변경</button>
            {resetPassword.status === 'success' && <p>비밀번호가 성공적으로 변경되었습니다.</p>}
            {resetPassword.status === 'error' && <p>비밀번호 변경에 실패했습니다.</p>}
        </div>
    )
}
