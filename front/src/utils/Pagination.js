// Pagination 컴포넌트는 페이지 번호를 표시하고 페이지 이동 기능을 제공
// currentPage: 현재 선택된 페이지 번호
// totalPages: 전체 페이지 수
// onPageChange: 사용자가 페이지를 변경할 때 호출되는 함수

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    // 한 번에 표시할 최대 페이지 번호 수
    const maxPageNumbers = 5

    // 표시할 페이지 번호 목록을 계산하는 함수
    const getPageNumbers = () => {
        // 시작 페이지 계산 (현재 페이지에서 앞뒤로 일정 범위의 페이지를 보여줌)
        const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2))
        // 끝 페이지 계산 (시작 페이지부터 최대 표시 가능한 페이지 수만큼 계산)
        const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1)
        // startPage부터 endPage까지의 페이지 번호를 배열로 생성하여 반환
        return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
    }

    return (
        <div className="flex justify-center mt-10 space-x-2">
            {/* 처음으로 이동 버튼 */}
            <button
                onClick={() => onPageChange(1)}  // 첫 페이지로 이동
                disabled={currentPage === 1}  // 현재 페이지가 첫 페이지일 경우 비활성화
                className="px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
            >
                처음
            </button>
            {/* 이전 페이지로 이동 버튼 */}
            <button
                onClick={() => onPageChange(currentPage - 1)}  // 이전 페이지로 이동
                disabled={currentPage === 1}  // 현재 페이지가 첫 페이지일 경우 비활성화
                className="px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
            >
                &lt;
            </button>
            {/* 동적으로 생성된 페이지 번호 버튼들 */}
            {getPageNumbers().map((pageNumber) => (
                <button
                    key={pageNumber}  // 각 버튼의 고유 키
                    onClick={() => onPageChange(pageNumber)}  // 해당 페이지로 이동
                    className={`px-3 py-1 rounded ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} transition`}
                >
                    {pageNumber}
                </button>
            ))}
            {/* 다음 페이지로 이동 버튼 */}
            <button
                onClick={() => onPageChange(currentPage + 1)}  // 다음 페이지로 이동
                disabled={currentPage === totalPages}  // 현재 페이지가 마지막 페이지일 경우 비활성화
                className="px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
            >
                &gt;
            </button>
            {/* 마지막 페이지로 이동 버튼 */}
            <button
                onClick={() => onPageChange(totalPages)}  // 마지막 페이지로 이동
                disabled={currentPage === totalPages}  // 현재 페이지가 마지막 페이지일 경우 비활성화
                className="px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
            >
                마지막
            </button>
        </div>
    )
}
