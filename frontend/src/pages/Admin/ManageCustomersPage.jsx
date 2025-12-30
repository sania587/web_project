import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from '../../components/Admin/AdminNav';
import { 
  FaUsers, 
  FaSearch, 
  FaTrash, 
  FaBan, 
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaUserPlus
} from 'react-icons/fa';

const ManageCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/manageusers');
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching customers', err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchCustomers();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/manageusers/search?name=${search}`);
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error searching customers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/manageusers/${id}`);
      setCustomers(customers.filter(customer => customer._id !== id));
      setMessage({ type: 'success', text: 'Customer deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error deleting customer' });
    }
  };

  const handleBlockCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to block this customer?')) return;
    
    try {
      await axios.put(`http://localhost:5000/api/manageusers/block/${id}`);
      setCustomers(customers.map(c => c._id === id ? { ...c, blocked: true } : c));
      setMessage({ type: 'success', text: 'Customer blocked successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error blocking customer' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FaUsers className="text-indigo-600" />
            Manage Customers
          </h2>
          <p className="text-slate-500 mt-1">View and manage all registered customers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{customers.length}</p>
              <p className="text-slate-500 text-sm">Total Customers</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{customers.length}</p>
              <p className="text-slate-500 text-sm">Active Users</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <FaUserPlus className="text-amber-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">12</p>
              <p className="text-slate-500 text-sm">New This Month</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <FaBan className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{customers.filter(c => c.blocked).length}</p>
              <p className="text-slate-500 text-sm">Blocked</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-xl ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
            'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
            >
              Search
            </button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              Loading customers...
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <FaUsers className="mx-auto text-4xl mb-2 opacity-50" />
              <p>No customers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Customer</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Email</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Joined</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Status</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {customer.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="font-medium text-slate-700">{customer.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaEnvelope className="text-sm text-slate-400" />
                          {customer.email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-slate-500">
                          <FaCalendarAlt className="text-sm" />
                          {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          customer.blocked 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {customer.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleBlockCustomer(customer._id)}
                            className="p-2 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-all"
                            title="Block"
                          >
                            <FaBan />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageCustomersPage;
