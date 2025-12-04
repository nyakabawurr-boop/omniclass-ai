'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { authService } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    loadSubscription();
  }, [router]);

  const loadSubscription = async () => {
    try {
      const response = await api.get('/api/subscriptions/me');
      setSubscription(response.data);
    } catch (error) {
      console.error('Failed to load subscription:', error);
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

  const hasAccess = user?.role === 'ADMIN' || subscription?.hasStudentSubscription || subscription?.hasInstructorSubscription;

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {user?.role === 'ADMIN' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              <strong>Admin Access:</strong> You have full access to all features.
            </p>
          </div>
        )}

        {!hasAccess && user?.role !== 'ADMIN' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 mb-2">
              <strong>No Active Subscription:</strong> Please subscribe to access features.
            </p>
            <Link
              href="/dashboard/subscriptions"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View Subscription Options →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user?.role === 'STUDENT' || user?.role === 'ADMIN' ? (
            <>
              <Link
                href="/dashboard/subjects"
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2">Browse Subjects</h3>
                <p className="text-gray-600">
                  Access AI tutoring for all Ordinary and Advanced Level subjects
                </p>
              </Link>
              <Link
                href="/dashboard/chat"
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2">AI Chat Tutor</h3>
                <p className="text-gray-600">
                  Get instant help with text-based AI tutoring
                </p>
              </Link>
              <Link
                href="/dashboard/video"
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2">AI Video Tutor</h3>
                <p className="text-gray-600">
                  Watch video explanations with whiteboard animations
                </p>
              </Link>
            </>
          ) : null}

          {user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN' ? (
            <>
              <Link
                href="/dashboard/instructor"
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2">Instructor Portal</h3>
                <p className="text-gray-600">
                  Manage your profile, materials, and AI agents
                </p>
              </Link>
              <Link
                href="/dashboard/instructor/lesson-plans"
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2">Lesson Plans</h3>
                <p className="text-gray-600">
                  Create and manage lesson plans with AI assistance
                </p>
              </Link>
              <Link
                href="/dashboard/instructor/assessments"
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2">Assessments</h3>
                <p className="text-gray-600">
                  Generate exercises, quizzes, and exams
                </p>
              </Link>
            </>
          ) : null}

          {user?.role === 'ADMIN' && (
            <Link
              href="/dashboard/admin"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-gray-600">
                Manage users, subjects, and platform settings
              </p>
            </Link>
          )}
        </div>

        {subscription && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Student Subscription: </span>
                <span className={subscription.hasStudentSubscription ? 'text-green-600' : 'text-red-600'}>
                  {subscription.hasStudentSubscription ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <span className="font-medium">Instructor Subscription: </span>
                <span className={subscription.hasInstructorSubscription ? 'text-green-600' : 'text-red-600'}>
                  {subscription.hasInstructorSubscription ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

