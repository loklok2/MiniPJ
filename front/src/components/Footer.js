export default function Footer() {
    return (
        <footer className="bg-blue-500 text-white py-6 text-center">
            <p>
                &copy; {new Date().getFullYear()} 부산 도보여행 대중교통 정보. All rights reserved.
            </p>
        </footer>
    );
}
