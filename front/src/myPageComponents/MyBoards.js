export default function MyBoards({ boards }) {
    return (
        <div className="bg-white p-4 rounded-lg shadwow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">내가 작성한 게시글</h2>
            {boards.length > 0 ? (
                <ul className="list-disc pl-5">
                    {boards.map(board => (
                        <li key={board.id}
                            className="mb-2"
                        >
                            <a href={`/boards/${board.id}`}
                                className="text-blue-600 hover:underline"
                            >
                                {board.title}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>작성한 게시글이 없습니다.</p>
            )}
        </div>
    )
}
