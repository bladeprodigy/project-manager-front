'use client';

import React, {useState} from 'react';
import ToastMessage from '@/components/ToastMessage';
import {EditUserModalProps} from "@/types/Project";
import {User} from "@/types/User";

export default function EditUserModal({user, onCloseAction, onUserUpdatedAction}: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    surname: user.surname || '',
    email: user.email || '',
    role: user.role || '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {id, value} = e.target;
    setFormData((prev) => ({...prev, [id]: value}));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      const updatedUser: User = await response.json();
      setSuccessMessage('User updated successfully!');
      setTimeout(() => {
        onUserUpdatedAction(updatedUser);
        onCloseAction();
      }, 500);
    } catch (err: unknown) {
      let message = 'An unexpected error occurred';
      if (err instanceof Error) {
        message = err.message;
      }
      setErrorMessage(message);
    }
  };

  return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-50" onClick={onCloseAction}></div>
        <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={onCloseAction}
              title="Close"
          >
            &times;
          </button>
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
          <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Edit User</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name
              </label>
              <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="surname" className="block text-gray-700 mb-2">
                Surname
              </label>
              <input
                  type="text"
                  id="surname"
                  placeholder="Surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="role" className="block text-gray-700 mb-2">
                Role
              </label>
              <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
              </select>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
  );
}
