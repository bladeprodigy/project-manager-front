'use client';

import React, {useEffect, useState} from 'react';
import ToastMessage from '@/components/ToastMessage';
import {CreateProjectMemberModalProps} from "@/types/ProjectMember";
import {User} from "@/types/User";


export default function CreateProjectMemberModal({
                                                   projectId,
                                                   onCloseAction,
                                                   onProjectUpdatedAction,
                                                 }: CreateProjectMemberModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/users', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (selectedUserId === "") {
      setErrorMessage('Please select a user');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/projects/project-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          userId: Number(selectedUserId),
          projectId: projectId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add project member');
      }
      const updatedProject = await response.json();
      setSuccessMessage('Project member added successfully!');
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
          <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Add Project Member</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="userId" className="block text-gray-700 mb-2">
                Select User
              </label>
              <select
                  id="userId"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                  required
              >
                <option value="">-- Select User --</option>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} {user.surname} ({user.email})
                    </option>
                ))}
              </select>
            </div>
            <button type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Add Member
            </button>
          </form>
        </div>
      </div>
  );
}
