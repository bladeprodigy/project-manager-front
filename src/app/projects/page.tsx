'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import ToastMessage from '@/components/ToastMessage';
import CreateProjectModal from '@/components/CreateProjectModal';
import {Project} from '@/types/Project';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  const [nameFilter, setNameFilter] = useState('');
  const [clientNameFilter, setClientNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (nameFilter) params.append('name', nameFilter);
      if (clientNameFilter) params.append('clientName', clientNameFilter);
      if (statusFilter) params.append('status', statusFilter);
      params.append('sortBy', sortBy);
      params.append('sortDir', sortDir);
      params.append('page', page.toString());
      params.append('size', size.toString());

      const url = `http://localhost:8080/projects?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      console.log('Projects response:', data);
      setProjects(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, sortBy, sortDir, size]);

  const handleSearch = () => {
    setPage(0);
    fetchProjects();
  };

  return (
      <div className="min-h-screen bg-blue-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Projects</h1>
            {userRole === 'ADMIN' && (
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Create New Project
                </button>
            )}
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">Project Name</label>
                <input
                    type="text"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    placeholder="Search by name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Client Name</label>
                <input
                    type="text"
                    value={clientNameFilter}
                    onChange={(e) => setClientNameFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    placeholder="Search by client name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Status</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                >
                  <option value="">All</option>
                  <option value="NEW">NEW</option>
                  <option value="ONGOING">ONGOING</option>
                  <option value="FINISHED">FINISHED</option>
                  <option value="PAUSED">PAUSED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Sort By</label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                >
                  <option value="name">Name</option>
                  <option value="clientName">Client Name</option>
                  <option value="status">Status</option>
                  <option value="creationDate">Creation Date</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Sort Direction</label>
                <select
                    value={sortDir}
                    onChange={(e) => setSortDir(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Page Size</label>
                <select
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                    onClick={handleSearch}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {loading ? (
              <p className="text-center text-black">Loading...</p>
          ) : error ? (
              <ToastMessage message={error} onClose={() => setError(null)} variant="error"/>
          ) : projects.length === 0 ? (
              <p className="text-center text-black">No projects found.</p>
          ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-3 text-left text-black">Project Name
                    </th>
                    <th className="border border-gray-300 p-3 text-left text-black">Client Name</th>
                    <th className="border border-gray-300 p-3 text-left text-black">Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  {projects.map((project) => (
                      <tr
                          key={project.id}
                          className="hover:bg-gray-100 cursor-pointer"
                          onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        <td className="border border-gray-300 p-3 text-black">{project.name}</td>
                        <td className="border border-gray-300 p-3 text-black">{project.clientName}</td>
                        <td className="border border-gray-300 p-3 text-black">{project.status}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <button
                onClick={() => {
                  if (page > 0) {
                    setPage(page - 1);
                  }
                }}
                disabled={page === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-black">
            Page {page + 1} of {totalPages}
          </span>
            <button
                onClick={() => {
                  if (page < totalPages - 1) {
                    setPage(page + 1);
                  }
                }}
                disabled={page >= totalPages - 1}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {showModal && userRole === 'ADMIN' && (
            <CreateProjectModal
                onCloseAction={() => setShowModal(false)}
                onProjectCreatedAction={(newProject: Project) => {
                  setProjects((prev) => [...prev, newProject]);
                  setShowModal(false);
                }}
            />
        )}
      </div>
  );
}
