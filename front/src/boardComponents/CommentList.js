import { useEffect} from 'react';

export default function CommentList({ comments, handleDelete }) {

    // comments 상태를 추적하기 위한 useEffect 추가
    useEffect(() => {
        console.log('현재 comments 상태:', comments)
    }, [comments])


    return (
        <ul>
            {comments.map(comment => (
                <li key={comment.id}
                    className='mb-4'>
                    <p className='text-gray-800'>{comment.content}</p>
                    <p className='text-gray-600 text-sm'>작성자: {comment.authorNickname}</p>
                    <button
                            onClick={() => handleDelete(comment.id)}
                            className='text-red-500 text-sm'
                    >
                        삭제
                    </button>
                </li>
            ))}
        </ul>
    )

}