import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Wallet, Landmark, Clock, ArrowDownCircle, Building } from 'lucide-react';
import { fetchEarnings, requestWithdrawal } from '../redux/slices/earningSlice';

const Earnings = () => {
  const dispatch = useDispatch();
  const { 
    cards, lastBankDetails, withdrawals, pagination, isLoading, isSubmitting 
  } = useSelector((state) => state.earnings);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    amount: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branch: ''
  });

  // Fetch data on mount and when page changes
  useEffect(() => {
    dispatch(fetchEarnings({ page, limit: 10 }));
  }, [dispatch, page]);

  // Pre-fill bank details if they exist in the backend
  useEffect(() => {
    if (lastBankDetails) {
      setFormData(prev => ({
        ...prev,
        accountHolderName: lastBankDetails.accountHolderName || '',
        accountNumber: lastBankDetails.accountNumber || '',
        ifscCode: lastBankDetails.ifscCode || '',
        bankName: lastBankDetails.bankName || '',
        branch: lastBankDetails.branch || ''
      }));
    }
  }, [lastBankDetails]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    const withdrawAmount = Number(formData.amount);

    if (withdrawAmount <= 0) {
      return toast.error("Amount must be greater than zero.");
    }
    if (withdrawAmount > cards.availableBalance) {
      return toast.error(`Maximum available balance is ₹${cards.availableBalance}`);
    }

    const payload = {
      amount: withdrawAmount,
      bankDetails: {
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        bankName: formData.bankName,
        branch: formData.branch,
      }
    };

    const resultAction = await dispatch(requestWithdrawal(payload));
    
    if (requestWithdrawal.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload.message);
      setFormData(prev => ({ ...prev, amount: '' })); // Reset amount field
    } else {
      toast.error(resultAction.payload);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your earnings and request payouts.</p>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Earnings" value={cards.totalEarnings} icon={Wallet} color="bg-emerald-500" />
        <StatCard title="Available Balance" value={cards.availableBalance} icon={Landmark} color="bg-[#8E76FF]" />
        <StatCard title="Pending Withdrawal" value={cards.pendingWithdrawal} icon={Clock} color="bg-amber-500" />
        <StatCard title="Total Withdrawn" value={cards.totalWithdrawn} icon={ArrowDownCircle} color="bg-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Withdrawal Request Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4 border-b pb-3 border-gray-100">
              <Building className="w-5 h-5 text-[#8E76FF]" />
              <h2 className="text-lg font-bold text-gray-900">Request Withdrawal</h2>
            </div>
            
            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Amount (₹)</label>
                <input 
                  type="number" name="amount" value={formData.amount} onChange={handleInputChange} required
                  placeholder={`Max ₹${cards.availableBalance}`}
                  className="w-full px-4 py-2 bg-[#F3F3FF] border-none rounded-xl focus:ring-2 focus:ring-[#8E76FF] outline-none"
                />
              </div>
              
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase">Bank Details</p>
                <input 
                  type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleInputChange} required
                  placeholder="Account Holder Name"
                  className="w-full px-4 py-2 bg-[#F3F3FF] border-none rounded-xl focus:ring-2 focus:ring-[#8E76FF] text-sm outline-none"
                />
                <input 
                  type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} required
                  placeholder="Account Number"
                  className="w-full px-4 py-2 bg-[#F3F3FF] border-none rounded-xl focus:ring-2 focus:ring-[#8E76FF] text-sm outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} required
                    placeholder="IFSC Code"
                    className="w-full px-4 py-2 bg-[#F3F3FF] border-none rounded-xl focus:ring-2 focus:ring-[#8E76FF] text-sm outline-none uppercase"
                  />
                  <input 
                    type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} required
                    placeholder="Bank Name"
                    className="w-full px-4 py-2 bg-[#F3F3FF] border-none rounded-xl focus:ring-2 focus:ring-[#8E76FF] text-sm outline-none"
                  />
                </div>
                <input 
                  type="text" name="branch" value={formData.branch} onChange={handleInputChange}
                  placeholder="Branch (Optional)"
                  className="w-full px-4 py-2 bg-[#F3F3FF] border-none rounded-xl focus:ring-2 focus:ring-[#8E76FF] text-sm outline-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || cards.availableBalance <= 0}
                className="w-full mt-4 bg-[#8E76FF] hover:bg-[#7C63F5] text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Request Withdrawal'}
              </button>
            </form>
          </div>
        </div>

        {/* 3 & 4. Withdrawal History & Pagination */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Withdrawal History</h2>
            </div>
            
            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">Loading history...</td></tr>
                  ) : withdrawals?.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">No withdrawals found.</td></tr>
                  ) : (
                    withdrawals?.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(item.requestedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          ₹{item.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs truncate max-w-[150px]">
                          {item.remarks || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50">
              <button 
                onClick={() => setPage(page - 1)} 
                disabled={page === 1} 
                className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="font-medium">
                Page {pagination.currentPage} / {pagination.totalPages || 1}
              </span>
              <button 
                onClick={() => setPage(page + 1)} 
                disabled={page >= pagination.totalPages} 
                className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable Components
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('bg-', 'bg-').replace('500', '100')} ${color.replace('bg-', 'text-')}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">₹{Number(value).toLocaleString()}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-100 text-amber-700',
    Approved: 'bg-blue-100 text-blue-700',
    Paid: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-rose-100 text-rose-700',
  }[status] || 'bg-gray-100 text-gray-700';

  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles}`}>{status}</span>;
};

export default Earnings;