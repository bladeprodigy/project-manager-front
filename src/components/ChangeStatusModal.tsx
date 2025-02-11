'use client';

import React, {useState} from 'react';
import ToastMessage from '@/components/ToastMessage';
import {ChangeStatusModalProps} from "@/types/Project";

export default function ChangeStatusModal({
                                            projectId,
                                            currentStatus,
                                            onCloseAction,
                                            onStatusChangedAction,
                                          }: ChangeStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
          `http://localhost:8080/projects/${projectId}/status?status=${selectedStatus}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : '',
            },
          }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change status');
      }
      const updatedProject = await response.json();
      setSuccessMessage('Project status updated successfully!');
      setTimeout(() => {
        onStatusChangedAction(updatedProject);
        onCloseAction();
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
          {successMessage && (
              <ToastMessage message={successMessage} onClose={() => setSuccessMessage(null)}
                            variant="success"/>
          )}
          <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Change Project
            Status</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="status" className="block text-gray-700 mb-2">
                Select Status
              </label>
              <select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              >
                <option value="NEW">NEW</option>
                <option value="ONGOING">ONGOING</option>
                <option value="FINISHED">FINISHED</option>
                <option value="PAUSED">PAUSED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Change Status
            </button>
          </form>
        </div>
      </div>
  );
}
