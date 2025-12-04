'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { authService } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function VideoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    loadSessions();
  }, [router]);

  const loadSessions = async () => {
    try {
      const response = await api.get('/api/video/sessions');
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const subjectId = searchParams.get('subjectId');
    if (!subjectId) {
      toast.error('Please select a subject first');
      return;
    }

    setProcessing(true);
    try {
      const response = await api.post('/api/video/sessions', {
        subjectId,
        question
      });
      const newSession = response.data;
      setSessions([newSession, ...sessions]);
      setCurrentSession(newSession);
      setQuestion('');
      toast.success('Video session created! Processing...');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create session');
    } finally {
      setProcessing(false);
    }
  };

  const loadSessionDetails = async (sessionId: string) => {
    try {
      const response = await api.get(`/api/video/sessions/${sessionId}`);
      setCurrentSession(response.data);
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">AI Video Tutor</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create New Session */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold mb-4">Ask a Question</h2>
              <form onSubmit={handleCreateSession}>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your question here..."
                  className="w-full border rounded-lg p-3 mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={processing}
                />
                <button
                  type="submit"
                  disabled={processing || !question.trim()}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Generate Video'}
                </button>
              </form>
            </div>

            {/* Previous Sessions */}
            <div className="bg-white rounded-lg shadow p-4 mt-6">
              <h2 className="font-semibold mb-4">Previous Sessions</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => loadSessionDetails(session.id)}
                    className={`w-full text-left p-2 rounded ${
                      currentSession?.id === session.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium text-sm truncate">{session.question}</div>
                    <div className="text-xs text-gray-500">
                      {session.subject?.name} • {new Date(session.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs mt-1">
                      <span className={`px-2 py-1 rounded ${
                        session.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        session.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video Player Area */}
          <div className="lg:col-span-2">
            {currentSession ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="font-semibold mb-2">{currentSession.subject?.name}</h3>
                  <p className="text-gray-600">{currentSession.question}</p>
                </div>

                {currentSession.status === 'COMPLETED' ? (
                  <div className="p-6">
                    <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2">🎥</div>
                        <p>Video Player</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Video streaming will be implemented here
                        </p>
                        <p className="text-xs text-gray-500 mt-4">
                          Note: Videos cannot be downloaded, but text summary is available below
                        </p>
                      </div>
                    </div>

                    {currentSession.textSummary && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-2">Text Summary</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="whitespace-pre-wrap">{currentSession.textSummary}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(currentSession.textSummary);
                            toast.success('Summary copied to clipboard!');
                          }}
                          className="mt-2 text-primary-600 hover:text-primary-700 text-sm"
                        >
                          Copy Summary
                        </button>
                      </div>
                    )}
                  </div>
                ) : currentSession.status === 'PROCESSING' ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating video explanation...</p>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    Video generation failed. Please try again.
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                <div className="text-4xl mb-4">🎥</div>
                <p>Create a video session to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

