import { useState } from 'react';
import { useAuthToken } from '../hooks/useAuthToken';

export default function CommentForm({ boardId }) {
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [token] = useAuthToken();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://localhost:8080/api/comments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ boardId, content }),
            });

            if (!response.ok) {
                throw new Error('댓글 작성에 실패했습니다.');
            }

            setContent('');
            setSuccess('댓글이 작성되었습니다.');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="댓글을 입력하세요"
                required
                className="w-full mt-1 block border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
            <button
                type="submit"
                className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                댓글 작성
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
        </form>
    );
}
