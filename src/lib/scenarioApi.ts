import { API_BASE_URL } from './apiConfig';

export interface GenerateResponse {
  result?: string;
  scenario?: string;
  content?: string;
  script?: string;
  error?: string;
}

export interface GenerateError extends Error {
  status?: number;
  serverMessage?: string;
}

export const addCredits = async (userId: string, amount: number): Promise<{ balance: number }> => {
  const response = await fetch(`${API_BASE_URL}/add_credits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, amount }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add credits');
  }
  
  return response.json();
};

export const generateScenario = async (
  userId: string,
  prompt: string
): Promise<GenerateResponse> => {
  console.log('Requesting ID:', userId);
  console.log('Prompt:', prompt.substring(0, 100) + '...');
  
  // Create AbortController with 60-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        prompt: prompt,
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    console.log('Response received:', response);
    console.log('Response status:', response.status);
    
    // Handle different status codes explicitly
    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
        console.log('Error data:', errorData);
      } catch (parseError) {
        console.log('Could not parse error response');
      }
      
      if (response.status === 403) {
        const error: GenerateError = new Error('Insufficient balance. Please top up to continue.');
        error.status = 403;
        error.serverMessage = errorData.error || 'Insufficient balance';
        throw error;
      }
      
      if (response.status === 500) {
        const error: GenerateError = new Error(errorData.error || errorData.detail || 'Server error occurred');
        error.status = 500;
        error.serverMessage = errorData.error || errorData.detail;
        throw error;
      }
      
      const error: GenerateError = new Error(errorData.error || 'Generation failed');
      error.status = response.status;
      throw error;
    }
    
    const data = await response.json();
    console.log('Success data:', data);
    
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    // Handle abort/timeout
    if (error.name === 'AbortError') {
      const timeoutError: GenerateError = new Error('Request timed out after 60 seconds. Please try again.');
      timeoutError.status = 408;
      throw timeoutError;
    }
    
    // Re-throw if it's already our custom error
    if (error.status) {
      throw error;
    }
    
    // Handle network errors
    console.error('Network or fetch error:', error);
    const networkError: GenerateError = new Error('Network error. Please check your connection.');
    throw networkError;
  }
};
