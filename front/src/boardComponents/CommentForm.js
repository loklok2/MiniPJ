import { useEffect, useState } from 'react';
import { useAuthToken } from '../hooks/useAuthToken';
import { useNavigate } from 'react-router-dom';

// API 기본 URL 설정: 환경 변수에서 가져오거나 기본값으로 로컬호스트 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export default function CommentForm({ boardId, onCommentSubmit }) {
    // 댓글 입력 필드의 내용을 관리하는 상태
    const [content, setContent] = useState('');

    // 사용자의 인증 토큰을 관리하는 훅
    const [token] = useAuthToken();

    // 페이지 이동을 위한 훅
    const navigate = useNavigate();

    // JWT 토큰 디버깅을 위한 콘솔 로그
    console.log('JWT Token:', token);

    // 컴포넌트가 마운트될 때 사용자가 로그인되어 있는지 확인하고, 로그인되지 않은 경우 로그인 페이지로 리디렉션
    useEffect(() => {
        if (!token) {
            console.log('로그인되지 않은 사용자, 로그인 페이지로 리디렉션합니다.');
            navigate('/login'); // 로그인되지 않은 사용자는 로그인 페이지로 리디렉션
        }
    }, [token, navigate]);

    // 댓글 작성 폼이 제출될 때 호출되는 함수
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼의 기본 제출 동작을 방지

        // 댓글 내용이 비어있는지 확인
        if (!content.trim()) {
            alert("댓글 내용을 입력하세요."); // 내용이 없으면 알림을 표시하고 함수 종료
            return;
        }

        try {
            // 서버에 POST 요청을 보내어 새로운 댓글을 작성
            const response = await fetch(`${API_BASE_URL}/comments/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // 요청 본문의 데이터 타입을 JSON으로 설정
                    'Authorization': `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 포함하여 인증
                },
                body: JSON.stringify({ boardId, content }), // 게시물 ID와 댓글 내용을 JSON으로 직렬화하여 요청 본문에 포함
            });

            // 요청이 실패한 경우 에러를 던짐
            if (!response.ok) {
                throw new Error('댓글 작성에 실패했습니다. 로그인 상태를 확인해 주세요');
            }

            // 서버로부터 새로 작성된 댓글 데이터를 받아옴
            const newComment = await response.json();

            // 댓글 작성이 성공한 후 댓글 입력 필드를 초기화
            setContent('');

            // 작성된 댓글을 상위 컴포넌트로 전달하여 댓글 리스트에 추가
            console.log('댓글이 성공적으로 작성되었습니다:', newComment);
            onCommentSubmit(newComment);
        } catch (error) {
            // 요청 중 오류가 발생한 경우 콘솔에 출력
            console.error('댓글 작성 중 오류 발생:', error);
        }
    };

    // Enter 키를 누를 때 호출되는 함수
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Enter 키를 누르고 Shift 키가 눌리지 않았을 때
            e.preventDefault(); // 기본 Enter 동작(줄 바꿈)을 방지
            handleSubmit(e); // 댓글 작성 함수 호출
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            {/* 댓글 입력 필드 */}
            <textarea
                value={content} // 상태에 저장된 댓글 내용을 입력 필드에 표시
                onChange={(e) => setContent(e.target.value)} // 입력 값이 변경될 때 상태를 업데이트
                onKeyDown={handleKeyDown} // Enter 키 이벤트를 처리하기 위한 함수
                placeholder="댓글을 입력하세요" // 입력 필드에 표시될 자리 표시자
                required // 이 필드가 빈 값이면 폼 제출을 허용하지 않음
                className="w-full mt-1 block border border-gray-300 
                           rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" // Tailwind CSS를 사용하여 스타일 지정
            />
            {/* 댓글 작성 버튼 */}
            <button
                type="submit" // 폼 제출 버튼
                className="mt-2 py-2 px-4 bg-blue-500 text-white 
                           rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" // Tailwind CSS를 사용하여 버튼 스타일 지정
            >
                댓글 작성
            </button>
        </form>
    );
}
