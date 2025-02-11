'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {User} from "@/types/User";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

    fetchUsers();
  }, []);

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
          <p className="text-red-500 text-center">{error}</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-blue-50 p-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">Users</h1>
          {users.length === 0 ? (
              <p className="text-black text-center">No users found.</p>
          ) : (
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-3 text-left text-black">Name</th>
                  <th className="border border-gray-300 p-3 text-left text-black">Surname</th>
                  <th className="border border-gray-300 p-3 text-left text-black">Email</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr
                        key={user.id}
                        className="hover:bg-gray-100 cursor-pointer"
                        onClick={() => router.push(`/users/${user.id}`)}
                    >
                      <td className="border border-gray-300 p-3 text-black">{user.name}</td>
                      <td className="border border-gray-300 p-3 text-black">{user.surname}</td>
                      <td className="border border-gray-300 p-3 text-black">{user.email}</td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </div>
      </div>
  );
}
