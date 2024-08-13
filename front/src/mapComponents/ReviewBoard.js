import { useEffect, useState } from 'react';

export default function ReviewBoard({ locationId }) {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/boards/{id}`);
                if (!response.ok) throw new Error('리뷰 데이터를 가져오지 못했습니다.');

                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error('리뷰 가져오기 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [locationId]);

    const handleReviewSubmit = async () => {
        if (!newReview.trim()) return;

        try {
            const response = await fetch(`http://localhost:8080/api/boards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    locationId,
                    review: newReview,
                }),
            });

            if (!response.ok) throw new Error('리뷰 저장에 실패했습니다.');

            const savedReview = await response.json();
            setReviews((prev) => [...prev, savedReview]);
            setNewReview('');
        } catch (error) {
            console.error('리뷰 저장 실패:', error);
        }
    };

    return (
        <div className='mt-4'>
            <h3 className='text-lg font-bold mb-2'>리뷰 게시판</h3>
            {loading ? (
                <p>리뷰를 로딩 중...</p>
            ) : (
                <div className='space-y-2'>
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <div key={index} className='border p-2 rounded'>
                                {review.review}
                            </div>
                        ))
                    ) : (
                        <p>첫 번째 리뷰를 작성해보세요!</p>
                    )}
                </div>
            )}
            <div className='mt-4'>
                <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    className='w-full p-2 border rounded'
                    rows="3"
                    placeholder='리뷰를 작성하세요...'
                />
                <button
                    onClick={handleReviewSubmit}
                    className='mt-2 px-4 py-2 bg-blue-500 text-white rounded'>
                    리뷰 작성
                </button>
            </div>
        </div>
    );
}