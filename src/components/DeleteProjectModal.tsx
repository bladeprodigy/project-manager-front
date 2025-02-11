'use client';

import React, {useState} from 'react';
import ToastMessage from '@/components/ToastMessage';
import {useRouter} from 'next/navigation';
import {DeleteProjectModalProps} from "@/types/Project";

export default function DeleteProjectModal({projectId, onCloseAction}: DeleteProjectModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete project');
      }
      onCloseAction();
      router.push('/projects');
    } catch (error: unknown) {
      let message = 'An unexpected error occurred';
      if (error instanceof Error) {
        message = error.message;
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
              <ToastMessage message={errorMessage} onClose={() => setErrorMessage(null)}
                            variant="error"/>
          )}
          <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Confirm Delete</h2>
          <p className="text-center text-gray-700 mb-6">
            Are you sure you want to delete this project?
          </p>
          <div className="flex justify-around">
            <button
                onClick={onCloseAction}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
  );
}
