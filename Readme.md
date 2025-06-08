# Error Message Analyzer

A full-stack application that analyzes error messages using AI and provides actionable feedback.

## Features

1. **Error Analysis**
   - Evaluate error message quality using a scoring system
   - Detailed analysis based on industry best practices
   - Suggestions for improvement
   - Example rewritten messages

2. **Modern Tech Stack**
   - Hono backend for fast API handling
   - React frontend with TypeScript
   - AI-powered analysis using OpenAI
   - Tailwind CSS for styling

## Project Structure

```
error-message-analyser/
├── backend/               # API server
│   ├── src/
│   │   ├── lib/           # Core services (LLM integration)
│   │   ├── routes/        # API endpoints
│   │   └── types/         # TypeScript definitions
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── assets/        # Static assets
│   │   └── __tests__/     # Component tests
```

## Installation

### Backend Setup
1. Navigate to backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with OpenAI API key:
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## Technologies Used

### Backend
- Hono (web framework)
- TypeScript
- OpenAI SDK
- Zod (validation)

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Jest (testing)
- React Query

## Testing

Frontend tests can be run with:
```bash
cd frontend
npm test
```

Tests cover:
- Component rendering
- User interactions
- State management
- Error handling

### Environment Variables
`OPENAI_API_KEY` must be set in backend/.env for the AI analysis to work.