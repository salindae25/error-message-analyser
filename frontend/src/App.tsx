import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorMessageInput } from './components/ErrorMessageInput';
import type { AnalysisResult } from './components/AnalysisResults';
import { AnalysisResults } from './components/AnalysisResults';

// Create a client for React Query with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// API base URL - in a real app, this would come from environment variables
const API_BASE_URL = 'http://localhost:3000';

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Memoize the analyze function to prevent unnecessary re-renders
  const handleAnalyze = useCallback(async (message: string) => {
    if (!message.trim()) {
      setApiError('Please enter an error message to analyze');
      return;
    }

    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || 
          `Error: ${response.status} - ${response.statusText}`
        );
      }
      
      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error analyzing message:', err);
      setApiError(
        err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred while analyzing the error message. Please try again.'
      );
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Error Message Analyzer</h1>
            <p className="text-lg text-gray-600">
              Paste your error message below to get feedback on how to improve it
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <ErrorMessageInput 
              onAnalyze={handleAnalyze} 
              isLoading={isLoading}
              error={apiError}
            />
          </div>

          <div className="mt-8">
            <AnalysisResults 
              result={analysisResult}
              isLoading={isLoading}
              error={apiError}
            />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
