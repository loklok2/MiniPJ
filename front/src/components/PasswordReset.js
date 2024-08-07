import React from 'react'
import { useState, useEffect } from 'react';

export default function PasswordReset() {
    const [newPassword, setNewPassword] = useState('');
    const [passwordResetSuccess, setPasswordResetSuccess] = useState('');
    const [passwordResetError, setPasswordResetError] = useState('');

    const handlePasswordReset = async () => {
        // 비밀번호 재설정 요청 API 호출 예시
        const response = await fetch('http://localhost:8080/api/auth/reset-password-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ newPassword: newPassword, token: '<token>' }),
        });

        if (response.ok) {
            setPasswordResetSuccess('비밀번호가 성공적으로 변경되었습니다.');
            setPasswordResetError('');
            setNewPassword('');
        } else {
            setPasswordResetSuccess('');
            setPasswordResetError('비밀번호 변경에 실패했습니다.');
        }
    };

    return (
        <div className='bg-white p-4 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>비밀번호 변경</h2>
            <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>새 비밀번호</label>
                <input
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='w-full mt-1 block border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                />
            </div>
            <button
                onClick={handlePasswordReset}
                className='py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            >
                비밀번호 변경
            </button>
            {passwordResetSuccess && (
                <div className='mt-4 p-2 bg-green-100 text-green-700 rounded'>
                    {passwordResetSuccess}
                </div>
            )}
            {passwordResetError && (
                <div className='mt-4 p-2 bg-red-100 text-red-700 rounded'>
                    {passwordResetError}
                </div>
            )}
        </div>
    )
}
