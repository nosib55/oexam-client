'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaSchool,
  FaMapMarkerAlt,
  FaSave,
  FaCloudUploadAlt,
  FaSpinner,
} from 'react-icons/fa';

const AddNewStudent = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    className: 'Class 10',
    gender: 'Male',
    address: '',
    profilePicture: '', // will store the hosted image URL
  });

  // Handle text input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Image Upload to Cloudinary
  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    // Client side validation
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File size must be less than 5MB');
    }

    // Set local preview
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    const data = new FormData();
    data.append('file', file);
    data.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    ); 
    data.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        data,
      );
      setFormData(prev => ({ ...prev, profilePicture: res.data.secure_url }));
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Form Submit Handler
  const handleSubmit = async e => {
    e.preventDefault();
    if (uploading)
      return toast.error('Please wait for the photo to finish uploading');

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const payload = { ...formData, teacherId: user?._id };

      const res = await axios.post('/api/teacher/students', payload);

      if (res.status === 201) {
        toast.success('Student Enrolled Successfully!');
        router.push('/dashboard/teacher/students');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 p-4 lg:p-0">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <Link
            href="/dashboard/teacher/students"
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Add New Student
            </h1>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">
              Student Enrollment Portal
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || uploading}
          className="hidden md:flex bg-primary text-white h-14 rounded-2xl px-8 font-bold shadow-lg transition-all items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaSave size={18} />
          )}
          <span>{loading ? 'Processing...' : 'Enroll Student'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE: AVATAR UPLOAD */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div
              onClick={() => fileInputRef.current.click()}
              className="relative group cursor-pointer"
            >
              <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-primary group-hover:bg-primary/5 transition-all overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle
                    size={80}
                    className="group-hover:scale-110 transition-transform duration-500"
                  />
                )}

                {uploading && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <FaSpinner
                      className="animate-spin text-primary"
                      size={30}
                    />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
                <FaCloudUploadAlt size={18} />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            <div className="mt-6">
              <h3 className="font-bold text-slate-700">Student Photo</h3>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: FORM FIELDS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <FaUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    type="text"
                    required
                    placeholder="e.g. Ayesha Rahman"
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    required
                    placeholder="student@example.com"
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <div className="relative group">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    required
                    placeholder="+880 1XXX XXXXXX"
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Class Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Assigned Class
                </label>
                <div className="relative group">
                  <FaSchool className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-600 text-sm appearance-none cursor-pointer"
                  >
                    <option>Class 04</option>
                    <option>Class 05</option>
                    <option>Class 06</option>
                    <option>Class 07</option>
                    <option>Class 08</option>
                    <option>Class 09</option>
                    <option>Class 10</option>
                    <option>HSC</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Gender Switcher */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Gender
              </label>
              <div className="flex gap-4">
                {['Male', 'Female', 'Other'].map(g => (
                  <button
                    key={g}
                    type="button"
                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      formData.gender === g
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                    onClick={() => setFormData({ ...formData, gender: g })}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 pt-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Permanent Address
              </label>
              <div className="relative group">
                <FaMapMarkerAlt className="absolute left-4 top-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address here..."
                  className="w-full pl-11 pr-4 py-4 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 text-sm min-h-[120px] transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || uploading}
              className="md:hidden w-full bg-primary text-white h-16 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaSave size={18} />
              )}
              <span>{loading ? 'Processing...' : 'Enroll Student'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewStudent;
