import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnalysisResults } from '../AnalysisResults';

describe('AnalysisResults', () => {
  const mockResult = {
    score: 0.75,
    passed: true,
    suggestions: [
      'Include the specific error code',
      'Add more context about what you were doing',
    ],
  };

  it('renders loading state correctly', () => {
    render(<AnalysisResults isLoading={true} result={null} />);
    
    const loadingSkeleton = screen.getByTestId('loading-skeleton');
    expect(loadingSkeleton).toBeInTheDocument();
    // Check for loading animation class
    expect(loadingSkeleton.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to analyze error message';
    render(
      <AnalysisResults 
        isLoading={false} 
        result={null} 
        error={errorMessage} 
      />
    );
    
    expect(screen.getByText(/error analyzing error message/i)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('renders no results state correctly', () => {
    render(<AnalysisResults isLoading={false} result={null} />);
    
    expect(screen.getByText(/no analysis results yet/i)).toBeInTheDocument();
    expect(screen.getByText(/enter an error message above/i)).toBeInTheDocument();
  });

  it('renders results correctly when passed', () => {
    render(<AnalysisResults isLoading={false} result={mockResult} />);
    
    // Check score
    expect(screen.getByText(/75%/)).toBeInTheDocument();
    
    // Check status badge text in the badge element
    const statusBadges = screen.getAllByText(/good/i, { exact: false });
    expect(statusBadges.length).toBeGreaterThan(0);
    const statusBadge = statusBadges[0];
    expect(statusBadge).toBeInTheDocument();
    
    // Check suggestions using flexible text matching
    mockResult.suggestions.forEach(suggestion => {
      // Find all elements that might contain the suggestion
      const suggestionElements = screen.getAllByText((content, element) => {
        if (!element) return false;
        const text = element.textContent || '';
        return text.includes(suggestion.split(' ')[0]);
      }, { exact: false });
      
      // Expect to find at least one matching element for each suggestion
      expect(suggestionElements.length).toBeGreaterThan(0);
      expect(suggestionElements.some(el => el.textContent?.includes(suggestion.split(' ')[0]))).toBe(true);
    });
    
    // Check progress bar using its style
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveStyle('width: 75%');
  });

  it('shows warning status when score is below threshold', () => {
    const warningResult = {
      ...mockResult,
      score: 0.65,
      passed: false,
    };
    
    render(<AnalysisResults isLoading={false} result={warningResult} />);
    
    // Check the status badge text - use getAllByText since there are multiple matches
    const statusBadges = screen.getAllByText(/needs improvement/i, { exact: false });
    expect(statusBadges.length).toBeGreaterThan(0);
    expect(statusBadges[0]).toBeInTheDocument();
    
    // Check the score percentage
    const scoreElements = screen.getAllByText(/65\s*%/i);
    expect(scoreElements.length).toBeGreaterThan(0);
    expect(scoreElements[0]).toBeInTheDocument();
    
    // Check the progress bar color
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveClass('bg-yellow-500');
  });

  it('handles missing suggestions gracefully', () => {
    const resultWithoutSuggestions = {
      ...mockResult,
      suggestions: [],
    };
    
    render(<AnalysisResults isLoading={false} result={resultWithoutSuggestions} />);
    
    // Suggestions list should not be in the document
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    // The suggestions heading should not be there when there are no suggestions
    expect(screen.queryByText(/suggestions for improvement/i)).not.toBeInTheDocument();
  });

  it('displays custom error message when provided', () => {
    const customError = 'Custom error message';
    render(
      <AnalysisResults 
        isLoading={false} 
        result={null} 
        error={customError} 
      />
    );
    
    expect(screen.getByText(customError)).toBeInTheDocument();
  });
});
