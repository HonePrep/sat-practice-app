import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function AdminPage() {
  const [jsonContent, setJsonContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Email management state
  const [approvedEmails, setApprovedEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/emails`);
      const data = await res.json();
      setApprovedEmails(data.emails || []);
    } catch { /* ignore */ }
  };

  const addEmail = async () => {
    if (!newEmail.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/admin/emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setApprovedEmails(data.emails);
        setNewEmail('');
        setEmailStatus({ type: 'success', message: 'Email added!' });
      }
    } catch {
      setEmailStatus({ type: 'error', message: 'Failed to add email' });
    }
  };

  const removeEmail = async (email: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/emails/${encodeURIComponent(email)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setApprovedEmails(data.emails);
    } catch { /* ignore */ }
  };

  const addBulkEmails = async () => {
    const emails = bulkEmails.split('\n').map(e => e.trim()).filter(e => e && e.includes('@'));
    if (emails.length === 0) return;
    try {
      const res = await fetch(`${API_BASE}/admin/emails/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails }),
      });
      const data = await res.json();
      if (data.success) {
        setApprovedEmails(data.emails);
        setBulkEmails('');
        setEmailStatus({ type: 'success', message: `Added ${data.added} emails!` });
      }
    } catch {
      setEmailStatus({ type: 'error', message: 'Failed to add emails' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonContent(content);
      setStatus(null);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!jsonContent.trim()) {
      setStatus({ type: 'error', message: 'Please upload or paste a JSON file.' });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const parsed = JSON.parse(jsonContent);
      
      // Transform to backend format if needed
      let testData;
      
      if (parsed.subject && parsed.modules) {
        // New schema format - transform it
        const isRW = parsed.subject === 'RW';
        testData = {
          title: parsed.title || `${isRW ? 'Reading & Writing' : 'Math'} Practice Test`,
          description: `${isRW ? 'Reading and Writing' : 'Math'} section with ${parsed.modules.length} modules`,
          difficulty: 'Medium',
          totalTimeSeconds: isRW ? 3840 : 4200, // 64 min RW, 70 min Math
          sections: parsed.modules.map((mod: any, idx: number) => ({
            name: `${isRW ? 'Reading and Writing' : 'Math'} - Module ${mod.moduleNumber || idx + 1}`,
            order: idx,
            timeLimitSeconds: isRW ? 1920 : 2100,
            questions: mod.questions.map((q: any, qIdx: number) => ({
              order: qIdx,
              prompt: q.prompt,
              passageText: q.passage || null,
              explanation: q.explanation || null,
              difficulty: 'Medium',
              tags: [],
              choices: q.choices.map((text: string, cIdx: number) => ({
                label: ['A', 'B', 'C', 'D'][cIdx],
                text: text,
                isCorrect: ['A', 'B', 'C', 'D'][cIdx] === q.correctAnswer
              }))
            }))
          }))
        };
      } else if (parsed.title && parsed.sections) {
        // Already in backend format
        testData = parsed;
      } else {
        throw new Error('Invalid JSON format. Must have either {subject, modules} or {title, sections}.');
      }

      const response = await fetch(`${API_BASE}/admin/import-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to import test');
      }

      setStatus({ type: 'success', message: `Test "${result.test.title}" created with ${result.test.totalQuestions} questions!` });
      setJsonContent('');
      setFileName('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to import test' });
    } finally {
      setIsLoading(false);
    }
  };

  const exampleSchema = `{
  "subject": "RW",
  "title": "Practice Test 1",
  "modules": [
    {
      "moduleNumber": 1,
      "questions": [
        {
          "passage": "Optional passage text...",
          "prompt": "Which choice best describes...",
          "choices": ["First option", "Second option", "Third option", "Fourth option"],
          "correctAnswer": "B",
          "explanation": "Optional explanation..."
        }
      ]
    },
    {
      "moduleNumber": 2,
      "questions": [...]
    }
  ]
}`;

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
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-lucas-50 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Practice Tests
          </Link>
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-lucas-100 text-lucas-700 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Upload Questions
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-10">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Questions</h1>
          <p className="text-gray-600 mb-8">Import your own SAT questions from a JSON file.</p>

          {/* Status Message */}
          {status && (
            <div className={`mb-6 p-4 rounded-xl ${
              status.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {status.message}
            </div>
          )}

          {/* Upload Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Upload JSON File</h2>
            
            <label className="block mb-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-lucas-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {fileName ? (
                  <p className="text-lucas-600 font-medium">{fileName}</p>
                ) : (
                  <>
                    <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-400 text-sm mt-1">JSON files only</p>
                  </>
                )}
              </div>
            </label>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Or paste JSON directly:</label>
              <textarea
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-lucas-500 focus:border-lucas-500"
                placeholder="Paste your JSON here..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !jsonContent.trim()}
              className="w-full py-3 bg-lucas-500 text-white font-semibold rounded-xl hover:bg-lucas-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Importing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Import Test
                </>
              )}
            </button>
          </div>

          {/* Schema Reference */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">JSON Schema Reference</h2>
            <p className="text-gray-600 text-sm mb-4">
              Your JSON file should follow this structure. Use "RW" for Reading & Writing or "Math" for the Math section.
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm">
              {exampleSchema}
            </pre>
          </div>

          {/* Email Management */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Approved Emails</h2>
            <p className="text-gray-600 text-sm mb-4">
              Manage which emails can access the practice tests. Add emails of users who signed up on Skool.
            </p>

            {emailStatus && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${emailStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {emailStatus.message}
              </div>
            )}

            {/* Add single email */}
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@example.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={addEmail}
                className="px-4 py-2 bg-lucas-500 text-white font-medium rounded-lg hover:bg-lucas-600"
              >
                Add
              </button>
            </div>

            {/* Bulk add */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bulk add (one email per line):</label>
              <textarea
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="email1@example.com&#10;email2@example.com&#10;email3@example.com"
              />
              <button
                onClick={addBulkEmails}
                className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
              >
                Add All
              </button>
            </div>

            {/* Email list */}
            <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
              {approvedEmails.length === 0 ? (
                <p className="p-4 text-gray-500 text-sm text-center">No approved emails yet</p>
              ) : (
                <ul>
                  {approvedEmails.map((email) => (
                    <li key={email} className="flex items-center justify-between px-4 py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm">{email}</span>
                      <button
                        onClick={() => removeEmail(email)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">{approvedEmails.length} approved email(s)</p>
          </div>
        </div>
      </main>
    </div>
  );
}
