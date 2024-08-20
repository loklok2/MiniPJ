export default function MyComments({ comments }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">내가 작성한 댓글</h2>
            {comments.length > 0 ? (
                <ul className="list-disc pl-5">
                    {comments.map(comment => (
                        <li key={comment.id}
                            className="mb-2"
                        >
                            <a href={`/boards/${comment.board.id}`}
                                className="text-blue-600 hover:underline"
                            >
                                관련 게시글 보기
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>작성한 댓글이 없습니다.</p>
            )}
        </div>
    )
}
