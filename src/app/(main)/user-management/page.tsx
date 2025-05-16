'use client';
import React, { useState, useEffect } from 'react';
import { Trash2, UserPlus, AlertCircle } from 'lucide-react';
import { validateFileUpload } from '@/utils/validateEnv';

interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users);
    } catch (err: any) {
      setError('Failed to load users: ' + err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationError = validateFileUpload(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError(null);
    } else {
      setPhoto(null);
      setPhotoPreview(null);
    }
  };

  const validate = () => {
    if (!name.trim()) return 'Name is required.';
    if (name.length < 2) return 'Name must be at least 2 characters long.';
    if (!email.trim()) return 'Email is required.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Invalid email format.';
    if (!photo) return 'Profile photo is required.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (photo) formData.append('photo', photo);
      const res = await fetch('/api/users', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create user.');
      }
      setSuccess('User created successfully!');
      setName('');
      setEmail('');
      setPhoto(null);
      setPhotoPreview(null);
      // Refresh users list
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter((user) => user.id !== userId));
      setSuccess('User deleted successfully!');
    } catch (err: any) {
      setError('Failed to delete user: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Creation Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Create New User</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                </div>
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-full border-2 border-blue-500"
                  />
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin">⌛</span>
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Users List</h2>

          {loadingUsers ? (
            <div className="text-center py-4">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 focus:outline-none"
                          title="Delete user"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
