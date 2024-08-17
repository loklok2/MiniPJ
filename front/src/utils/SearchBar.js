// SearchBar 컴포넌트는 검색 입력 필드와 검색 버튼을 제공하는 역할
// `searchText`는 현재 입력된 검색어를 나타내는 상태
// `onSearchTextChange`는 사용자가 입력 필드에 입력한 텍스트가 변경될 때 호출되는 함수
// `onSearch`는 검색 버튼을 클릭하거나 엔터 키를 눌렀을 때 호출되는 함수

export default function SearchBar({ searchText, onSearchTextChange, onSearch }) {
    // 사용자가 입력 필드에서 엔터 키를 누르면 검색을 실행하는 함수
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch() // 엔터 키를 눌렀을 때 onSearch 함수 호출
        }
    }

    return (
        <div className="mb-12 flex justify-center">
            <div className="relative w-full max-w-xl">
                {/* 사용자가 검색어를 입력할 수 있는 입력 필드 */}
                <input
                    type="text"  // 입력 필드의 타입을 텍스트로 지정
                    placeholder="🔍 검색"  // 입력 필드의 플레이스홀더 텍스트
                    value={searchText}  // 입력 필드의 값은 searchText 상태로 관리
                    onChange={(e) => onSearchTextChange(e.target.value)}  // 입력 값이 변경될 때 onSearchTextChange 함수 호출
                    onKeyDown={handleKeyDown}  // 키를 누를 때 handleKeyDown 함수 호출
                    className="w-full p-4 pl-12 pr-4 bg-white border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ transition: 'box-shadow 0.3s ease-in-out' }}  // 스타일: 부드러운 그림자 전환 효과
                />
                
                {/* 검색 버튼 */}
                <button
                    onClick={onSearch}  // 버튼 클릭 시 onSearch 함수 호출
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition"
                    style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}  // 버튼에 그림자 추가
                >
                    {/* 검색 아이콘 (돋보기 모양) */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35m1.15-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}
