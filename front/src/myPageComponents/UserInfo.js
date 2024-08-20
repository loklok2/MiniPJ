export default function UserInfo({ userInfo }) {
    return (
        <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
            <h2 className='text-xl font-semibold mb-4'>회원정보</h2>
            <p><strong>이메일:</strong> {userInfo.username}</p>
            <p><strong>닉네임:</strong> {userInfo.nickname}</p>
        </div>
    )
}
