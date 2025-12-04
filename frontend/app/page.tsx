import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600">OmniClass AI</h1>
            <div className="space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-primary-600 font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Tutoring for
            <span className="text-primary-600"> Zimbabwean Students</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            High-quality AI tutoring for Ordinary Level (Form 1-4) and Advanced Level (Form 5-6) students.
            Reduce the need for expensive extra lessons with our comprehensive AI-powered platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
            >
              Start Learning
            </Link>
            <Link
              href="/register?role=instructor"
              className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition"
            >
              Become an Instructor
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">All Subjects Covered</h3>
            <p className="text-gray-600">
              Comprehensive coverage of all Ordinary and Advanced Level subjects aligned with Zimbabwean curriculum.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold mb-2">AI Video & Text Tutors</h3>
            <p className="text-gray-600">
              Choose between video-style explanations with whiteboard animations or detailed text-based tutoring.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold mb-2">Instructor Tools</h3>
            <p className="text-gray-600">
              Powerful tools for instructors to create lesson plans, schemes of work, and assessments with AI assistance.
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center mb-12">Simple, Affordable Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200">
              <h4 className="text-2xl font-bold mb-4">Student Plan</h4>
              <div className="text-4xl font-bold text-primary-600 mb-4">$10<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-2 mb-6">
                <li>✓ Access to all subjects</li>
                <li>✓ AI Text/Chat tutoring</li>
                <li>✓ AI Video explanations</li>
                <li>✓ File upload support</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-primary-600">
              <h4 className="text-2xl font-bold mb-4">Instructor Plan</h4>
              <div className="text-4xl font-bold text-primary-600 mb-4">$20<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-2 mb-6">
                <li>✓ All student features</li>
                <li>✓ Create custom AI agents</li>
                <li>✓ Lesson plans & schemes</li>
                <li>✓ Generate assessments</li>
                <li>✓ Upload teaching materials</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Accepted Payment Methods:</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>EcoCash</span>
            <span>OneMoney</span>
            <span>Omari</span>
            <span>Bank Cards</span>
            <span>Bank Transfer</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-24 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 OmniClass AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

