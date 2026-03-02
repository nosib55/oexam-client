"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function RegistrationPage() {
  const [role, setRole] = useState("student");
  const [showPass, setShowPass] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /* ================= IMAGE HANDLER ================= */

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */

  const onSubmit = async (data) => {
    try {
      let imageUrl = "";

      if (image) {
        setUploading(true);

        const formData = new FormData();
        formData.append("image", image);

        const res = await fetch(
          "https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY",
          { method: "POST", body: formData }
        );

        const imgData = await res.json();
        imageUrl = imgData?.data?.url || "";
      }

      const finalData = {
        ...data,
        role,
        profileImage: imageUrl,
      };

      alert(JSON.stringify(finalData, null, 2));
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#ece9f6] p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* ================= LEFT PRIMARY PANEL ================= */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-center items-center text-center
                     bg-primary
                     text-secondary p-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-yellow-300">
            Get Started
          </h2>

          <p className="text-sm opacity-90 mb-8">
            Already have an account?
          </p>

          <Link
            href="/auth/login"
            className="px-8 py-2 rounded-full border border-yellow-300
                       text-yellow-300 hover:bg-yellow-300 hover:text-[#2b4bee] transition"
          >
            Log in
          </Link>

          <div className="flex gap-3 mt-10">
            <span className="w-3 h-3 rounded-full bg-white/80" />
            <span className="w-3 h-3 rounded-full border border-white/60" />
            <span className="w-3 h-3 rounded-full border border-white/60" />
          </div>
        </motion.div>

        {/* ================= RIGHT REGISTER FORM ================= */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="p-10 md:p-12 flex flex-col justify-center"
        >
          <h1 className="text-3xl font-semibold text-primary mb-8">
            Create Account
          </h1>

          {/* Role switch */}
          <div className="flex gap-3 mb-6">
            {["student", "teacher"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`px-4 py-1.5 text-xs rounded-full border transition ${role === r
                  ? "bg-primary text-white border-primary"
                  : "text-gray-500 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* ===== FORM ===== */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <Input
              icon={<FiUser />}
              placeholder="Username"
              error={errors.name}
              {...register("name", { required: "Username required" })}
            />

            {role === "teacher" && (
              <>
                <Input
                  placeholder="Institution name"
                  error={errors.institution}
                  {...register("institution", { required: "Required" })}
                />
                <Input
                  placeholder="Institution location"
                  error={errors.location}
                  {...register("location", { required: "Required" })}
                />
              </>
            )}

            <Input
              icon={<FiMail />}
              type="email"
              placeholder="E-mail"
              error={errors.email}
              {...register("email", { required: "Email required" })}
            />

            <PasswordInput
              show={showPass}
              toggle={() => setShowPass(!showPass)}
              error={errors.password}
              register={register("password", {
                required: "Password required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />


            {/* ===== PROFILE IMAGE BELOW FORM ===== */}
            <div className="flex flex-col items-center gap-3 mt-8">
              <label className="cursor-pointer">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary
                              flex items-center justify-center overflow-hidden bg-[#eef1ff]">
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-primary">Upload Photo</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {uploading && (
                <p className="text-xs text-primary">Uploading image...</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                {...register("terms", { required: true })}
                className="accent-primary"
              />
              I accept the terms of the agreement
            </label>
            {errors.terms && (
              <p className="text-red-500 text-xs">You must accept terms</p>
            )}

            <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-[#1f36b8] transition">
              Sign Up
            </button>
          </form>


        </motion.div>
      </div>

      {/* ===== BACK BUTTON ===== */}
      <Link
        href="/"
        className="mt-6 flex items-center gap-2 text-sm text-gray-600 hover:text-[#2b4bee] transition"
      >
        <FiArrowLeft />
        Back to Home
      </Link>
    </div>
  );
}

/* ================= INPUT COMPONENTS ================= */

function Input({ icon, error, ...props }) {
  return (
    <div>
      <div className="flex items-center border-b border-gray-300 py-2">
        {icon && <span className="text-gray-400 mr-3">{icon}</span>}
        <input {...props} className="w-full outline-none text-sm placeholder-gray-400" />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

function PasswordInput({ show, toggle, error, register }) {
  return (
    <div>
      <div className="flex items-center border-b border-gray-300 py-2">
        <FiLock className="text-gray-400 mr-3" />
        <input
          type={show ? "text" : "password"}
          placeholder="Password"
          {...register}
          className="w-full outline-none text-sm placeholder-gray-400"
        />
        <button type="button" onClick={toggle} className="text-gray-400">
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

