export interface FrameworkAnalysis {
  whatHappened: boolean;
  providesReassurance: boolean;
  whyHappened: boolean;
  howToFix: boolean;
  wayOut: boolean;
}

export interface AnalysisResult {
  score: number;
  passed: boolean;
  frameworkAnalysis: FrameworkAnalysis;
  critique: string[];
  rewrittenMessage: {
    title: string;
    body: string;
  };
  rationale: string;
  error?: string;
}

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error?: string | null;
}

export const AnalysisResults = ({ result, isLoading, error }: AnalysisResultsProps) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md" data-testid="loading-skeleton">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3 mt-4">
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }


  // Error state
  if (error || result?.error) {
    return (
      <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-r">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error analyzing error message
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error || result?.error || 'An unknown error occurred. Please try again.'}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No results state
  if (!result) {
    return (
      <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              No analysis results yet
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Enter an error message above to analyze its quality and get improvement suggestions.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { score, passed, frameworkAnalysis, critique, rewrittenMessage, rationale } = result;
  const scorePercentage = Math.round(score * 100);
  
  // Framework analysis items
  const frameworkItems = [
    { key: 'whatHappened', label: 'Clearly states what happened' },
    { key: 'providesReassurance', label: 'Provides reassurance' },
    { key: 'whyHappened', label: 'Explains why it happened' },
    { key: 'howToFix', label: 'Explains how to fix it' },
    { key: 'wayOut', label: 'Provides a way out' },
  ];

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            passed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {passed ? 'Good' : 'Needs Improvement'}
          </span>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Error Message Quality</span>
            <span className="text-sm font-semibold">{scorePercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div
              className={`h-2.5 rounded-full ${
                passed ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${score * 100}%` }}
              role="progressbar"
              aria-valuenow={score * 100}
              aria-valuemin={0}
              aria-valuemax={100}
              data-testid="progress-bar"
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {passed ? 'Good' : 'Needs improvement'}
          </p>
        </div>

        {/* Framework Analysis */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Framework Analysis</h3>
          <ul className="space-y-2">
            {frameworkItems.map((item) => (
              <li key={item.key} className="flex items-center">
                {frameworkAnalysis[item.key as keyof FrameworkAnalysis] ? (
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="text-sm text-gray-700">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rewritten Message */}
        {rewrittenMessage?.title && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Improved Error Message</h3>
            <div className="bg-white p-3 rounded border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-1">{rewrittenMessage.title}</h4>
              <p className="text-gray-700 whitespace-pre-line">{rewrittenMessage.body}</p>
            </div>
          </div>
        )}

        {/* Critique */}
        {critique.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Analysis & Suggestions</h3>
            <ul className="space-y-3">
              {critique.map((item, index) => (
                <li key={index} className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rationale */}
        {rationale && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Rationale</h3>
            <p className="text-gray-700 whitespace-pre-line">{rationale}</p>
          </div>
        )}
      </div>
    </div>
  );
};
