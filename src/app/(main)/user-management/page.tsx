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

  const handleDelete = async (userId: string) => {
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
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <UserPlus className="inline-block text-blue-500" size={32} /> User Management
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            onChange={handlePhotoChange}
            required
          />
        </div>
        <button
          type="submit"
          className="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2 mt-2 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>
      {photoPreview && (
        <div className="mb-6 flex justify-center">
          <img
            src={photoPreview}
            alt="Profile Preview"
            className="h-24 w-24 rounded-full object-cover border-2 border-blue-200 shadow"
          />
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 mb-4">
          <AlertCircle />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 mb-4">
          <UserPlus />
          <span>{success}</span>
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">All Users</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-blue-50">
              <th className="py-2 px-4 text-left font-medium text-gray-700">Photo</th>
              <th className="py-2 px-4 text-left font-medium text-gray-700">Name</th>
              <th className="py-2 px-4 text-left font-medium text-gray-700">Email</th>
              <th className="py-2 px-4 text-left font-medium text-gray-700">Created</th>
              <th className="py-2 px-4 text-center font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100 hover:bg-blue-50 transition">
                  <td className="py-2 px-4">
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      className="h-12 w-12 rounded-full object-cover border border-gray-200 shadow"
                    />
                  </td>
                  <td className="py-2 px-4 font-medium text-gray-800">{user.name}</td>
                  <td className="py-2 px-4 text-gray-600">{user.email}</td>
                  <td className="py-2 px-4 text-gray-500 text-sm">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full transition"
                      title="Delete user"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
