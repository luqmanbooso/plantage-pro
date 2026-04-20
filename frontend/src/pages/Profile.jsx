import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await userService.updateProfile({ full_name: fullName });
      updateUser(response.data.user);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      setError('Password must be at least 8 characters with one number');
      return;
    }

    try {
      await userService.changePassword(currentPassword, newPassword);
      setMessage('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  return (
    <div className="page-container min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-plant-dark mb-8">Profile Settings</h1>

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Profile Information */}
          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaUser className="mr-2 text-plant-medium" />
              Profile Information
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="input-field pl-10 bg-gray-100"
                    disabled
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Role</label>
                <input
                  type="text"
                  value={user?.role === 'admin' ? 'Administrator' : 'User'}
                  className="input-field bg-gray-100"
                  disabled
                />
              </div>

              <button type="submit" className="btn-primary">
                Update Profile
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaLock className="mr-2 text-plant-medium" />
              Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  At least 8 characters with one number
                </p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Change Password
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="card border-2 border-red-200">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Danger Zone</h2>
            <p className="text-gray-600 mb-4">
              Once you delete your account, there is no going back. You will have a 7-day grace period to recover your account.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn-danger"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? You will have 7 days to cancel this action."
        confirmText="Delete Account"
        danger={true}
      />
    </div>
  );
};

export default Profile;
