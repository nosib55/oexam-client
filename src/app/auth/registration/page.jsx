"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function RegisterPage() {

      const router = useRouter();

      const [role, setRole] = useState("student");
      const [loading, setLoading] = useState(false);

      const {
            register,
            handleSubmit,
            formState: { errors }
      } = useForm();

      const onSubmit = async (data) => {

            if (data.password !== data.confirmPassword) {
                  alert("Passwords do not match");
                  return;
            }

            try {

                  setLoading(true);

                  const res = await fetch("/api/auth/register", {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                              name: data.name,
                              email: data.email,
                              password: data.password,
                              role: role,
                              institution: data.institution,
                              location: data.location,
                              userClass: data.class || null
                        })
                  });

                  const result = await res.json();

                  console.log("Registration response:", result);

                  if (!res.ok) {
                        alert(result.message || "Registration failed");
                        setLoading(false);
                        return;
                  }

                  alert(`Registration successful. We've sent a 6-digit OTP to ${result.user.email}. Check your inbox!`);

                  router.push(`/auth/verify?email=${encodeURIComponent(result.user.email)}`);

            } catch (error) {

                  console.error(error);
                  alert("Server error");

            } finally {
                  setLoading(false);
            }

      };

      const handleGoogleLogin = async () => {
            try {
                  setLoading(true);
                  const result = await signInWithPopup(auth, googleProvider);
                  const user = result.user;

                  const res = await fetch("/api/auth/social-login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                              email: user.email,
                              name: user.displayName,
                              role: role,
                        }),
                  });

                  const data = await res.json();
                  if (!res.ok) {
                        alert(data.message || "Social login failed");
                        return;
                  }

                  localStorage.setItem("token", data.token);
                  localStorage.setItem("user", JSON.stringify(data.user));
                  document.cookie = `token=${data.token}; path=/; max-age=604800`;

                  window.location.href = `/dashboard/${data.user.role}`;
            } catch (err) {
                  console.error(err);
                  alert("Social login failed");
            } finally {
                  setLoading(false);
            }
      };

      return (

            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                  <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">

                        <h1 className="text-2xl font-bold mb-6 text-center">
                              Create Account
                        </h1>

                        <div className="flex gap-2 mb-6">

                              <button
                                    type="button"
                                    onClick={() => setRole("student")}
                                    className={`flex-1 p-2 rounded ${role === "student"
                                          ? "bg-purple-600 text-white"
                                          : "bg-gray-200"
                                          }`}

                              >

                                    Student </button>

                              <button
                                    type="button"
                                    onClick={() => setRole("teacher")}
                                    className={`flex-1 p-2 rounded ${role === "teacher"
                                          ? "bg-purple-600 text-white"
                                          : "bg-gray-200"
                                          }`}

                              >

                                    Teacher </button>

                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                              <input
                                    placeholder="Full Name"
                                    className="w-full border p-2 rounded"
                                    {...register("name", { required: true })}
                              />

                              {errors.name && <p className="text-red-500 text-sm">Name required</p>}

                              <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full border p-2 rounded"
                                    {...register("email", { required: true })}
                              />

                              {errors.email && <p className="text-red-500 text-sm">Email required</p>}

                              <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full border p-2 rounded"
                                    {...register("password", { required: true })}
                              />

                              <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full border p-2 rounded"
                                    {...register("confirmPassword", { required: true })}
                              />

                              <input
                                    placeholder="Institution"
                                    className="w-full border p-2 rounded"
                                    {...register("institution", { required: role !== "admin" })}
                              />

                              <input
                                    placeholder="Location"
                                    className="w-full border p-2 rounded"
                                    {...register("location", { required: true })}
                              />

                              {role === "student" && (

                                    <select
                                          className="w-full border p-2 rounded"
                                          {...register("class", { required: true })}

                                    >

                                          <option value="">Select Class</option>

                                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (

                                                <option key={c} value={c}>
                                                      Class {c}
                                                </option>
                                          ))}

                                    </select>

                              )}

                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-purple-600 text-white py-2 rounded font-semibold"
                              >
                                    {loading ? "Registering..." : "Register"}
                              </button>

                              <div className="flex items-center gap-3 my-4">
                                    <div className="flex-1 h-[1px] bg-gray-200" />
                                    <span className="text-xs text-gray-400">Or</span>
                                    <div className="flex-1 h-[1px] bg-gray-200" />
                              </div>

                              <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-2 rounded font-semibold hover:bg-gray-50 transition"
                              >
                                    <FcGoogle className="text-xl" />
                                    <span>Google Sign Up</span>
                              </button>

                        </form>

                        <p className="text-center text-sm mt-6">

                              Already have an account?{" "}

                              <Link href="/auth/login" className="text-purple-600">
                                    Login
                              </Link>

                        </p>

                  </div>

            </div>

      );

}
