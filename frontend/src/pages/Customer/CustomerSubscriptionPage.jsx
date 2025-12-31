import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerLayout from "../../components/Customer/CustomerLayout";
import { useTheme } from "../../context/ThemeContext";
import { 
  FaCrown, 
  FaCheck, 
  FaCreditCard, 
  FaUniversity, 
  FaMobile,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaReceipt
} from "react-icons/fa";

const CustomerSubscriptionPage = () => {
  const { theme, isDark } = useTheme();
  const [subscriptions, setSubscriptions] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewDetailsPlan, setViewDetailsPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.token) return parsed.token;
      }
      const standaloneToken = localStorage.getItem('token');
      if (standaloneToken) return standaloneToken;
    } catch (e) {
      console.error('Error getting token:', e);
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        
        // Fetch available subscriptions
        const subsResponse = await axios.get("/api/Plan/subscriptions");
        setSubscriptions(subsResponse.data);

        // Fetch current subscription
        if (token) {
          const mySubResponse = await axios.get("/api/Plan/my-subscription", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentSubscription(mySubResponse.data.subscription);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const paymentMethods = [
    { id: "bank", name: "Bank Transfer", icon: FaUniversity, color: "#3b82f6" },
    { id: "easypaisa", name: "Easypaisa", icon: FaMobile, color: "#22c55e" },
    { id: "jazzcash", name: "JazzCash", icon: FaMobile, color: "#ef4444" },
    { id: "sadapay", name: "SadaPay", icon: FaCreditCard, color: "#8b5cf6" }
  ];

  const handlePurchase = async () => {
    if (!selectedPlan) {
      setError("Please select a subscription plan");
      return;
    }
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }
    if (!transactionId.trim()) {
      setError("Please enter your transaction ID");
      return;
    }

    setPurchasing(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();
      const response = await axios.post("/api/Plan/purchase", {
        subscriptionId: selectedPlan._id,
        paymentMethod,
        transactionId: transactionId.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(response.data.message);
      setCurrentSubscription({
        plan: selectedPlan,
        startDate: response.data.subscription.startDate,
        endDate: response.data.subscription.endDate,
        status: 'active'
      });
      setSelectedPlan(null);
      setPaymentMethod("");
      setTransactionId("");
    } catch (error) {
      console.error("Error purchasing subscription:", error);
      setError(error.response?.data?.message || "Failed to purchase subscription");
    } finally {
      setPurchasing(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateFinalPrice = (plan) => {
    if (!plan) return 0;
    return plan.price - (plan.price * (plan.discount / 100));
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div 
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: theme.colors.background }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
               style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}></div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div 
        className="min-h-screen p-6 lg:p-8"
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* Header */}
        <h1 
          className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3"
          style={{ color: theme.colors.text }}
        >
          <FaCrown style={{ color: "#f59e0b" }} />
          Subscription Plans
        </h1>
        <p className="mb-6" style={{ color: theme.colors.textSecondary }}>
          Choose a plan that fits your fitness goals
        </p>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-100 text-green-800 border border-green-300">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-100 text-red-800 border border-red-300">
            {error}
          </div>
        )}

        {/* Current Subscription Status */}
        {currentSubscription && currentSubscription.status !== 'none' && (
          <div 
            className="rounded-2xl p-6 mb-6 border"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.primary,
              borderWidth: '2px'
            }}
          >
            <h2 
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: theme.colors.text }}
            >
              <FaCalendarAlt style={{ color: theme.colors.primary }} />
              Current Subscription
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Plan</p>
                <p className="font-semibold" style={{ color: theme.colors.text }}>
                  {currentSubscription.plan?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Status</p>
                <span 
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium capitalize"
                  style={{ 
                    backgroundColor: currentSubscription.status === 'active' ? '#22c55e20' : 
                                     currentSubscription.status === 'pending' ? '#f59e0b20' : '#ef444420',
                    color: currentSubscription.status === 'active' ? '#22c55e' : 
                           currentSubscription.status === 'pending' ? '#f59e0b' : '#ef4444'
                  }}
                >
                  {currentSubscription.status === 'pending' ? '⏳ Pending Verification' : currentSubscription.status}
                </span>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Expires</p>
                <p className="font-semibold" style={{ color: theme.colors.text }}>
                  {formatDate(currentSubscription.endDate)}
                </p>
              </div>
            </div>
            
            {/* Pending Message */}
            {currentSubscription.status === 'pending' && (
              <div 
                className="mt-4 p-4 rounded-xl border"
                style={{ 
                  backgroundColor: '#fef3c720',
                  borderColor: '#f59e0b'
                }}
              >
                <p className="text-sm" style={{ color: '#92400e' }}>
                  <strong>⏳ Awaiting Verification:</strong> Your payment is being reviewed by our team. 
                  Your subscription will be activated once the payment is verified. This usually takes a few hours.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Available Plans */}
        <div 
          className="rounded-2xl p-6 mb-6 border"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }}
        >
          <h2 
            className="text-lg font-bold mb-5"
            style={{ color: theme.colors.text }}
          >
            Available Plans
          </h2>
          
          {subscriptions.length === 0 ? (
            <p style={{ color: theme.colors.textSecondary }}>
              No subscription plans available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subscriptions.map((plan) => {
                const isSelected = selectedPlan?._id === plan._id;
                const finalPrice = calculateFinalPrice(plan);
                
                return (
                  <div
                    key={plan._id}
                    className={`relative rounded-xl p-6 border-2 transition-all duration-200 hover:shadow-lg ${isSelected ? 'ring-2' : ''}`}
                    style={{ 
                      backgroundColor: isSelected ? theme.colors.primary + "10" : (isDark ? theme.colors.surfaceHover : '#f8fafc'),
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      ringColor: theme.colors.primary
                    }}
                  >
                    {plan.discount > 0 && (
                      <span 
                        className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: "#ef4444", color: "white" }}
                      >
                        {plan.discount}% OFF
                      </span>
                    )}
                    
                    <h3 
                      className="text-xl font-bold mb-2"
                      style={{ color: theme.colors.text }}
                    >
                      {plan.name}
                    </h3>
                    
                    <p 
                      className="text-sm mb-4 capitalize"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {plan.duration} plan
                    </p>
                    
                    <div className="mb-6">
                      {plan.discount > 0 && (
                        <span 
                          className="text-lg line-through mr-2"
                          style={{ color: theme.colors.textMuted }}
                        >
                          Rs. {plan.price}
                        </span>
                      )}
                      <span 
                        className="text-3xl font-bold"
                        style={{ color: theme.colors.primary }}
                      >
                        Rs. {finalPrice}
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setPaymentMethod("");
                          setTransactionId("");
                          // Scroll to payment section
                          setTimeout(() => {
                            document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }}
                        className="w-full py-2 rounded-lg font-bold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        Subscribe Now
                      </button>
                      
                      <button
                        onClick={() => setViewDetailsPlan(plan)}
                        className="w-full py-2 rounded-lg font-medium border transition-all hover:bg-opacity-50 active:scale-95"
                        style={{ 
                          borderColor: theme.colors.primary,
                          color: theme.colors.primary
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Cancel Selection Button */}
          {selectedPlan && (
            <button
              onClick={() => {
                setSelectedPlan(null);
                setPaymentMethod("");
                setTransactionId("");
              }}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{ 
                backgroundColor: isDark ? '#374151' : '#f1f5f9',
                color: theme.colors.text
              }}
            >
              ✕ Cancel Selection
            </button>
          )}
        </div>

        {/* Payment Section - Only show if plan selected */}
        {selectedPlan && (
          <div 
            id="payment-section"
            className="rounded-2xl p-6 mb-6 border"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <h2 
              className="text-lg font-bold mb-5 flex items-center gap-2"
              style={{ color: theme.colors.text }}
            >
              <FaMoneyBillWave style={{ color: "#22c55e" }} />
              Payment Details
            </h2>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label 
                className="block text-sm font-medium mb-3"
                style={{ color: theme.colors.textSecondary }}
              >
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  
                  return (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105`}
                      style={{ 
                        backgroundColor: isSelected ? method.color + "15" : (isDark ? theme.colors.surfaceHover : '#f8fafc'),
                        borderColor: isSelected ? method.color : theme.colors.border
                      }}
                    >
                      <Icon 
                        className="text-2xl" 
                        style={{ color: method.color }} 
                      />
                      <span 
                        className="text-sm font-medium text-center"
                        style={{ color: isSelected ? method.color : theme.colors.text }}
                      >
                        {method.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Instructions - Show when method selected */}
            {paymentMethod && (
              <div 
                className="mb-6 p-5 rounded-xl border-2 border-dashed"
                style={{ 
                  backgroundColor: isDark ? '#1a1a2e' : '#fefce8',
                  borderColor: '#f59e0b'
                }}
              >
                <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#f59e0b' }}>
                  📋 Payment Instructions
                </h3>
                
                <div className="space-y-2 text-sm" style={{ color: theme.colors.text }}>
                  <p className="font-medium">Step 1: Send payment to:</p>
                  
                  {paymentMethod === 'jazzcash' && (
                    <div 
                      className="p-4 rounded-lg my-3"
                      style={{ backgroundColor: '#ef444415' }}
                    >
                      <p className="font-bold text-lg" style={{ color: '#ef4444' }}>JazzCash</p>
                      <p className="text-xl font-mono font-bold" style={{ color: theme.colors.text }}>
                        03191938242
                      </p>
                      <p className="text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
                        Account Title: Taimoor Raza Asif
                      </p>
                    </div>
                  )}
                  
                  {paymentMethod === 'easypaisa' && (
                    <div 
                      className="p-4 rounded-lg my-3"
                      style={{ backgroundColor: '#22c55e15' }}
                    >
                      <p className="font-bold text-lg" style={{ color: '#22c55e' }}>Easypaisa</p>
                      <p className="text-xl font-mono font-bold" style={{ color: theme.colors.text }}>
                        03191938242
                      </p>
                      <p className="text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
                        Account Title: Taimoor Raza Asif
                      </p>
                    </div>
                  )}
                  
                  {paymentMethod === 'bank' && (
                    <div 
                      className="p-4 rounded-lg my-3"
                      style={{ backgroundColor: '#3b82f615' }}
                    >
                      <p className="font-bold text-lg" style={{ color: '#3b82f6' }}>Bank Account</p>
                      <p className="text-sm" style={{ color: theme.colors.text }}>
                        <strong>Bank:</strong> HBL<br />
                        <strong>Account #:</strong> 1234567890123<br />
                        <strong>IBAN:</strong> PK00HABB0001234567890123<br />
                        <strong>Title:</strong> FitHum Fitness
                      </p>
                    </div>
                  )}
                  
                  {paymentMethod === 'sadapay' && (
                    <div 
                      className="p-4 rounded-lg my-3"
                      style={{ backgroundColor: '#8b5cf615' }}
                    >
                      <p className="font-bold text-lg" style={{ color: '#8b5cf6' }}>SadaPay</p>
                      <p className="text-xl font-mono font-bold" style={{ color: theme.colors.text }}>
                        03191938242
                      </p>
                      <p className="text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
                        Account Title: Taimoor Raza Asif
                      </p>
                    </div>
                  )}
                  
                  <p className="font-medium mt-4">Step 2: After sending payment:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1" style={{ color: theme.colors.textSecondary }}>
                    <li>You will receive a <strong>Transaction ID</strong> (TID) or Reference Number</li>
                    <li>Copy that Transaction ID</li>
                    <li>Paste it in the field below</li>
                    <li>Click "Complete Purchase"</li>
                  </ul>
                  
                  <p className="mt-3 text-xs" style={{ color: theme.colors.textMuted }}>
                    💡 The Transaction ID looks like: "TID123456789" or a 10-14 digit number
                  </p>
                </div>
              </div>
            )}

            {/* Transaction ID */}
            <div className="mb-6">
              <label 
                className="block text-sm font-medium mb-2 flex items-center gap-2"
                style={{ color: theme.colors.textSecondary }}
              >
                <FaReceipt /> Transaction ID
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g., TID123456789 or 12345678901234"
                className="w-full p-4 rounded-xl border outline-none transition-all focus:ring-2"
                style={{ 
                  backgroundColor: isDark ? theme.colors.surfaceHover : '#f8fafc',
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }}
              />
              <p className="mt-2 text-xs" style={{ color: theme.colors.textMuted }}>
                Enter the Transaction ID you received after making the payment.
              </p>
            </div>

            {/* Summary */}
            <div 
              className="p-4 rounded-xl mb-6"
              style={{ backgroundColor: isDark ? theme.colors.surfaceHover : '#f0fdf4' }}
            >
              <div className="flex justify-between items-center">
                <span style={{ color: theme.colors.textSecondary }}>Plan:</span>
                <span className="font-semibold" style={{ color: theme.colors.text }}>
                  {selectedPlan.name} ({selectedPlan.duration})
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span style={{ color: theme.colors.textSecondary }}>Amount:</span>
                <span 
                  className="text-xl font-bold"
                  style={{ color: theme.colors.primary }}
                >
                  Rs. {calculateFinalPrice(selectedPlan)}
                </span>
              </div>
            </div>

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              disabled={purchasing || !paymentMethod || !transactionId.trim()}
              className="w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              style={{ backgroundColor: theme.colors.primary }}
            >
              {purchasing ? "Processing..." : "Complete Purchase"}
            </button>
          </div>
        )}

        {/* View Details Modal */}
        {viewDetailsPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div 
              className="w-full max-w-lg rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <button
                onClick={() => setViewDetailsPlan(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                style={{ color: theme.colors.textSecondary }}
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-2" style={{ color: theme.colors.text }}>
                {viewDetailsPlan.name}
              </h2>
              <p className="mb-6 capitalize" style={{ color: theme.colors.textSecondary }}>
                {viewDetailsPlan.duration} Plan
              </p>

              <div className="mb-6">
                <p className="text-3xl font-bold" style={{ color: theme.colors.primary }}>
                  Rs. {calculateFinalPrice(viewDetailsPlan)}
                </p>
                {viewDetailsPlan.discount > 0 && (
                  <p className="text-sm line-through" style={{ color: theme.colors.textMuted }}>
                    Rs. {viewDetailsPlan.price}
                  </p>
                )}
              </div>

              <div className="border-t pt-6" style={{ borderColor: theme.colors.border }}>
                <h3 className="font-bold mb-4" style={{ color: theme.colors.text }}>Included Features:</h3>
                {viewDetailsPlan.features && viewDetailsPlan.features.length > 0 ? (
                  <ul className="space-y-3">
                    {viewDetailsPlan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3" style={{ color: theme.colors.text }}>
                        <div 
                          className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#22c55e20' }}
                        >
                          <FaCheck className="text-xs text-green-500" />
                        </div>
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: theme.colors.textSecondary }}>No specific features listed.</p>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setViewDetailsPlan(null)}
                  className="flex-1 py-3 rounded-xl font-medium border transition-colors"
                  style={{ borderColor: theme.colors.border, color: theme.colors.text }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedPlan(viewDetailsPlan);
                    setViewDetailsPlan(null);
                    setPaymentMethod("");
                    setTransactionId("");
                    setTimeout(() => {
                      document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerSubscriptionPage;
