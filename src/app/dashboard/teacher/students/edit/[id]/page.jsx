'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaUserCircle,
  FaSave,
  FaSpinner,
  FaCloudUploadAlt,
  FaEnvelope,
  FaPhone,
  FaSchool,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import Link from 'next/link';

const EditStudent = () => {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    className: 'Class 10',
    gender: 'Male',
    address: '',
    profilePicture: '',
  });

  // Fetch student data on load
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`/api/teacher/students/${id}`);
        if (res.data) {
          setFormData(res.data);
          setPreviewUrl(res.data.profilePicture);
        }
      } catch (error) {
        toast.error('Failed to load student data');
        router.push('/dashboard/teacher/students');
      } finally {
        setFetching(false);
      }
    };
    fetchStudent();
  }, [id, router]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    const data = new FormData();
    data.append('file', file);
    data.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    );

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        data,
      );
      setFormData(prev => ({ ...prev, profilePicture: res.data.secure_url }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/teacher/students/${id}`, formData);
      toast.success('Student updated successfully!');
      router.push('/dashboard/teacher/students');
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <FaSpinner className="animate-spin text-primary text-4xl" />
        <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">
          Loading Student Data...
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto pb-20 p-4 lg:p-0">
      {/* HEADER */}
      <div className="flex items-center gap-5 mb-10">
        <Link
          href="/dashboard/teacher/students"
          className="w-12 h-12 bg-white border border-slate-100 flex items-center justify-center rounded-2xl text-slate-400 hover:text-primary shadow-sm transition-all"
        >
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Edit Student
          </h1>
          <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">
            Update Student Information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AVATAR SECTION */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div
              onClick={() => fileInputRef.current.click()}
              className="relative group cursor-pointer"
            >
              <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-primary transition-all overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <FaUserCircle size={80} />
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
            <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Update Photo
            </p>
          </div>
        </div>

        {/* FORM SECTION */}
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

            {/* Gender Selection */}
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
                  className="w-full pl-11 pr-4 py-4 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 font-bold text-slate-700 text-sm min-h-[120px] transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || uploading}
              className="w-full bg-primary text-white h-16 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <FaSpinner className="animate-spin" size={18} />
              ) : (
                <FaSave size={18} />
              )}
              <span>
                {loading ? 'Saving Changes...' : 'Update Student Info'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
