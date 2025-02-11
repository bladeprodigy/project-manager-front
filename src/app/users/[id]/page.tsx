'use client';

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import ToastMessage from '@/components/ToastMessage';
import ChangeWorkStatusModal from '@/components/ChangeWorkStatusModal';
import CreateReportModal from '@/components/CreateReportModal';
import EditUserModal from '@/components/EditUserModal';
import DeleteUserModal from '@/components/DeleteUserModal';
import {Project} from "@/types/Project";
import {User} from "@/types/User";

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id;
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [statusModalData, setStatusModalData] = useState<{
    projectId: number;
    isManager: boolean;
  } | null>(null);
  const [reportModalData, setReportModalData] = useState<{ projectId: number } | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setLoggedInUserId(Number(storedUserId));
    }
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data: User = await response.json();
        console.log('User response:', data);
        setUser(data);
      } catch (err: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
          <p className="text-black text-center">Loading...</p>
        </div>
    );
  }
  if (error) {
    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
          <ToastMessage message={error} onClose={() => setError(null)} variant="error"/>
        </div>
    );
  }
  if (!user) {
    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
          <p className="text-black text-center">User not found.</p>
        </div>
    );
  }

  const handleStatusUpdated = () => {
    router.refresh();
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
      <div className="min-h-screen bg-blue-50 p-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-blue-600">User Details</h1>
            {userRole === 'ADMIN' && (
                <div className="flex gap-4">
                  <button
                      onClick={() => setShowEditModal(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Edit User
                  </button>
                  <button
                      onClick={() => setShowDeleteModal(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete User
                  </button>
                </div>
            )}
          </div>

          <div className="mb-8">
            <p className="text-black mb-2">
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p className="text-black mb-2">
              <span className="font-semibold">Surname:</span> {user.surname}
            </p>
            <p className="text-black mb-2">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="text-black mb-2">
              <span className="font-semibold">Role:</span> {user.role}
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b border-gray-300 pb-2">
              Projects (Member)
            </h2>
            {user.projects && user.projects.length > 0 ? (
                <ul className="space-y-4">
                  {user.projects.map((project: Project) => (
                      <li
                          key={project.id}
                          className="p-4 border border-gray-300 rounded flex justify-between items-center hover:bg-gray-100"
                      >
                        <div
                            onClick={() => router.push(`/projects/${project.id}`)}
                            className="cursor-pointer"
                        >
                          <p className="text-black">
                            <span className="font-semibold">Project Name:</span> {project.name}
                          </p>
                        </div>
                        {loggedInUserId === user.id && (
                            <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setStatusModalData({projectId: project.id, isManager: false});
                                }}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                            >
                              Change Status
                            </button>
                        )}
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-black">This user is not assigned to any projects.</p>
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b border-gray-300 pb-2">
              Managed Projects
            </h2>
            {user.projectsManaged && user.projectsManaged.length > 0 ? (
                <ul className="space-y-4">
                  {user.projectsManaged.map((project: Project) => (
                      <li
                          key={project.id}
                          className="p-4 border border-gray-300 rounded flex justify-between items-center hover:bg-gray-100"
                      >
                        <div
                            onClick={() => router.push(`/projects/${project.id}`)}
                            className="cursor-pointer"
                        >
                          <p className="text-black">
                            <span className="font-semibold">Project Name:</span> {project.name}
                          </p>
                        </div>
                        {loggedInUserId === user.id && (
                            <div className="flex gap-2">
                              <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setStatusModalData({projectId: project.id, isManager: true});
                                  }}
                                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                              >
                                Change Status
                              </button>
                              <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setReportModalData({projectId: project.id});
                                  }}
                                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                              >
                                Create Report
                              </button>
                            </div>
                        )}
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-black">This user does not manage any projects.</p>
            )}
          </section>
        </div>

        {statusModalData && (
            <ChangeWorkStatusModal
                projectId={statusModalData.projectId}
                userId={user.id}
                isManager={statusModalData.isManager}
                onCloseAction={() => setStatusModalData(null)}
                onStatusUpdatedAction={handleStatusUpdated}
            />
        )}
        {reportModalData && (
            <CreateReportModal
                projectId={reportModalData.projectId}
                onCloseAction={() => {
                  setReportModalData(null);
                }}
                onReportCreatedAction={() => {
                  setReportModalData(null);
                  router.refresh();
                }}
            />
        )}

        {showEditModal && (
            <EditUserModal
                user={user}
                onCloseAction={() => setShowEditModal(false)}
                onUserUpdatedAction={handleUserUpdated}
            />
        )}
        {showDeleteModal && (
            <DeleteUserModal
                userId={user.id}
                onCloseAction={() => setShowDeleteModal(false)}
            />
        )}
      </div>
  );
}
