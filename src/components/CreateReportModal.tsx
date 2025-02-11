'use client';

import React, {useState} from 'react';
import ToastMessage from '@/components/ToastMessage';
import {CreateReportModalProps} from "@/types/Project";
import {ProjectReport} from "@/types/ProjectReport";

export default function CreateReportModal({
                                            projectId,
                                            onCloseAction,
                                            onReportCreatedAction,
                                          }: CreateReportModalProps) {
  const [formData, setFormData] = useState({title: '', content: ''});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {id, value} = e.target;
    setFormData((prev) => ({...prev, [id]: value}));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/projects/project-reports/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create report');
      }

      const data: ProjectReport = await response.json();
      setSuccessMessage('Report created successfully!');
      console.log('New report created:', data);

      setTimeout(() => {
        onReportCreatedAction(data);
        onCloseAction();
      }, 500);
    } catch (error: unknown) {
      let message = 'An unexpected error occurred';
      if (error instanceof Error) {
        message = error.message;
      }
      setErrorMessage(message);
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
          <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
            Create Report
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 mb-2">
                Title
              </label>
              <input
                  type="text"
                  id="title"
                  placeholder="Report Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="content" className="block text-gray-700 mb-2">
                Content
              </label>
              <textarea
                  id="content"
                  placeholder="Report Content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black min-h-[150px]"
                  required
              />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? 'Creating...' : 'Create Report'}
            </button>
          </form>
        </div>
      </div>
  );
}
