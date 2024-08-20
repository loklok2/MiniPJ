import { useState, useEffect } from "react";

export const useFetch = ( url, token ) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {

    const fetchData = async () => {
        console.log(`Fetching data from ${url} with token ${token}`);

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
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
            
            setData(result)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (token) {
        fetchData()
    } else {
        setLoading(false); // 토큰이 없는 경우 로딩 중 상태 해제
    }

  }, [url, token])

  return { data, loading, error }
}
