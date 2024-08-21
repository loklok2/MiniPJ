export default function MyBoards({ boards }) {
    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">내가 작성한 게시글</h2>
            {boards.length > 0 ? (
                <ul className="list-disc pl-5">
                    {boards.map(board => (
                        <li key={board.id}>
                            <a href={`/boards/${board.id}`} className="text-blue-500 hover:underline">
                                {board.title}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600">작성한 게시글이 없습니다.</p>
            )}
        </div>
    )
}
