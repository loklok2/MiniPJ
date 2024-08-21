import { useState, useEffect } from "react"

export const useFetch = (url, token) => {
    const [data, setData] = useState(null)  // 데이터 저장을 위한 상태
    const [loading, setLoading] = useState(true)  // 로딩 상태를 관리하기 위한 상태
    const [error, setError] = useState(null)  // 에러 메시지를 저장하기 위한 상태

    useEffect(() => {
        const fetchData = async () => {
            console.log(`Fetching data from ${url} with token ${token}`)

            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // JWT 토큰을 Authorization 헤더에 포함
                    },
                })

                if (!response.ok) {
                    throw new Error(`에러: ${response.status} ${response.statusText}`)
                }

                // JSON 파싱 시도
                let result
                try {
                    result = await response.json()
                } catch (jsonError) {
                    throw new Error('JSON 파싱 오류: 유효하지 않은 JSON 응답')
                }

                setData(result)  // 데이터 상태 업데이트
            } catch (error) {
                setError(error.message)  // 에러 상태 업데이트
            } finally {
                setLoading(false)  // 로딩 상태 해제
            }
        }

        if (token) {
            fetchData()  // 토큰이 있으면 데이터 가져오기 시작
        } else {
            setLoading(false)  // 토큰이 없으면 로딩 중 상태 해제
        }

    }, [url, token])  // url 또는 token이 변경될 때마다 useEffect 재실행

    return { data, loading, error }  // 데이터를 반환
}
