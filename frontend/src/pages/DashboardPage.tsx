import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { getTests } from '../api';
import type { TestListItem } from '../types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [extraTime, setExtraTime] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const { data: tests, isLoading, error } = useQuery({
    queryKey: ['tests'],
    queryFn: getTests,
  });

  const startTest = (testId: string) => {
    // Store extra time preference
    localStorage.setItem(`extraTime_${testId}`, extraTime.toString());
    navigate(`/test/${testId}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (extraTime) {
      return `${Math.floor(mins * 1.5)} min (1.5x)`;
    }
    return `${mins} min`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <aside className="lucas-sidebar hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-lucas-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-bold text-xl text-gray-900">SAT Prep</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-lucas-50 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-lucas-100 text-lucas-700 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Practice Tests
          </Link>
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-lucas-50 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Upload Questions
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Tests</h1>
          <p className="text-gray-600">Select a test to begin your practice session.</p>
        </div>

        {/* Extra Time Toggle */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <label className="flex items-center gap-4 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={extraTime}
                onChange={(e) => setExtraTime(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-12 h-7 rounded-full transition-colors ${extraTime ? 'bg-lucas-500' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform mt-1 ${extraTime ? 'translate-x-6 ml-0' : 'translate-x-1'}`}></div>
              </div>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Extended Time (1.5x)</span>
              <p className="text-sm text-gray-500">Enable if you have testing accommodations or want extra practice time.</p>
            </div>
          </label>
        </div>

        {/* Tests Grid */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lucas-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
            Failed to load tests. Make sure the backend server is running.
          </div>
        )}

        {tests && tests.length === 0 && (
          <div className="bg-gray-100 rounded-xl p-12 text-center">
            <p className="text-gray-600 mb-2">No practice tests available yet.</p>
            <Link to="/admin" className="text-lucas-600 font-medium hover:underline">
              Upload questions to create a test →
            </Link>
          </div>
        )}

        {tests && tests.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tests.map((test: TestListItem) => (
              <div
                key={test.id}
                className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                  selectedTest === test.id ? 'border-lucas-500 shadow-lg' : 'border-gray-200 hover:border-lucas-300'
                }`}
                onClick={() => setSelectedTest(test.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{test.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    test.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    test.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {test.difficulty}
                  </span>
                </div>

                {test.description && (
                  <p className="text-gray-600 text-sm mb-4">{test.description}</p>
                )}

                <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {test.totalQuestions} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(test.totalTimeSeconds)}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    {test.sections.length} module{test.sections.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startTest(test.id);
                  }}
                  className="w-full py-3 bg-lucas-500 text-white font-semibold rounded-xl hover:bg-lucas-600 transition-colors flex items-center justify-center gap-2"
                >
                  Start Test
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
