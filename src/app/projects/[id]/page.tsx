'use client';

import React, {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import ToastMessage from '@/components/ToastMessage';
import ReportModal from '@/components/ReportModal';
import ChangeStatusModal from '@/components/ChangeStatusModal';
import UpdateProjectModal from '@/components/UpdateProjectModal';
import DeleteProjectModal from '@/components/DeleteProjectModal';
import CreateProjectManagerModal from '@/components/CreateProjectManagerModal';
import CreateProjectMemberModal from '@/components/CreateProjectMemberModal';
import {Project} from '@/types/Project';
import {ProjectReport} from "@/types/ProjectReport";

export default function ProjectPage() {
  const params = useParams();
  const {id: projectId} = params;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ProjectReport | null>(null);

  const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false);
  const [showUpdateProjectModal, setShowUpdateProjectModal] = useState<boolean>(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState<boolean>(false);
  const [showCreateManagerModal, setShowCreateManagerModal] = useState<boolean>(false);
  const [showCreateMemberModal, setShowCreateMemberModal] = useState<boolean>(false);

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  const refreshProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/projects/${projectId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }
      const data: Project = await response.json();
      setProject(data);
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  useEffect(() => {
    refreshProject().then(() => setLoading(false));
  }, [projectId]);

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

  if (!project) {
    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
          <p className="text-black text-center">Project not found.</p>
        </div>
    );
  }

  const updateManagerStatus = async (managerId: number, active: boolean) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
          `http://localhost:8080/projects/project-managers/${managerId}/active?active=${active}`,
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
        throw new Error(errorData.message || 'Failed to update manager status');
      }
      await refreshProject();
    } catch (err: unknown) {
      let message = 'An unexpected error occurred';
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    }
  };

  const updateMemberStatus = async (memberId: number, active: boolean) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
          `http://localhost:8080/projects/project-members/${memberId}/active?active=${active}`,
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
        throw new Error(errorData.message || 'Failed to update member status');
      }
      await refreshProject();
    } catch (err: unknown) {
      let message = 'An unexpected error occurred';
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    }
  };

  return (
      <div className="min-h-screen bg-blue-50 p-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Project Details</h1>
            {userRole === 'ADMIN' && (
                <div className="flex gap-4">
                  <button
                      onClick={() => setShowChangeStatusModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Change Status
                  </button>
                  <button
                      onClick={() => setShowUpdateProjectModal(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Edit Project
                  </button>
                  <button
                      onClick={() => setShowDeleteProjectModal(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete Project
                  </button>
                </div>
            )}
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b border-gray-300 pb-2">
              General Information
            </h2>
            <p className="text-black mb-2">
              <span className="font-semibold">Name:</span> {project.name}
            </p>
            <p className="text-black mb-2">
              <span className="font-semibold">Description:</span>{' '}
              {project.description ? project.description : 'N/A'}
            </p>
            <p className="text-black mb-2">
              <span className="font-semibold">Client Name:</span> {project.clientName}
            </p>
            <p className="text-black">
              <span className="font-semibold">Status:</span> {project.status}
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-blue-600 border-b border-gray-300 pb-2">
                Active Project Manager
              </h2>
              {userRole === 'ADMIN' && (
                  <button
                      onClick={() => setShowCreateManagerModal(true)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Add Manager
                  </button>
              )}
            </div>
            {project.activeProjectManager ? (
                <div
                    className="p-4 border border-gray-300 rounded flex items-center justify-between">
                  <div>
                    <p className="text-black">
                      <span className="font-semibold">Name:</span>{' '}
                      {project.activeProjectManager.user.name} {project.activeProjectManager.user.surname}
                    </p>
                    <p className="text-black">
                      <span className="font-semibold">Email:</span>{' '}
                      {project.activeProjectManager.user.email}
                    </p>
                    <p className="text-black">
                      <span className="font-semibold">Status:</span>{' '}
                      {project.activeProjectManager.status || 'N/A'}
                    </p>
                  </div>
                  {userRole === 'ADMIN' && (
                      <button
                          onClick={() =>
                              updateManagerStatus(project.activeProjectManager!.id, false)
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Deactivate
                      </button>
                  )}
                </div>
            ) : (
                <p className="text-black">No active project manager.</p>
            )}
          </section>

          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-blue-600 border-b border-gray-300 pb-2">
                Active Project Members
              </h2>
              {userRole === 'ADMIN' && (
                  <button
                      onClick={() => setShowCreateMemberModal(true)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Add Member
                  </button>
              )}
            </div>
            {project.activeProjectMembers && project.activeProjectMembers.length > 0 ? (
                <ul className="space-y-4">
                  {project.activeProjectMembers.map(member => (
                      <li
                          key={member.id}
                          className="p-4 border border-gray-300 rounded flex items-center justify-between"
                      >
                        <div>
                          <p className="text-black">
                            <span className="font-semibold">Name:</span>{' '}
                            {member.user.name} {member.user.surname}
                          </p>
                          <p className="text-black">
                            <span className="font-semibold">Role:</span>{' '}
                            {member.projectRole || 'N/A'}
                          </p>
                          <p className="text-black">
                            <span className="font-semibold">Email:</span>{' '}
                            {member.user.email}
                          </p>
                          <p className="text-black">
                            <span className="font-semibold">Status:</span>{' '}
                            {member.status || 'N/A'}
                          </p>
                        </div>
                        {userRole === 'ADMIN' && (
                            <button
                                onClick={() => updateMemberStatus(member.id, false)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                            >
                              Deactivate
                            </button>
                        )}
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-black">No active project members.</p>
            )}
          </section>

          {project.projectReports && project.projectReports.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b border-gray-300 pb-2">
                  Project Reports
                </h2>
                <ul className="space-y-2">
                  {project.projectReports.map(report => (
                      <li
                          key={report.id}
                          className="p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
                          onClick={() => setSelectedReport(report)}
                      >
                        <p className="text-black mb-1">
                          <span className="font-semibold">Title:</span> {report.title}
                        </p>
                        <p className="text-black">
                          <span className="font-semibold">Date:</span> {report.reportDate}
                        </p>
                      </li>
                  ))}
                </ul>
              </section>
          )}

          {project.inactiveProjectManagers && project.inactiveProjectManagers.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b border-gray-300 pb-2">
                  Inactive Project Managers
                </h2>
                <ul className="space-y-2">
                  {project.inactiveProjectManagers.map(manager => (
                      <li
                          key={manager.id}
                          className="p-4 border border-gray-300 rounded flex items-center justify-between"
                      >
                        <div>
                          <p className="text-black">
                            <span className="font-semibold">Name:</span> {manager.user.name}{' '}
                            {manager.user.surname}
                          </p>
                          <p className="text-black">
                            <span className="font-semibold">Email:</span> {manager.user.email}
                          </p>
                        </div>
                        {userRole === 'ADMIN' && (
                            <button
                                onClick={() => updateManagerStatus(manager.id, true)}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                            >
                              Reactivate
                            </button>
                        )}
                      </li>
                  ))}
                </ul>
              </section>
          )}

          {project.inactiveProjectMembers && project.inactiveProjectMembers.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b border-gray-300 pb-2">
                  Inactive Project Members
                </h2>
                <ul className="space-y-2">
                  {project.inactiveProjectMembers.map(member => (
                      <li
                          key={member.id}
                          className="p-4 border border-gray-300 rounded flex items-center justify-between"
                      >
                        <div>
                          <p className="text-black mb-1">
                            <span className="font-semibold">Name:</span> {member.user.name}{' '}
                            {member.user.surname}
                          </p>
                          <p className="text-black mb-1">
                            <span
                                className="font-semibold">Role:</span> {member.projectRole || 'N/A'}
                          </p>
                          <p className="text-black">
                            <span className="font-semibold">Email:</span> {member.user.email}
                          </p>
                        </div>
                        {userRole === 'ADMIN' && (
                            <button
                                onClick={() => updateMemberStatus(member.id, true)}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                            >
                              Reactivate
                            </button>
                        )}
                      </li>
                  ))}
                </ul>
              </section>
          )}
        </div>

        {selectedReport && (
            <ReportModal report={selectedReport} onCloseAction={() => setSelectedReport(null)}/>
        )}

        {userRole === 'ADMIN' && showChangeStatusModal && (
            <ChangeStatusModal
                projectId={project.id}
                currentStatus={project.status}
                onCloseAction={() => setShowChangeStatusModal(false)}
                onStatusChangedAction={refreshProject}
            />
        )}
        {userRole === 'ADMIN' && showUpdateProjectModal && (
            <UpdateProjectModal
                project={project}
                onCloseAction={() => setShowUpdateProjectModal(false)}
                onProjectUpdatedAction={refreshProject}
            />
        )}
        {userRole === 'ADMIN' && showDeleteProjectModal && (
            <DeleteProjectModal
                projectId={project.id}
                onCloseAction={() => setShowDeleteProjectModal(false)}
            />
        )}
        {userRole === 'ADMIN' && showCreateManagerModal && (
            <CreateProjectManagerModal
                projectId={project.id}
                onCloseAction={() => setShowCreateManagerModal(false)}
                onProjectUpdatedAction={refreshProject}
            />
        )}
        {userRole === 'ADMIN' && showCreateMemberModal && (
            <CreateProjectMemberModal
                projectId={project.id}
                onCloseAction={() => setShowCreateMemberModal(false)}
                onProjectUpdatedAction={refreshProject}
            />
        )}
      </div>
  );
}
