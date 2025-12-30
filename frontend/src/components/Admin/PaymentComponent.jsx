import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
import { 
  FaCreditCard, 
  FaDollarSign, 
  FaTrash, 
  FaCheckCircle, 
  FaClock,
  FaTimesCircle,
  FaSearch,
  FaCalendarAlt
} from 'react-icons/fa';

const PaymentComponent = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/payment');
      setPayments(response.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch payments' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment record?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/payment/${id}`);
      setPayments(payments.filter(payment => payment._id !== id));
      setMessage({ type: 'success', text: 'Payment deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete payment' });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-blue-100 text-blue-700'
    };
    const icons = {
      completed: <FaCheckCircle className="mr-1" />,
      pending: <FaClock className="mr-1" />,
      failed: <FaTimesCircle className="mr-1" />,
      refunded: <FaDollarSign className="mr-1" />
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {icons[status] || icons.pending}
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
      </span>
    );
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedPayments = payments.filter(p => p.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />

      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FaCreditCard className="text-indigo-600" />
            Payment Monitoring
          </h2>
          <p className="text-slate-500 mt-1">Track and manage all payment transactions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FaDollarSign className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">${totalRevenue.toLocaleString()}</p>
              <p className="text-slate-500 text-sm">Total Revenue</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <FaCreditCard className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{payments.length}</p>
              <p className="text-slate-500 text-sm">Total Payments</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <FaCheckCircle className="text-emerald-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{completedPayments}</p>
              <p className="text-slate-500 text-sm">Completed</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <FaClock className="text-amber-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{payments.length - completedPayments}</p>
              <p className="text-slate-500 text-sm">Pending</p>
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

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by user name or payment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              Loading payments...
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <FaCreditCard className="mx-auto text-4xl mb-2 opacity-50" />
              <p>No payments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Payment ID</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">User</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Amount</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Type</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-600">Date</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-slate-600">
                          #{payment._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-slate-700">
                          {payment.userId?.name || 'Unknown User'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-lg font-bold text-green-600">
                          ${payment.amount?.toLocaleString() || '0'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm">
                          {payment.type || 'Subscription'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-slate-500">
                          <FaCalendarAlt className="text-sm" />
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDelete(payment._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                        >
                          <FaTrash />
                        </button>
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

export default PaymentComponent;
