export default function MyComments({ comments }) {
    if (!comments || comments.length === 0) {
        return <p>No comments available</p>;
    }

    return (
        <div>
            {comments.map(comment => (
                comment && comment.id ? (
                    <div key={comment.id}>
                        <p>{comment.content}</p>
                        <small>By {comment.authorNickname}</small>
                    </div>
                ) : (
                    console.error('Invalid comment data:', comment)
                )
            ))}
        </div>
    );
}
