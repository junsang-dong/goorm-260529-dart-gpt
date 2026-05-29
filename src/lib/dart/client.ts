const DART_BASE = 'https://opendart.fss.or.kr/api'

export interface DartResponse<T = unknown> {
  status: string
  message: string
  list?: T[]
}

export async function dartGet<T>(
  endpoint: string,
  params: Record<string, string>,
  apiKey: string,
): Promise<DartResponse<T>> {
  const url = new URL(`${DART_BASE}/${endpoint}`)
  url.searchParams.set('crtfc_key', apiKey)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`DART HTTP error: ${response.status}`)
  }

  const data = (await response.json()) as DartResponse<T>
  return data
}

export const DART_STATUS_MESSAGES: Record<string, string> = {
  '000': '정상',
  '010': '등록되지 않은 키입니다.',
  '011': '사용할 수 없는 키입니다.',
  '012': '접근할 수 없는 IP입니다.',
  '013': '조회된 데이터가 없습니다.',
  '020': '요청 제한을 초과하였습니다.',
}

export function assertDartOk(status: string, message: string): void {
  if (status === '000') return
  const hint = DART_STATUS_MESSAGES[status] ?? message
  throw new Error(`DART API error (${status}): ${hint}`)
}
