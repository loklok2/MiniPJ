import UserInfo from "../myPageComponents/UserInfo"
import MyBoards from "../myPageComponents/MyBoards"
import MyComments from "../myPageComponents/MyComments"
import { useAuth } from "../hooks/useAuth"
import { useFetch } from "../hooks/useFetch"

export default function MyPage() {
    const { auth } = useAuth()

    console.log("Auth State:", auth); // auth 상태를 확인하여 로그인 여부를 점검

    const { data: userInfo, loading: userLoading, error: userError } = useFetch('http://localhost:8080/api/mypage/info', auth.token)
    const { data: myBoards, loading: boardsLoading, error: boardsError } = useFetch('http://localhost:8080/api/mypage/my-boards', auth.token)
    const { data: myComments, loading: commentsLoading, error: commentsError } = useFetch('http://localhost:8080/api/mypage/my-comments', auth.token)

    if (userLoading || boardsLoading || commentsLoading) {
        return <div className="text-center text-gray-500">로딩 중...</div>
    }

    if (userError || boardsError || commentsError) {
        console.error("Errors:", userError, boardsError, commentsError); // 에러가 발생했을 때 확인
        return <div className="text-center text-red-500">오류가 발생했습니다: {userError || boardsError || commentsError}</div >
    }

    if (!auth.isLoggedIn) {
        return <div className="text-center text-gray-600">로그인 상태가 아닙니다. 로그인 후 다시 시도해 주세요.</div>
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">마이페이지</h2>
                <div className="flex items-center space-x-6">
                    {userInfo && <UserInfo userInfo={userInfo} />}
                </div>
            </div>
            <MyBoards boards={myBoards} />
            <MyComments comments={myComments} />
        </div>
    )
}
