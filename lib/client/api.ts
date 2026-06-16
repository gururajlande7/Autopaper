export async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text()

  if (!text) {
    throw new Error('Server returned an empty response. Check deployment logs.')
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error('Server returned an invalid response. Check deployment logs.')
  }
}
