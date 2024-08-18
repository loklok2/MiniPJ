import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BoardEdit() {
  const { boardId } = useParams();
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [images, setImages] = useState([]); // 이미지 파일을 저장하는 상태
  const [imagePreviews, setImagePreviews] = useState([]); // 이미지 미리보기를 위한 상태
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { auth } = useAuth();

  // 게시물 데이터를 가져오는 함수
  const fetchBoard = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/boards/${boardId}`);

      if (!response.ok) {
        console.log('Response:', response);
        throw new Error('게시물을 가져오는 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      setFormData({ title: data.title, content: data.content });
      setImagePreviews(data.images.map(image => image.url)); // 기존 이미지를 미리보기로 설정
    } catch (error) {
      setError(error.message);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // 입력 값 변경 시 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // 이미지 파일 변경 시 상태 업데이트 및 미리보기 생성
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // 수정 요청 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formDataToSend = new FormData();
    formDataToSend.append('board', JSON.stringify(formData)); // JSON 직렬화
    images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    try {
      const response = await fetch(`http://localhost:8080/api/boards/${boardId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`게시물 수정에 실패했습니다: ${errorMessage}`);
      }

      setSuccess('게시물이 성공적으로 수정되었습니다.');
      setTimeout(() => navigate(`/boards/${boardId}`), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">게시물 수정</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="title"
              placeholder="제목"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <textarea
              name="content"
              placeholder="내용"
              value={formData.content}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">이미지</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="grid grid-cols-3 gap-2 mt-4">
              {imagePreviews.map((preview, index) => (
                <img key={index} src={preview} alt={`preview-${index}`} className="w-full h-auto object-cover rounded-md" />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            수정
          </button>
        </form>
      </div>
    </div>
  );
}
