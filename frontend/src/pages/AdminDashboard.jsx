import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services';
import { FaUsers, FaChartLine, FaCalendar, FaStar } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-container min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-plant-dark mb-8">Admin Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-2">Total Users</p>
                  <p className="text-4xl font-bold">{stats?.total_users || 0}</p>
                </div>
                <FaUsers className="text-6xl text-blue-300 opacity-50" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-plant-medium to-plant-dark text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-plant-pale mb-2">Total Predictions</p>
                  <p className="text-4xl font-bold">{stats?.total_predictions || 0}</p>
                </div>
                <FaChartLine className="text-6xl text-plant-light opacity-50" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 mb-2">Predictions Today</p>
                  <p className="text-4xl font-bold">{stats?.predictions_today || 0}</p>
                </div>
                <FaCalendar className="text-6xl text-orange-300 opacity-50" />
              </div>
            </div>
          </div>

          {/* Most Active Users */}
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaStar className="mr-2 text-yellow-500" />
              Most Active Users
            </h2>

            {stats?.most_active_users && stats.most_active_users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-plant-pale">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-plant-dark">Rank</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-plant-dark">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-plant-dark">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-plant-dark">Predictions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.most_active_users.map((item, index) => (
                      <tr key={item.user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-plant-medium text-white font-bold">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold">{item.user.full_name}</td>
                        <td className="px-6 py-4 text-gray-600">{item.user.email}</td>
                        <td className="px-6 py-4">
                          <span className="bg-plant-pale px-3 py-1 rounded-full text-plant-dark font-semibold">
                            {item.prediction_count}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No active users yet</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/admin/users" className="card hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-plant-pale to-white">
              <h3 className="text-xl font-bold text-plant-dark mb-2">Manage Users</h3>
              <p className="text-gray-600">View, activate, deactivate, or delete user accounts</p>
            </Link>

            <Link to="/admin/predictions" className="card hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-plant-pale to-white">
              <h3 className="text-xl font-bold text-plant-dark mb-2">All Predictions</h3>
              <p className="text-gray-600">View all predictions made across the platform</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
