'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { authService } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    loadSessions();
  }, [router]);

  useEffect(() => {
    if (currentSession) {
      loadMessages();
    }
  }, [currentSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSessions = async () => {
    try {
      const response = await api.get('/api/chat/sessions');
      setSessions(response.data);
      
      const subjectId = searchParams.get('subjectId');
      if (subjectId && response.data.length > 0) {
        const session = response.data.find((s: any) => s.subjectId === subjectId);
        if (session) {
          setCurrentSession(session);
        } else {
          createNewSession(subjectId);
        }
      } else if (response.data.length > 0) {
        setCurrentSession(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async (subjectId: string) => {
    try {
      const response = await api.post('/api/chat/sessions', { subjectId });
      const newSession = response.data;
      setSessions([newSession, ...sessions]);
      setCurrentSession(newSession);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create session');
    }
  };

  const loadMessages = async () => {
    if (!currentSession) return;
    try {
      const response = await api.get(`/api/chat/sessions/${currentSession.id}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentSession) return;

    const userMessage = input;
    setInput('');
    setSending(true);

    try {
      const response = await api.post(`/api/chat/sessions/${currentSession.id}/messages`, {
        content: userMessage
      });

      // Add messages to local state
      setMessages([...messages, response.data.userMessage, response.data.assistantMessage]);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">AI Chat Tutor</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sessions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-4">Chat Sessions</h2>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setCurrentSession(session)}
                    className={`w-full text-left p-2 rounded ${
                      currentSession?.id === session.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium text-sm">{session.subject?.name || 'New Chat'}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow flex flex-col" style={{ height: '600px' }}>
              {currentSession ? (
                <>
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">{currentSession.subject?.name}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        Start a conversation by asking a question!
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.role === 'USER' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-3xl rounded-lg p-3 ${
                              message.role === 'USER'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            <div
                              className={`text-xs mt-1 ${
                                message.role === 'USER' ? 'text-primary-100' : 'text-gray-500'
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    {sending && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleSend} className="p-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={sending || !input.trim()}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a session or create a new one
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

