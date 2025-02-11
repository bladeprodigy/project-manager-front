'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {LoginPayload, LoginResponse} from '@/types/Auth';
import ToastMessage from '@/components/ToastMessage';
import {extractApiError} from '@/utils/apiErrorHandler';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginPayload>({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {id, value} = e.target;
    setFormData((prev) => ({...prev, [id]: value}));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const apiError = await extractApiError(response);
        throw new Error(apiError.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      console.log('Received token:', data.token);
      localStorage.setItem('token', data.token);

      const meResponse = await fetch('http://localhost:8080/users/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`,
        },
      });
      if (!meResponse.ok) {
        throw new Error('Failed to fetch current user information');
      }
      const meData = await meResponse.json();
      console.log('User data:', meData);
      localStorage.setItem('userId', meData.id.toString());
      localStorage.setItem('userRole', meData.role.toString());

      setSuccessMessage('Login successful!');

      setTimeout(() => {
        router.push(`/projects`);
      }, 500);
    } catch (error: unknown) {
      let message = 'An unexpected error occurred';
      if (error instanceof Error) {
        message = error.message;
      }
      setErrorMessage(message);
    }
  };

  return (
      <>
        {errorMessage && (
            <ToastMessage
                message={errorMessage}
                onClose={() => setErrorMessage(null)}
                variant="error"
            />
        )}

        {successMessage && (
            <ToastMessage
                message={successMessage}
                onClose={() => setSuccessMessage(null)}
                variant="success"
            />
        )}

        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold text-blue-600 mb-4 text-center">Login</h1>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
                type="password"
                id="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                required
            />
          </div>
          <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </>
  );
}
