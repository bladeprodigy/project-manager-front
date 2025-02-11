'use client';

import React, {useState} from 'react';
import ToastMessage from '@/components/ToastMessage';
import {RegisterFormProps, RegisterPayload} from '@/types/Auth';
import {extractApiError} from '@/utils/apiErrorHandler';


export default function RegisterForm({onToggleToLoginAction}: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterPayload>({
    email: '',
    password: '',
    name: '',
    surname: '',
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
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const apiError = await extractApiError(response);
        throw new Error(apiError.message || 'Registration failed');
      }

      setSuccessMessage('Registration successful!');

      setTimeout(() => {
        onToggleToLoginAction?.();
      }, 1500);
    } catch (error: unknown) {
      let message = 'An unexpected error occurred';
      if (error instanceof Error) {
        message = error.message;
      }
      setErrorMessage(message);
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-blue-600 mb-4 text-center">Register</h1>

        {errorMessage && (
            <ToastMessage
                message={errorMessage}
                onClose={() => setErrorMessage(null)}
            />
        )}
        {successMessage && (
            <ToastMessage
                message={successMessage}
                onClose={() => setSuccessMessage(null)}
                variant="success"
            />
        )}

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Name
          </label>
          <input
              type="text"
              id="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="surname" className="block text-gray-700 mb-2">
            Surname
          </label>
          <input
              type="text"
              id="surname"
              placeholder="Your surname"
              value={formData.surname}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              required
          />
        </div>
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
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
              type="password"
              id="password"
              placeholder="Create a password"
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
          Register
        </button>
      </form>
  );
}
