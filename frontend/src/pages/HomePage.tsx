import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Fixed Sidebar */}
      <aside className="lucas-sidebar hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-lucas-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-bold text-xl text-gray-900">SAT Prep</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-lucas-100 text-lucas-700 font-medium">
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
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-lucas-50 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Upload Questions
          </Link>
        </nav>

        <div className="pt-6 border-t border-lucas-100">
          <a 
            href="https://skool.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-lucas-500 text-white font-medium hover:bg-lucas-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Join Skool Course
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-4 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-lucas-500 flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="font-bold text-lg">SAT Prep</span>
            </div>
            <Link to="/dashboard" className="px-4 py-2 bg-lucas-500 text-white rounded-lg font-medium text-sm">
              Start Practice
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-gradient min-h-[80vh] flex items-center">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur rounded-full text-lucas-700 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-lucas-500 animate-pulse"></span>
              Free SAT Practice Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Master the SAT with
              <span className="text-lucas-600"> Real Practice</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience authentic digital SAT practice tests with the same format, timing, and interface as the real exam. Track your progress and improve your score.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-lucas-500 text-white font-semibold rounded-2xl hover:bg-lucas-600 transition-all shadow-lg shadow-lucas-500/25 hover:shadow-xl hover:shadow-lucas-500/30"
              >
                Start Practice Test
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="https://skool.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all border border-gray-200"
              >
                Join Our Community
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Everything You Need to Succeed</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Our platform mirrors the official digital SAT experience so you know exactly what to expect on test day.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-lucas-50 border border-lucas-100">
                <div className="w-12 h-12 rounded-xl bg-lucas-500 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Authentic Format</h3>
                <p className="text-gray-600">Two modules per section, exact timing, and the same question types you'll see on the real SAT.</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-lucas-50 border border-lucas-100">
                <div className="w-12 h-12 rounded-xl bg-lucas-500 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Score Tracking</h3>
                <p className="text-gray-600">See your scaled scores, review answers with explanations, and track your improvement over time.</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-lucas-50 border border-lucas-100">
                <div className="w-12 h-12 rounded-xl bg-lucas-500 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Extra Time Option</h3>
                <p className="text-gray-600">Practice with 1.5x extended time if you have accommodations, or use it to build confidence.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-lucas-500">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Boost Your Score?</h2>
            <p className="text-lucas-100 mb-8">Join thousands of students preparing for the digital SAT.</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-lucas-600 font-semibold rounded-2xl hover:bg-lucas-50 transition-all"
            >
              Take a Practice Test Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
            <p>This is an independent practice platform. Not affiliated with College Board.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
