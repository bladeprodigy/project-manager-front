'use client';

import React, {useState} from 'react';
import ToastMessage from '@/components/ToastMessage';
import {UpdateProjectModalProps} from '@/types/Project';

export default function UpdateProjectModal({
                                             project,
                                             onCloseAction,
                                             onProjectUpdatedAction,
                                           }: UpdateProjectModalProps) {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    clientName: project.clientName,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {id, value} = e.target;
    setFormData((prev) => ({...prev, [id]: value}));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/projects/${project.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update project');
      }
      const updatedProject = await response.json();
      setSuccessMessage('Project updated successfully!');
      setTimeout(() => {
        onProjectUpdatedAction(updatedProject);
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
          <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Update Project</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Project Name
              </label>
              <input
                  type="text"
                  id="name"
                  placeholder="Project Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 mb-2">
                Description
              </label>
              <textarea
                  id="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  rows={3}
              ></textarea>
            </div>
            <div className="mb-6">
              <label htmlFor="clientName" className="block text-gray-700 mb-2">
                Client Name
              </label>
              <input
                  type="text"
                  id="clientName"
                  placeholder="Client Name"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
              />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Update Project
            </button>
          </form>
        </div>
      </div>
  );
}
