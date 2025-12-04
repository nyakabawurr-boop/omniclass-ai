'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { authService } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function SubscriptionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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

  const handleSubscribe = async (type: 'STUDENT' | 'INSTRUCTOR') => {
    if (user?.role === 'ADMIN') {
      toast.success('Admins have free access - no subscription needed');
      return;
    }

    setProcessing(true);
    try {
      const endpoint = type === 'STUDENT' ? '/api/subscriptions/student' : '/api/subscriptions/instructor';
      await api.post(endpoint, { billingPeriod: 'monthly' });
      toast.success('Subscription created! Please complete payment.');
      loadSubscription();
      router.push('/dashboard/payments');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create subscription');
    } finally {
      setProcessing(false);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Subscriptions</h1>

        {user?.role === 'ADMIN' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              <strong>Admin Access:</strong> You have free access to all features.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold mb-2">Student Plan</h3>
            <div className="text-4xl font-bold text-primary-600 mb-4">
              $10<span className="text-lg text-gray-600">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li>✓ Access to all subjects</li>
              <li>✓ AI Text/Chat tutoring</li>
              <li>✓ AI Video explanations</li>
              <li>✓ File upload support</li>
            </ul>
            <button
              onClick={() => handleSubscribe('STUDENT')}
              disabled={processing || subscription?.hasStudentSubscription}
              className={`w-full py-2 px-4 rounded-lg font-semibold ${
                subscription?.hasStudentSubscription
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {subscription?.hasStudentSubscription ? 'Active' : 'Subscribe'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold mb-2">Instructor Plan</h3>
            <div className="text-4xl font-bold text-primary-600 mb-4">
              $20<span className="text-lg text-gray-600">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li>✓ All student features</li>
              <li>✓ Create custom AI agents</li>
              <li>✓ Lesson plans & schemes</li>
              <li>✓ Generate assessments</li>
              <li>✓ Upload teaching materials</li>
            </ul>
            <button
              onClick={() => handleSubscribe('INSTRUCTOR')}
              disabled={processing || subscription?.hasInstructorSubscription}
              className={`w-full py-2 px-4 rounded-lg font-semibold ${
                subscription?.hasInstructorSubscription
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {subscription?.hasInstructorSubscription ? 'Active' : 'Subscribe'}
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
          <p className="text-gray-600 mb-4">
            We accept the following payment methods:
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="px-4 py-2 bg-gray-100 rounded-lg">EcoCash</span>
            <span className="px-4 py-2 bg-gray-100 rounded-lg">OneMoney</span>
            <span className="px-4 py-2 bg-gray-100 rounded-lg">Omari</span>
            <span className="px-4 py-2 bg-gray-100 rounded-lg">Bank Cards</span>
            <span className="px-4 py-2 bg-gray-100 rounded-lg">Bank Transfer</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

