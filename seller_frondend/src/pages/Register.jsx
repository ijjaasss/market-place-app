import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus, Upload, Building2, MapPin, FileText } from 'lucide-react';
import { registerSeller } from '../redux/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, error } = useSelector((state) => state.auth);

  const [textData, setTextData] = useState({
    ownername: '', shopname: '', email: '', phone: '', password: '',
    description: '', address: '', city: '', state: '', country: '',
    pincode: '', gstNumber: ''
  });

  const [fileData, setFileData] = useState({
    logo: null, front: null, back: null
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleTextChange = (e) => {
    setTextData({ ...textData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFileData({ ...fileData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation for required files
    if (!fileData.front || !fileData.back) {
      return toast.warning('Front and Back ID proofs are required.');
    }

    // Construct FormData for multipart/form-data submission
    const submitData = new FormData();
    
    // Append all text fields
    Object.keys(textData).forEach(key => {
      submitData.append(key, textData[key]);
    });

    // Append files
    if (fileData.logo) submitData.append('logo', fileData.logo);
    submitData.append('front', fileData.front);
    submitData.append('back', fileData.back);

    const resultAction = await dispatch(registerSeller(submitData));

    if (registerSeller.fulfilled.match(resultAction)) {
      toast.success('Registration successful! Waiting for admin approval.');
      navigate('/'); // Redirect to login
    }
  };

  return (
    <div className="min-h-screen bg-[#E0E0FB] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#8E76FF] rounded-full blur-[120px] opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-[120px] opacity-40"></div>

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col">
        
        {/* Header Section */}
        <div className="bg-[#8E76FF] p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white relative z-10 mb-2">Create Seller Account</h1>
          <p className="text-white/80 relative z-10">Join our platform and start selling today.</p>
        </div>

        {/* Form Section */}
        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* --- BASIC DETAILS --- */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4 border-b pb-2">
                <Building2 className="w-5 h-5 text-[#8E76FF]" /> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputGroup label="Owner Name" name="ownername" type="text" placeholder="e.g., Radhika" value={textData.ownername} onChange={handleTextChange} required />
                <InputGroup label="Shop Name" name="shopname" type="text" placeholder="e.g., Golden Bites" value={textData.shopname} onChange={handleTextChange} required />
                <InputGroup label="Email Address" name="email" type="email" placeholder="seller@example.com" value={textData.email} onChange={handleTextChange} required />
                <InputGroup label="Phone Number" name="phone" type="tel" placeholder="10-digit number" value={textData.phone} onChange={handleTextChange} required />
                <InputGroup label="Password" name="password" type="password" placeholder="••••••••" value={textData.password} onChange={handleTextChange} required />
                <InputGroup label="GST Number" name="gstNumber" type="text" placeholder="GSTIN..." value={textData.gstNumber} onChange={handleTextChange} required />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Description</label>
                  <textarea name="description" value={textData.description} onChange={handleTextChange} required rows="3"
                    className="w-full px-4 py-2.5 bg-[#F3F3FF] border border-[#F3F3FF] rounded-xl focus:ring-2 focus:ring-[#8E76FF] focus:border-[#8E76FF] outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                    placeholder="Tell us about your business..."></textarea>
                </div>
              </div>
            </div>

            {/* --- LOCATION DETAILS --- */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4 border-b pb-2">
                <MapPin className="w-5 h-5 text-[#8E76FF]" /> Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <InputGroup label="Full Address" name="address" type="text" placeholder="Street, Building, Area" value={textData.address} onChange={handleTextChange} required />
                </div>
                <InputGroup label="City" name="city" type="text" placeholder="e.g., Mysore" value={textData.city} onChange={handleTextChange} required />
                <InputGroup label="State" name="state" type="text" placeholder="State" value={textData.state} onChange={handleTextChange} required />
                <InputGroup label="Country" name="country" type="text" placeholder="Country" value={textData.country} onChange={handleTextChange} required />
                <InputGroup label="Pincode" name="pincode" type="text" placeholder="Postal Code" value={textData.pincode} onChange={handleTextChange} required />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4 border-b pb-2">
                <FileText className="w-5 h-5 text-[#8E76FF]" /> Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FileUpload name="logo" label="Shop Logo (Optional)" onChange={handleFileChange} file={fileData.logo} />
                <FileUpload name="front" label="ID Proof (Front) *" onChange={handleFileChange} file={fileData.front} required />
                <FileUpload name="back" label="ID Proof (Back) *" onChange={handleFileChange} file={fileData.back} required />
              </div>
            </div>

            {/* --- SUBMIT --- */}
            <div className="pt-4">
              <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-[#8E76FF] hover:bg-[#7C63F5] text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-[#8E76FF]/30 disabled:bg-[#A8A0FB]">
                {isLoading ? <span className="animate-pulse">Submitting Application...</span> : <><UserPlus className="h-5 w-5" /> Register as Seller</>}
              </button>
            </div>
            
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="font-semibold text-[#8E76FF] hover:text-[#7C63F5] transition-colors">
              Sign in here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};


const InputGroup = ({ label, name, type, placeholder, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    <input
      type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required}
      className="w-full px-4 py-2.5 bg-[#F3F3FF] border border-[#F3F3FF] rounded-xl focus:ring-2 focus:ring-[#8E76FF] focus:border-[#8E76FF] outline-none transition-all text-gray-900 placeholder:text-gray-400"
    />
  </div>
);


const FileUpload = ({ label, name, onChange, file, required }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#8E76FF]/50 rounded-xl cursor-pointer bg-[#F3F3FF] hover:bg-[#E0E0FB]/50 transition-colors">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Upload className="w-6 h-6 text-[#8E76FF] mb-1" />
        <p className="text-xs text-gray-500 truncate max-w-[120px]">
          {file ? file.name : "Click to upload"}
        </p>
      </div>
      <input type="file" name={name} className="hidden" onChange={onChange} accept="image/*" required={required} />
    </label>
  </div>
);

export default Register;