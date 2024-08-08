// src/components/PasswordReset.js
import React from 'react';
import { useRecoilState } from 'recoil';
import { resetPasswordState } from '../atoms/authAtom';

export default function PasswordReset() {
    const [resetPassword, setResetPassword] = useRecoilState(resetPasswordState);

    const handlePasswordReset = async () => {
        const { token, newPassword } = resetPassword;
        try {
            const response = await fetch(`http://localhost:8080/api/auth/reset-password?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });

            const data = await response.json();

            if (data.success) {
                setResetPassword({ ...resetPassword, status: 'success' });
            } else {
                setResetPassword({ ...resetPassword, status: 'error' });
            }
        } catch (err) {
            setResetPassword({ ...resetPassword, status: 'error' });
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
            <button onClick={handlePasswordReset}>비밀번호 변경</button>
            {resetPassword.status === 'success' && <p>비밀번호가 성공적으로 변경되었습니다.</p>}
            {resetPassword.status === 'error' && <p>비밀번호 변경에 실패했습니다.</p>}
        </div>
    )
    
}
