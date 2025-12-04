'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { authService } from '@/lib/auth';

export default function SubjectsPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'ORDINARY' | 'ADVANCED'>('ORDINARY');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    loadSubjects();
  }, [selectedLevel, router]);

  const loadSubjects = async () => {
    try {
      const response = await api.get(`/api/subjects?level=${selectedLevel}`);
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to load subjects:', error);
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

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Subjects</h1>

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedLevel('ORDINARY')}
              className={`px-6 py-2 rounded-lg font-semibold ${
                selectedLevel === 'ORDINARY'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Ordinary Level (Form 1-4)
            </button>
            <button
              onClick={() => setSelectedLevel('ADVANCED')}
              className={`px-6 py-2 rounded-lg font-semibold ${
                selectedLevel === 'ADVANCED'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Advanced Level (Form 5-6)
            </button>
          </div>
        </div>

        {subjects.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-600">No subjects available for this level.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/dashboard/subjects/${subject.id}`}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
                {subject.description && (
                  <p className="text-gray-600 text-sm">{subject.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

