import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useTheme } from "../../context/ThemeContext";
import { 
  FaCreditCard, 
  FaDollarSign, 
  FaTrash, 
  FaCheckCircle, 
  FaClock,
  FaTimesCircle,
  FaSearch,
  FaCalendarAlt,
  FaClipboardList,
  FaHistory,
  FaCheck,
  FaTimes,
  FaReceipt
} from 'react-icons/fa';
import ThemedDialog from '../common/ThemedDialog';

const PaymentComponent = () => {
  const { theme, isDark } = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'history'
  
  // Dialog state
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null
  });

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

  const handleApprove = (payment) => {
    setDialog({
      isOpen: true,
      type: 'success',
      title: 'Approve Payment',
      message: `Approve payment of Rs.${payment.amount} from ${payment.userId?.name || 'Unknown'}? Transaction ID: ${payment.transactionId}`,
      onConfirm: async () => {
        try {
          await axios.put(`http://localhost:5000/api/payment/approve/${payment._id}`);
          setPayments(payments.map(p => p._id === payment._id ? { ...p, status: 'success' } : p));
          setMessage({ type: 'success', text: 'Payment approved successfully!' });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
          setMessage({ type: 'error', text: 'Failed to approve payment' });
        }
      }
    });
  };

  const handleReject = (payment) => {
    setDialog({
      isOpen: true,
      type: 'error',
      title: 'Reject Payment',
      message: `Reject payment of Rs.${payment.amount} from ${payment.userId?.name || 'Unknown'}? The user's subscription will be cancelled.`,
      onConfirm: async () => {
        try {
          await axios.put(`http://localhost:5000/api/payment/reject/${payment._id}`);
          setPayments(payments.map(p => p._id === payment._id ? { ...p, status: 'failed' } : p));
          setMessage({ type: 'success', text: 'Payment rejected successfully!' });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
          setMessage({ type: 'error', text: 'Failed to reject payment' });
        }
      }
    });
  };

  const handleDelete = (id) => {
    setDialog({
      isOpen: true,
      type: 'error',
      title: 'Delete Payment Record',
      message: 'Are you sure you want to delete this payment record? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/payment/${id}`);
          setPayments(payments.filter(payment => payment._id !== id));
          setMessage({ type: 'success', text: 'Payment deleted successfully' });
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
          setMessage({ type: 'error', text: 'Failed to delete payment' });
        }
      }
    });
  };

  const closeDialog = () => setDialog({ ...dialog, isOpen: false });

  const getStatusBadge = (status) => {
    const styles = {
      success: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      failed: 'bg-red-100 text-red-700'
    };
    const icons = {
      success: <FaCheckCircle className="mr-1" />,
      pending: <FaClock className="mr-1" />,
      failed: <FaTimesCircle className="mr-1" />
    };
    const labels = {
      success: 'Approved',
      pending: 'Pending',
      failed: 'Rejected'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {icons[status] || icons.pending}
        {labels[status] || 'Pending'}
      </span>
    );
  };

  const getPaymentMethodBadge = (method) => {
    const colors = {
      easypaisa: 'bg-green-100 text-green-700',
      jazzcash: 'bg-red-100 text-red-700',
      bank: 'bg-blue-100 text-blue-700',
      sadapay: 'bg-purple-100 text-purple-700'
    };
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${colors[method] || 'bg-gray-100 text-gray-700'}`}>
        {method?.charAt(0).toUpperCase() + method?.slice(1) || 'N/A'}
      </span>
    );
  };

  // Filter payments based on active tab
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const historyPayments = payments.filter(p => p.status !== 'pending');

  const displayPayments = activeTab === 'requests' ? pendingPayments : historyPayments;

  const filteredPayments = displayPayments.filter(p => {
    const matchesSearch = p.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalRevenue = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedPayments = payments.filter(p => p.status === 'success').length;

  return (
    <div className="transition-colors duration-300">
      <main className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 
            className="text-3xl font-bold flex items-center gap-3 transition-colors"
            style={{ color: theme.colors.text }}
          >
            <FaCreditCard style={{ color: theme.colors.primary }} />
            Payment Monitoring
          </h2>
          <p 
            className="mt-1 transition-colors"
            style={{ color: theme.colors.textSecondary }}
          >
            Track and manage all payment transactions
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
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FaDollarSign className="text-green-600 text-xl" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: theme.colors.text }}
              >
                Rs.{totalRevenue.toLocaleString()}
              </p>
              <p 
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                Total Revenue
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
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <FaCreditCard className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: theme.colors.text }}
              >
                {payments.length}
              </p>
              <p 
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                Total Payments
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
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <FaCheckCircle className="text-emerald-600 text-xl" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: theme.colors.text }}
              >
                {completedPayments}
              </p>
              <p 
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                Approved
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
              <FaClock className="text-amber-600 text-xl" />
            </div>
            <div>
              <p 
                className="text-2xl font-bold"
                style={{ color: theme.colors.text }}
              >
                {pendingPayments.length}
              </p>
              <p 
                className="text-sm"
                style={{ color: theme.colors.textSecondary }}
              >
                Pending
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

        {/* Tabs */}
        <div className="mb-6">
          <div 
            className="flex gap-2 p-1 rounded-xl w-fit"
            style={{ backgroundColor: isDark ? theme.colors.surfaceHover : '#f1f5f9' }}
          >
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'requests' ? 'text-white shadow-lg' : ''
              }`}
              style={{
                backgroundColor: activeTab === 'requests' ? theme.colors.primary : 'transparent',
                color: activeTab === 'requests' ? 'white' : theme.colors.textSecondary
              }}
            >
              <FaClipboardList />
              Pending Requests
              {pendingPayments.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {pendingPayments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'history' ? 'text-white shadow-lg' : ''
              }`}
              style={{
                backgroundColor: activeTab === 'history' ? theme.colors.primary : 'transparent',
                color: activeTab === 'history' ? 'white' : theme.colors.textSecondary
              }}
            >
              <FaHistory />
              History
            </button>
          </div>
        </div>

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
                placeholder="Search by user name, payment ID, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors border"
                style={{ 
                  backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }}
              />
            </div>
          </div>
        </div>

        {/* Payments Table */}
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
              Loading payments...
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <FaCreditCard className="mx-auto text-4xl mb-2 opacity-50" />
              <p>{activeTab === 'requests' ? 'No pending payment requests' : 'No payment history'}</p>
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
                      className="py-4 px-4 text-left text-sm font-semibold"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      User
                    </th>
                    <th 
                      className="py-4 px-4 text-left text-sm font-semibold"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Amount
                    </th>
                    <th 
                      className="py-4 px-4 text-left text-sm font-semibold"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Method
                    </th>
                    <th 
                      className="py-4 px-4 text-left text-sm font-semibold"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Transaction ID
                    </th>
                    <th 
                      className="py-4 px-4 text-left text-sm font-semibold"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Status
                    </th>
                    <th 
                      className="py-4 px-4 text-left text-sm font-semibold"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Date
                    </th>
                    <th 
                      className="py-4 px-4 text-center text-sm font-semibold"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: theme.colors.border }}>
                  {filteredPayments.map((payment) => (
                    <tr 
                      key={payment._id} 
                      className="transition-colors hover:bg-opacity-50"
                      style={{ 
                        borderBottomColor: theme.colors.border
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? theme.colors.surfaceHover : '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <span className="font-medium block" style={{ color: theme.colors.text }}>
                            {payment.userId?.name || 'Unknown User'}
                          </span>
                          <span className="text-xs" style={{ color: theme.colors.textSecondary }}>
                            {payment.userId?.email || ''}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-lg font-bold text-green-500">
                          Rs.{payment.amount?.toLocaleString() || '0'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {getPaymentMethodBadge(payment.paymentMethod)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaReceipt className="text-sm" style={{ color: theme.colors.textSecondary }} />
                          <span className="font-mono text-sm" style={{ color: theme.colors.text }}>
                            {payment.transactionId || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                          <FaCalendarAlt className="text-sm" />
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {payment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(payment)}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                                title="Approve"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => handleReject(payment)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                title="Reject"
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}
                          {payment.status !== 'pending' && (
                            <button
                              onClick={() => handleDelete(payment._id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          )}
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
      
      {/* Themed Dialog */}
      <ThemedDialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        confirmText={dialog.title.includes('Approve') ? 'Approve' : dialog.title.includes('Reject') ? 'Reject' : 'Delete'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default PaymentComponent;
