'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { authService } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function InstructorPortalPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      router.push('/dashboard');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [profileRes, materialsRes] = await Promise.all([
        api.get('/api/instructors/me').catch(() => ({ data: null })),
        api.get('/api/instructors/materials').catch(() => ({ data: [] }))
      ]);
      setProfile(profileRes.data);
      setMaterials(materialsRes.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    try {
      await api.post('/api/instructors/me', {
        bio: '',
        qualifications: '',
        subjects: [],
        levels: []
      });
      toast.success('Profile created!');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create profile');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Instructor Portal</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Instructor Profile</h2>
          {profile ? (
            <div>
              {profile.bio && <p className="text-gray-600 mb-2">{profile.bio}</p>}
              {profile.qualifications && (
                <p className="text-gray-600 mb-2">
                  <strong>Qualifications:</strong> {profile.qualifications}
                </p>
              )}
              <button
                onClick={() => router.push('/dashboard/instructor/profile')}
                className="text-primary-600 hover:text-primary-700"
              >
                Edit Profile →
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">Create your instructor profile to get started.</p>
              <button
                onClick={handleCreateProfile}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Create Profile
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Link
            href="/dashboard/instructor/materials"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">Teaching Materials</h3>
            <p className="text-gray-600 text-sm">
              Upload and manage your teaching resources
            </p>
          </Link>

          <Link
            href="/dashboard/instructor/lesson-plans"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">Lesson Plans</h3>
            <p className="text-gray-600 text-sm">
              Create and manage lesson plans with AI assistance
            </p>
          </Link>

          <Link
            href="/dashboard/instructor/schemes"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2">Schemes of Work</h3>
            <p className="text-gray-600 text-sm">
              Generate term/year-long schemes of work
            </p>
          </Link>

          <Link
            href="/dashboard/instructor/assessments"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Assessments</h3>
            <p className="text-gray-600 text-sm">
              Generate exercises, quizzes, and exams
            </p>
          </Link>
        </div>

        {/* Recent Materials */}
        {materials.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Materials</h2>
            <div className="space-y-2">
              {materials.slice(0, 5).map((material) => (
                <div key={material.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <h4 className="font-medium">{material.title}</h4>
                    {material.subject && (
                      <p className="text-sm text-gray-500">{material.subject.name}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(material.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/instructor/materials"
              className="text-primary-600 hover:text-primary-700 mt-4 inline-block"
            >
              View All Materials →
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

