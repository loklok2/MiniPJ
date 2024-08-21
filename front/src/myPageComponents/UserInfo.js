export default function UserInfo({ userInfo }) {
    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">회원정보</h2>
            <p className="text-gray-600"><strong>이메일:</strong> {userInfo.username}</p>
            <p className="text-gray-600"><strong>닉네임:</strong> {userInfo.nickname}</p>
        </div>
    )
}
