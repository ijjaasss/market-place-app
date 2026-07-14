import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews } from '../redux/slices/reviewSlice';
import { Search, Star, ChevronLeft, Eye } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Reviews = () => {
  const dispatch = useDispatch();
  const { reviews, cards, totalPages, isLoading } = useSelector((state) => state.reviews);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState('');
  const [sort, setSort] = useState('newest');
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    dispatch(fetchReviews({ page, search, rating, sort }));
  }, [dispatch, page, search, rating, sort]);

 
  const handleViewDetail = async (id) => {
    try {
      const { data } = await api.get(`/reviews/${id}`);
      setSelectedReview(data.review);
    } catch (err) { toast.error("Failed to load details"); }
  };

  if (selectedReview) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={() => setSelectedReview(null)} className="flex items-center text-gray-500 hover:text-black">
          <ChevronLeft className="w-5 h-5"/> Back to Reviews
        </button>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex gap-6 items-center">
            <img src={selectedReview.product.images[0]} className="w-24 h-24 rounded-2xl object-cover bg-gray-100" />
            <h2 className="text-3xl font-bold">{selectedReview.product.name}</h2>
          </div>
          <div className="space-y-4">
            <p><span className="text-gray-400">Customer:</span> {selectedReview.customer.name}</p>
            <p><span className="text-gray-400">Rating:</span> <span className="text-amber-500 font-bold">{selectedReview.rating} ⭐</span></p>
            <div className="bg-gray-50 p-6 rounded-2xl text-gray-700">{selectedReview.review}</div>
            <p className="text-sm text-gray-400">Reviewed on {new Date(selectedReview.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Reviews" value={cards.totalReviews} />
        <StatCard title="Average Rating" value={`⭐ ${cards.averageRating}`} />
        <StatCard title="5 Star Reviews" value={cards.fiveStarReviews} />
        <StatCard title="Products Reviewed" value={cards.productsWithReviews} />
      </div>

      <div className="bg-white p-4 rounded-2xl flex gap-4 border border-gray-100">
        <div className="relative flex-1"><Search className="absolute left-3 top-3 w-4 h-4 text-gray-400"/><input placeholder="Search..." className="w-full pl-10 py-2.5 bg-gray-50 rounded-xl outline-none" onChange={(e) => setSearch(e.target.value)} /></div>
        <select className="px-4 bg-gray-50 rounded-xl" onChange={(e) => setRating(e.target.value)}><option value="">All Ratings</option>{[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}</select>
        <select className="px-4 bg-gray-50 rounded-xl" onChange={(e) => setSort(e.target.value)}>{['newest', 'oldest', 'highest-rating', 'lowest-rating'].map(s => <option key={s} value={s}>{s}</option>)}</select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 uppercase text-gray-500 text-xs">
            <tr><th className="px-6 py-4">Product</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Rating</th><th className="px-6 py-4">Review</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Action</th></tr>
          </thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{r.productName}</td>
                <td className="px-6 py-4">{r.customerName}</td>
                <td className="px-6 py-4">{r.rating} ⭐</td>
                <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{r.review}</td>
                <td className="px-6 py-4">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4"><button onClick={() => handleViewDetail(r._id)} className="text-[#8E76FF] font-semibold flex gap-1"><Eye className="w-4 h-4"/> View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100">
    <p className="text-xs text-gray-400 uppercase font-bold">{title}</p>
    <p className="text-2xl font-black mt-1">{value}</p>
  </div>
);

export default Reviews;