# SAT Practice Test Application

A full-stack web application that delivers SAT-style digital practice tests with a Bluebook-inspired interface.

## Features

- **Authentic Test Experience**: Split-panel interface with passage on the left and questions on the right
- **Timer & Controls**: Countdown timer with hide/show toggle, directions dropdown
- **Question Navigation**: Numbered question pills showing answered, unanswered, and marked-for-review states
- **Auto-save**: Progress saved to localStorage and server every 30 seconds
- **Keyboard Shortcuts**: Use 1-4 or A-D to select answers, arrow keys to navigate
- **Score Report**: Scaled scores, section breakdown, and detailed question review
- **Admin Import**: JSON-based test import for easy content addition

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite via sql.js (pure JavaScript implementation)
- **State Management**: React Query + React Context

## Project Structure

```
sat-practice-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database models
│   │   └── seed.ts            # Seed data
│   ├── src/
│   │   └── index.ts           # Express server & API routes
│   ├── example-import.json    # Example JSON import format
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── api.ts             # API client functions
│   │   ├── types.ts           # TypeScript types
│   │   └── App.tsx            # Main app with routing
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Seed the database with sample data**:
   ```bash
   npm run db:seed
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server** (from `/backend`):
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:3001

2. **Start the frontend** (from `/frontend` in a new terminal):
   ```bash
   npm run dev
   ```
   App runs on http://localhost:5173

## API Endpoints

### Tests
- `GET /api/tests` - List all tests
- `GET /api/tests/:id` - Get test with sections/questions/choices

### Sessions
- `POST /api/sessions` - Create a new test session
- `GET /api/sessions/:id` - Get session for review
- `PUT /api/sessions/:id` - Update/submit session with answers

### Admin
- `POST /admin/import-test` - Import a test from JSON
- `DELETE /admin/tests/:id` - Delete a test

## Importing Tests

Use the JSON format shown in `backend/example-import.json`:

```bash
curl -X POST http://localhost:3001/admin/import-test \
  -H "Content-Type: application/json" \
  -d @example-import.json
```

## Keyboard Shortcuts

During test-taking:
- `1`, `2`, `3`, `4` or `A`, `B`, `C`, `D` - Select answer choice
- `←` or `J` - Previous question
- `→` or `K` - Next question  
- `M` - Toggle mark for review

## Scoring

The current scoring uses a simplified formula:
```
scaled_score = 200 + (correct / total) * 600
```

This maps raw scores to a 200-800 range. For production use, implement College Board's official equating tables.

## Building for Production

**Backend**:
```bash
cd backend
npm run build
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm run preview
```

## Extending the Application

### Adding Adaptive Testing
The data model supports multiple sections per test. To add adaptive logic:
1. Track performance in real-time during the session
2. Select next module's questions based on first module performance
3. Implement routing rules in the session state

### Adding More Question Types
The current model supports multiple choice. For grid-in/numeric:
1. Add a `questionType` field to the Question model
2. Create new input components for different types
3. Update scoring logic for numeric validation

## License

MIT
