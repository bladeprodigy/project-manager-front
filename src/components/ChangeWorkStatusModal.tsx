'use client';

import React, {useState} from 'react';
import {ChangeWorkStatusModalProps} from "@/types/ProjectMember";

export default function ChangeWorkStatusModal({
                                                projectId,
                                                userId,
                                                isManager,
                                                onCloseAction,
                                                onStatusUpdatedAction,
                                              }: ChangeWorkStatusModalProps) {
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const token = localStorage.getItem('token');
    const endpoint = isManager
        ? `http://localhost:8080/projects/project-managers/${projectId}/${userId}?status=${encodeURIComponent(newStatus)}`
        : `http://localhost:8080/projects/project-members/${projectId}/${userId}?status=${encodeURIComponent(newStatus)}`;
    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      onStatusUpdatedAction();
      onCloseAction();
    } catch (err: unknown) {
      let errMsg = 'An unexpected error occurred';
      if (err instanceof Error) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Change Status</h2>
          {error && <p className="text-red-500 text-center mb-2">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter new status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                required
            />
            <div className="flex justify-end gap-2">
              <button
                  type="button"
                  onClick={onCloseAction}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {loading ? 'Updating...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
