export interface ApiError {
  status: string;
  message: string;
  timestamp: string;
}

export async function extractApiError(response: Response): Promise<ApiError> {
  const data = await response.json();
  return data as ApiError;
}