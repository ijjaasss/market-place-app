import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ChevronLeft, User, MapPin, CreditCard, Package } from 'lucide-react';
import { fetchOrderDetails, updateOrderStatus, clearCurrentOrder } from '../redux/slices/orderSlice';
import { OrderStatusBadge } from './Orders';

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentOrder: order, isDetailsLoading, isUpdating } = useSelector((state) => state.orders);
  const [statusInput, setStatusInput] = useState('');

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
    return () => dispatch(clearCurrentOrder());
  }, [dispatch, id]);

  useEffect(() => {
    if (order) setStatusInput(order.orderStatus);
  }, [order]);

  const handleUpdateStatus = async () => {
    if (statusInput === order.orderStatus) return;
    
    const resultAction = await dispatch(updateOrderStatus({ id, status: statusInput }));
    if (updateOrderStatus.fulfilled.match(resultAction)) {
      toast.success(`Order status updated to ${statusInput}`);
    } else {
      toast.error(resultAction.payload);
      setStatusInput(order.orderStatus); // revert on fail
    }
  };

  if (isDetailsLoading || !order) {
    return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8E76FF]"></div></div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.substring(0, 8)}</h1>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
            <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Status Update Action */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100 w-full sm:w-auto">
          <select 
            value={statusInput} 
            onChange={(e) => setStatusInput(e.target.value)}
            disabled={order.orderStatus === 'Cancelled' || order.orderStatus === 'Delivered'}
            className="bg-[#F3F3FF] border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#8E76FF] outline-none disabled:opacity-50"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button 
            onClick={handleUpdateStatus}
            disabled={isUpdating || statusInput === order.orderStatus}
            className="bg-[#8E76FF] hover:bg-[#7C63F5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details (Left Col) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-bold text-gray-900">Items Ordered</h2>
            </div>
            <div className="p-5 space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/60'} 
                      alt={item.product?.name} 
                      className="w-16 h-16 object-cover rounded-xl border border-gray-100" 
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{item.product?.name || 'Unknown Product'}</p>
                      <p className="text-sm text-gray-500">Brand: {item.product?.brand || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{item.price}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-5 flex justify-between items-center border-t border-gray-100">
              <span className="font-medium text-gray-600">Total for your items:</span>
              <span className="text-xl font-bold text-[#8E76FF]">₹{order.sellerTotalAmount}</span>
            </div>
          </div>
        </div>

        {/* Sidebar (Right Col) */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-400" />
              <h2 className="font-bold text-gray-900">Customer Details</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{order.user?.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{order.user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{order.shippingAddress?.phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-400" />
              <h2 className="font-bold text-gray-900">Shipping Address</h2>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              <p className="font-medium text-gray-900 mb-1">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              <p>{order.shippingAddress?.country} - {order.shippingAddress?.pincode}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <h2 className="font-bold text-gray-900">Payment Info</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <span className="text-gray-500">Grand Total</span>
                <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;