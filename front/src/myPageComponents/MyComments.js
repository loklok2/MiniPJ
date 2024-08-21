export default function MyComments({ comments }) {
    if (!comments || comments.length === 0) {
        return <p>No comments available</p>;
    }

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">내가 작성한 댓글</h2>
            {comments && comments.length > 0 ? (
                <ul className="space-y-4">
                    {comments.map(comment => (
                        <li key={comment.id} className="bg-white p-4 rounded-lg shadow">
                            <p className="text-gray-800 mb-2">{comment.content}</p>
                            <div className="text-sm text-gray-500">
                                <span>작성자: {comment.authorNickname}</span>
                                <span className="ml-4">{comment.isEdited ? `수정됨 - ${new Date(comment.editedDate).toLocaleDateString()}` : new Date(comment.createDate).toLocaleDateString()}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600">작성한 댓글이 없습니다.</p>
            )}
        </div>
    );
}
