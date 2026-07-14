import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Camera, CheckCircle, XCircle, Shield, MapPin, User, Building, FileText, Lock } from 'lucide-react';
import api from '../api/axios'; 

const SellerProfile = () => {
  const { user } = useSelector((state) => state.auth);
  // If you have an action to update user in Redux after editing, import it here
  // const dispatch = useDispatch(); 

  const fileInputRef = useRef(null);

  // Form States
  const [formData, setFormData] = useState({
    ownername: '',
    shopname: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    gstNumber: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Loading States
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Sync Redux state to local form state on mount/update
  useEffect(() => {
    if (user) {
      setFormData({
        ownername: user.ownername || '',
        shopname: user.shopname || '',
        description: user.description || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        pincode: user.pincode || '',
        gstNumber: user.gstNumber || '',
      });
    }
  }, [user]);

  // Handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // API Call: Update Profile (Handles Basic Info, Address, and GST)
  const handleProfileUpdate = async (e) => {
    e?.preventDefault();
    setIsUpdatingProfile(true);
    try {
      // Assuming your api base path is configured correctly
      const { data } = await api.put('/profile', formData);
      toast.success(data.message || 'Profile updated successfully');
      // dispatch(updateUserReduxState(data.seller)); // Update Redux if needed
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // API Call: Update Logo
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('logo', file);

    setIsUploadingLogo(true);
    try {
      const { data } = await api.patch('/profile/logo', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(data.message || 'Logo updated successfully');
      // dispatch(updateUserReduxState({ ...user, logo: data.logo })); // Update Redux
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update logo');
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // API Call: Update Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setIsUpdatingPassword(true);
    try {
      const { data } = await api.patch('/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success(data.message || 'Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!user) return <div className="p-8 text-center text-gray-500">Loading Profile...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seller Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your shop details, address, and security.</p>
      </div>

      {/* Top Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 rounded-full border-4 border-gray-50 overflow-hidden shadow-inner bg-gray-100 flex items-center justify-center">
            {user.logo ? (
              <img src={user.logo} alt="Shop Logo" className="w-full h-full object-cover" />
            ) : (
              <Building className="w-12 h-12 text-gray-300" />
            )}
            {isUploadingLogo && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleLogoUpload} />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingLogo}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            <Camera className="w-4 h-4" /> Upload New Logo
          </button>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.shopname}</h2>
            <p className="text-gray-500 font-medium">{user.ownername}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <span className="text-sm text-gray-500">Status:</span>
              {user.status === 'Approved' ? (
                <span className="flex items-center text-sm font-semibold text-emerald-600"><CheckCircle className="w-4 h-4 mr-1" /> Approved</span>
              ) : (
                <span className="flex items-center text-sm font-semibold text-amber-600">Pending</span>
              )}
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <span className="text-sm text-gray-500">Blocked:</span>
              <span className={`text-sm font-semibold ${user.isBlocked ? 'text-rose-600' : 'text-gray-700'}`}>
                {user.isBlocked ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5 border-b border-gray-100 pb-3">
              <User className="w-5 h-5 text-[#8E76FF]" />
              <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Owner Name" name="ownername" value={formData.ownername} onChange={handleInputChange} />
                <InputField label="Shop Name" name="shopname" value={formData.shopname} onChange={handleInputChange} />
                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" rows="3" value={formData.description} onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#F3F3FF] border-none rounded-xl focus:ring-2 focus:ring-[#8E76FF] outline-none resize-none"
                />
              </div>
              <div className="flex justify-end pt-2">
                <SubmitButton isLoading={isUpdatingProfile} onClick={handleProfileUpdate} text="Save Basic Information" />
              </div>
            </div>
          </div>

          {/* Business Address */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5 border-b border-gray-100 pb-3">
              <MapPin className="w-5 h-5 text-[#8E76FF]" />
              <h3 className="text-lg font-bold text-gray-900">Business Address</h3>
            </div>
            <div className="space-y-4">
              <InputField label="Address Line" name="address" value={formData.address} onChange={handleInputChange} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} />
                <InputField label="State" name="state" value={formData.state} onChange={handleInputChange} />
                <InputField label="Country" name="country" value={formData.country} onChange={handleInputChange} />
                <InputField label="Pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} />
              </div>
              <div className="flex justify-end pt-2">
                <SubmitButton isLoading={isUpdatingProfile} onClick={handleProfileUpdate} text="Update Address" />
              </div>
            </div>
          </div>

          {/* Business Information (GST) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5 border-b border-gray-100 pb-3">
              <FileText className="w-5 h-5 text-[#8E76FF]" />
              <h3 className="text-lg font-bold text-gray-900">Business Information</h3>
            </div>
            <div className="space-y-4">
              <InputField label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} className="uppercase" />
              <div className="flex justify-end pt-2">
                <SubmitButton isLoading={isUpdatingProfile} onClick={handleProfileUpdate} text="Update GST" />
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: IDs, Security & Meta */}
        <div className="space-y-6">
          
          {/* Identity Verification */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5 border-b border-gray-100 pb-3">
              <Shield className="w-5 h-5 text-[#8E76FF]" />
              <h3 className="text-lg font-bold text-gray-900">Identity Verification</h3>
            </div>
            <div className="space-y-5">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Front ID</span>
                <div className="w-full h-40 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
                  {user.idProof?.front ? (
                    <img src={user.idProof.front} alt="ID Front" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  ) : <span className="text-gray-400 text-sm">No Image</span>}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Back ID</span>
                <div className="w-full h-40 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
                  {user.idProof?.back ? (
                    <img src={user.idProof.back} alt="ID Back" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  ) : <span className="text-gray-400 text-sm">No Image</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Security / Password */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5 border-b border-gray-100 pb-3">
              <Lock className="w-5 h-5 text-[#8E76FF]" />
              <h3 className="text-lg font-bold text-gray-900">Security</h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <InputField label="Current Password" type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
              <InputField label="New Password" type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
              <InputField label="Confirm Password" type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isUpdatingPassword}
                  className="w-full bg-[#8E76FF] hover:bg-[#7C63F5] text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {isUpdatingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Account Information (Read Only) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Account Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Seller ID</span>
                <span className="font-mono font-medium text-gray-900">{user._id.slice(0, 10)}...</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Joined On</span>
                <span className="font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated</span>
                <span className="font-medium text-gray-900">
                  {new Date(user.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, name, value, onChange, type = "text", required = false, className = "" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input 
      type={type} name={name} value={value} onChange={onChange} required={required}
      className={`w-full px-4 py-2 bg-[#F3F3FF] border-none rounded-xl focus:ring-2 focus:ring-[#8E76FF] outline-none ${className}`}
    />
  </div>
);

// Reusable Button Component
const SubmitButton = ({ isLoading, onClick, text }) => (
  <button 
    onClick={onClick} 
    disabled={isLoading}
    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
  >
    {isLoading ? 'Saving...' : text}
  </button>
);

export default SellerProfile;