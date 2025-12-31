import AdminLayout from '../../components/Admin/AdminLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaUsers, FaCheckCircle, FaUserPlus, FaBan, FaSearch, FaTrash, FaEnvelope, FaCalendarAlt, FaUnlock } from 'react-icons/fa';
import ThemedDialog from '../../components/common/ThemedDialog';

const ManageCustomersPage = () => {
  const { theme, isDark } = useTheme();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Dialog states
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null
  });

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

  const handleDeleteCustomer = (id) => {
    setDialog({
      isOpen: true,
      type: 'error',
      title: 'Delete Customer',
      message: 'Are you sure you want to delete this customer? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/manageusers/${id}`);
          setCustomers(customers.filter(customer => customer._id !== id));
          setMessage({ type: 'success', text: 'Customer deleted successfully' });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
          setMessage({ type: 'error', text: 'Error deleting customer' });
        }
      }
    });
  };

  const handleToggleBlock = (id, currentlyBlocked) => {
    const action = currentlyBlocked ? 'unblock' : 'block';
    setDialog({
      isOpen: true,
      type: currentlyBlocked ? 'info' : 'warning',
      title: currentlyBlocked ? 'Unblock Customer' : 'Block Customer',
      message: `Are you sure you want to ${action} this customer?${!currentlyBlocked ? ' They will not be able to login until unblocked.' : ''}`,
      onConfirm: async () => {
        try {
          const response = await axios.put(`http://localhost:5000/api/manageusers/block/${id}`);
          setCustomers(customers.map(c => c._id === id ? { ...c, blocked: response.data.blocked } : c));
          setMessage({ type: 'success', text: `Customer ${action}ed successfully` });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
          setMessage({ type: 'error', text: `Error ${action}ing customer` });
        }
      }
    });
  };

  const closeDialog = () => setDialog({ ...dialog, isOpen: false });

  return (
    <AdminLayout>
      <div 
        className="min-h-screen transition-colors duration-300"
        style={{ backgroundColor: theme.colors.background }}
      >
        <main className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 
              className="text-3xl font-bold flex items-center gap-3 transition-colors"
              style={{ color: theme.colors.text }}
            >
              <FaUsers style={{ color: theme.colors.primary }} />
              Manage Customers
            </h2>
            <p 
              className="mt-1 transition-colors"
              style={{ color: theme.colors.textSecondary }}
            >
              View and manage all registered customers
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div 
              className="rounded-xl p-4 shadow-sm border flex items-center gap-4 bg-opacity-50 backdrop-blur-sm"
              style={{ 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.text }}
                >
                  {customers.length}
                </p>
                <p 
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Total Customers
                </p>
              </div>
            </div>
            <div 
              className="rounded-xl p-4 shadow-sm border flex items-center gap-4 bg-opacity-50 backdrop-blur-sm"
              style={{ 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <div>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.text }}
                >
                  {customers.length}
                </p>
                <p 
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Active Users
                </p>
              </div>
            </div>
            <div 
              className="rounded-xl p-4 shadow-sm border flex items-center gap-4 bg-opacity-50 backdrop-blur-sm"
              style={{ 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <FaUserPlus className="text-amber-600 text-xl" />
              </div>
              <div>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.text }}
                >
                  12
                </p>
                <p 
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  New This Month
                </p>
              </div>
            </div>
            <div 
              className="rounded-xl p-4 shadow-sm border flex items-center gap-4 bg-opacity-50 backdrop-blur-sm"
              style={{ 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <FaBan className="text-red-600 text-xl" />
              </div>
              <div>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.text }}
                >
                  {customers.filter(c => c.blocked).length}
                </p>
                <p 
                  className="text-sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Blocked
                </p>
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
          <div 
            className="rounded-2xl p-6 shadow-sm border mb-6"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customers by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors border"
                  style={{ 
                    backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                  }}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 text-white rounded-xl transition-all hover:shadow-lg hover:scale-105"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Search
              </button>
            </div>
          </div>

          {/* Customers Table */}
          <div 
            className="rounded-2xl shadow-sm border overflow-hidden"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <div 
                  className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full mx-auto mb-4"
                  style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}
                ></div>
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
                  <thead 
                    className="border-b"
                    style={{ 
                      backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                      borderColor: theme.colors.border
                    }}
                  >
                    <tr>
                      <th 
                        className="py-4 px-6 text-left text-sm font-semibold"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        Customer
                      </th>
                      <th 
                        className="py-4 px-6 text-left text-sm font-semibold"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        Email
                      </th>
                      <th 
                        className="py-4 px-6 text-left text-sm font-semibold"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        Joined
                      </th>
                      <th 
                        className="py-4 px-6 text-left text-sm font-semibold"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        Status
                      </th>
                      <th 
                        className="py-4 px-6 text-center text-sm font-semibold"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ divideColor: theme.colors.border }}>
                    {customers.map((customer) => (
                      <tr 
                        key={customer._id} 
                        className="transition-colors hover:bg-opacity-50"
                        style={{ 
                          borderBottomColor: theme.colors.border
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? theme.colors.surfaceHover : '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                              style={{ 
                                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
                              }}
                            >
                              {customer.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span 
                              className="font-medium"
                              style={{ color: theme.colors.text }}
                            >
                              {customer.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-sm text-slate-400" />
                            <span style={{ color: theme.colors.textSecondary }}>{customer.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
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
                              onClick={() => handleToggleBlock(customer._id, customer.blocked)}
                              className={`p-2 rounded-lg transition-all ${customer.blocked ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'}`}
                              title={customer.blocked ? 'Unblock' : 'Block'}
                            >
                              {customer.blocked ? <FaUnlock /> : <FaBan />}
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
      
      {/* Themed Dialog */}
      <ThemedDialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        confirmText={dialog.type === 'error' ? 'Delete' : dialog.type === 'info' ? 'Unblock' : 'Block'}
        cancelText="Cancel"
      />
    </AdminLayout>
  );
};

export default ManageCustomersPage;
