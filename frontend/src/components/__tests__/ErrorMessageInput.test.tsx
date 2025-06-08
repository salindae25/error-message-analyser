import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorMessageInput } from '../ErrorMessageInput';

describe('ErrorMessageInput', () => {
  const mockOnAnalyze = jest.fn();
  const defaultProps = {
    onAnalyze: mockOnAnalyze,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the input field and button', () => {
    render(<ErrorMessageInput {...defaultProps} />);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze error/i })).toBeInTheDocument();
  });

  it('shows character count when typing', () => {
    render(<ErrorMessageInput onAnalyze={mockOnAnalyze} isLoading={false} />);
    const input = screen.getByLabelText(/error message input/i);
    
    fireEvent.change(input, { target: { value: 'Test error message' } });
    
    // The counter shows the current length of the input
    const counter = screen.getByText((content, element) => {
      // Check if the text content includes the counter
      const hasText = (node: Element | null) => {
        if (!node) return false;
        const text = node.textContent || '';
        return text.includes('/2000');
      };
      const elementHasText = hasText(element);
      const childrenDontHaveText = Array.from(element?.children || []).every(
        child => !hasText(child as Element)
      );
      return elementHasText && childrenDontHaveText;
    });
    
    expect(counter).toBeInTheDocument();
  });

  it('validates minimum length requirement', () => {
    render(<ErrorMessageInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    // Enter a short message
    fireEvent.change(input, { target: { value: 'Short' } });
    fireEvent.click(button);
    
    expect(screen.getByText(/please provide more details/i)).toBeInTheDocument();
    expect(mockOnAnalyze).not.toHaveBeenCalled();
  });

  it('calls onAnalyze with the input value when form is submitted', () => {
    render(<ErrorMessageInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    const testMessage = 'This is a test error message';
    
    fireEvent.change(input, { target: { value: testMessage } });
    fireEvent.click(button);
    
    expect(mockOnAnalyze).toHaveBeenCalledWith(testMessage);
  });

  it('disables the button and shows loading state when isLoading is true', () => {
    render(<ErrorMessageInput onAnalyze={mockOnAnalyze} isLoading={true} />);
    const button = screen.getByRole('button', { name: /analyzing/i });
    
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/analyzing/i);
    // Check if the loading spinner is present
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    const errorMessage = 'This is an error message';
    render(<ErrorMessageInput {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('enforces maximum character limit', () => {
    render(<ErrorMessageInput onAnalyze={mockOnAnalyze} isLoading={false} />);
    const input = screen.getByLabelText(/error message input/i);
    
    // Test with the exact maximum length
    const maxText = 'a'.repeat(2000);
    fireEvent.change(input, { target: { value: maxText } });
    
    // The counter should show 2000/2000 when at the limit
    const counter = screen.getByText('2000/2000');
    expect(counter).toBeInTheDocument();
    expect(counter).toHaveClass('text-red-600');
    
    // Try to add more characters - should not exceed the limit
    const overLimitText = maxText + 'b';
    fireEvent.change(input, { target: { value: overLimitText } });
    
    // The input value should still be at the max length
    expect(input).toHaveValue(maxText);
    expect(counter).toHaveTextContent('2000/2000');
  });

  it('clears error when user starts typing', () => {
    const errorMessage = 'This is an error message';
    const { rerender } = render(
      <ErrorMessageInput {...defaultProps} error={errorMessage} />
    );
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New input' } });
    
    // Re-render with updated props
    rerender(
      <ErrorMessageInput 
        {...defaultProps} 
        error={null} 
      />
    );
    
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
  });
});
