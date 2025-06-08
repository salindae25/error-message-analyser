import { useState, useEffect } from 'react';

const MAX_MESSAGE_LENGTH = 2000;

interface ErrorMessageInputProps {
  onAnalyze: (message: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export const ErrorMessageInput = ({ onAnalyze, isLoading, error: externalError }: ErrorMessageInputProps) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setErrorMessage(value);
      setCharacterCount(value.length);
      if (error) setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = errorMessage.trim();
    
    if (!trimmedMessage) {
      setError('Please enter an error message');
      return;
    }
    
    if (trimmedMessage.length < 10) {
      setError('Please provide more details (at least 10 characters)');
      return;
    }
    
    setError(null);
    onAnalyze(trimmedMessage);
  };

  const isSubmitDisabled = isLoading || !!error || !errorMessage.trim();
  const isNearLimit = characterCount > MAX_MESSAGE_LENGTH * 0.9;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <label htmlFor="error-message" className="block text-sm font-medium text-gray-700">
              Enter Error Message
            </label>
            <span className={`text-xs ${isNearLimit ? 'text-red-600' : 'text-gray-500'}`}>
              {characterCount}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
          <div className="relative">
            <textarea
              id="error-message"
              rows={5}
              className={`w-full px-3 py-2 pr-10 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              placeholder="Paste your error message here..."
              value={errorMessage}
              onChange={handleChange}
              disabled={isLoading}
              aria-label="Error message input"
              aria-invalid={!!error}
              aria-describedby={error ? 'error-message-help' : undefined}
            />
          </div>
          
          {error && (
            <p id="error-message-help" className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
          
          <div className="mt-1 text-xs text-gray-500">
            Include relevant error messages, what you were doing, and any error codes.
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-md text-white font-medium ${
            isSubmitDisabled
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          } transition-colors duration-200`}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze Error'
          )}
        </button>
      </form>
    </div>
  );
};
