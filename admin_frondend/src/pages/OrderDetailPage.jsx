import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ArrowLeft, UserCircle2, MapPin, CreditCard, Package } from "lucide-react";
import { fetchOrderById, updateOrderStatus, updatePaymentStatus, clearSelectedOrder } from "../features/orders/ordersSlice";

const currency = (val) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedOrder: order, detailStatus, actionStatus } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
    return () => { dispatch(clearSelectedOrder()); };
  }, [dispatch, id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    const result = await dispatch(updateOrderStatus({ id, orderStatus: newStatus }));
    if (updateOrderStatus.fulfilled.match(result)) toast.success(`Order marked as ${newStatus}`);
    else toast.error(result.payload || "Failed to update order status");
  };

  const handlePaymentChange = async (e) => {
    const newStatus = e.target.value;
    const result = await dispatch(updatePaymentStatus({ id, paymentStatus: newStatus }));
    if (updatePaymentStatus.fulfilled.match(result)) toast.success(`Payment marked as ${newStatus}`);
    else toast.error(result.payload || "Failed to update payment status");
  };

  if (detailStatus === "loading" || !order) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-[#8991A8] hover:text-[#EDEFF4] transition mb-6">
        <ArrowLeft size={15} /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Details */}
        <div className="w-full md:w-1/3 space-y-6">
          
          {/* Customer & Address */}
          <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
            <div className="flex items-center gap-2 mb-4 text-[#EDEFF4]">
              <UserCircle2 size={18} className="text-[#C9A15C]" />
              <h2 className="font-semibold text-sm">Customer Info</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-[#EDEFF4] font-medium">{order.shippingAddress?.fullName}</p>
              <p className="text-[#8991A8]">{order.user?.email || "No email"}</p>
              <p className="text-[#8991A8]">{order.shippingAddress?.phone}</p>
            </div>
            
            <div className="h-px bg-[#2A3142] my-4" />
            
            <div className="flex items-center gap-2 mb-3 text-[#EDEFF4]">
              <MapPin size={18} className="text-[#C9A15C]" />
              <h2 className="font-semibold text-sm">Shipping Address</h2>
            </div>
            <p className="text-sm text-[#8991A8] leading-relaxed">
              {order.shippingAddress?.address}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
              {order.shippingAddress?.country} - {order.shippingAddress?.pincode}
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5">
            <div className="flex items-center gap-2 mb-4 text-[#EDEFF4]">
              <CreditCard size={18} className="text-[#C9A15C]" />
              <h2 className="font-semibold text-sm">Payment Details</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8991A8]">Method:</span>
                <span className="text-[#EDEFF4]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8991A8]">Status:</span>
                <select
                  value={order.paymentStatus}
                  onChange={handlePaymentChange}
                  disabled={actionStatus === "loading"}
                  className="bg-[#0F1320] border border-[#2A3142] rounded px-2 py-1 text-xs text-[#EDEFF4] focus:border-[#C9A15C]/50"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status Update & Products */}
        <div className="w-full md:w-2/3 space-y-6">
          
          {/* Top Status Bar */}
          <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-1">Order ID</p>
              <p className="font-mono text-lg text-[#EDEFF4]">{order._id}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-1">Update Status</p>
              <div className="flex items-center gap-3">
                {actionStatus === "loading" && <span className="h-4 w-4 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />}
                <select
                  value={order.orderStatus}
                  onChange={handleStatusChange}
                  disabled={actionStatus === "loading"}
                  className="bg-[#0F1320] border border-[#2A3142] rounded-md px-4 py-2 text-sm text-[#EDEFF4] focus:outline-none focus:border-[#C9A15C]/50 shadow-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ordered Products */}
          <div className="bg-[#161B2C] border border-[#2A3142] rounded-md overflow-hidden">
            <div className="p-5 border-b border-[#2A3142] flex items-center gap-2 text-[#EDEFF4]">
              <Package size={18} className="text-[#C9A15C]" />
              <h2 className="font-semibold text-sm">Ordered Products</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-[#2A3142] bg-[#0F1320]/50">
                  <tr>
                    <th className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-3">Product</th>
                    <th className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-3">Seller</th>
                    <th className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-3">Price</th>
                    <th className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-3">Qty</th>
                    <th className="font-mono text-[10px] tracking-[0.1em] text-[#8991A8] uppercase font-normal px-5 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item) => (
                    <tr key={item._id} className="border-b border-[#2A3142]/60 last:border-0">
                      <td className="px-5 py-4 flex items-center gap-3">
                        {item.product?.images?.[0] ? (
                          <img src={item.product.images[0]} alt="product" className="h-10 w-10 rounded border border-[#2A3142] object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded border border-[#2A3142] bg-[#0F1320]" />
                        )}
                        <span className="text-[#EDEFF4] font-medium">{item.product?.name || "Deleted Product"}</span>
                      </td>
                      <td className="px-5 py-4 text-[#8991A8]">{item.seller?.shopname || "Unknown Seller"}</td>
                      <td className="px-5 py-4 text-[#8991A8] tabular-nums">{currency(item.price)}</td>
                      <td className="px-5 py-4 text-[#EDEFF4] tabular-nums font-medium">{item.quantity}</td>
                      <td className="px-5 py-4 text-[#EDEFF4] tabular-nums font-medium text-right">{currency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Footer */}
            <div className="p-5 bg-[#0F1320]/30 flex justify-end">
              <div className="text-right">
                <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-1">Grand Total</p>
                <p className="text-2xl font-semibold text-[#C9A15C] tabular-nums">{currency(order.totalAmount)}</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;