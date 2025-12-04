'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { authService } from '@/lib/auth';

export default function SubjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    loadSubject();
  }, [params.id, router]);

  const loadSubject = async () => {
    try {
      const response = await api.get(`/api/subjects/${params.id}`);
      setSubject(response.data);
    } catch (error) {
      console.error('Failed to load subject:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">Loading...</div>
      </Layout>
    );
  }

  if (!subject) {
    return (
      <Layout>
        <div className="px-4 py-6 sm:px-0">
          <p className="text-red-600">Subject not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <Link href="/dashboard/subjects" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Back to Subjects
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{subject.name}</h1>
        {subject.description && (
          <p className="text-gray-600 mb-6">{subject.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link
            href={`/dashboard/chat?subjectId=${subject.id}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">AI Text/Chat Tutor</h3>
            <p className="text-gray-600">
              Get instant help with detailed, step-by-step explanations
            </p>
          </Link>

          <Link
            href={`/dashboard/video?subjectId=${subject.id}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold mb-2">AI Video Tutor</h3>
            <p className="text-gray-600">
              Watch video explanations with whiteboard animations
            </p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

