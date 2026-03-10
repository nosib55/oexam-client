"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
class: data.class || null
})
});

const result = await res.json();

if (!res.ok) {
alert(result.message || "Registration failed");
setLoading(false);
return;
}

alert("Registration successful");

router.push("/auth/login");

} catch (error) {

console.error(error);
alert("Server error");

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
onClick={()=>setRole("student")}
className={`flex-1 p-2 rounded ${
role==="student"
? "bg-purple-600 text-white"
: "bg-gray-200"
}`}

>

Student </button>

<button
type="button"
onClick={()=>setRole("teacher")}
className={`flex-1 p-2 rounded ${
role==="teacher"
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
{...register("name",{required:true})}
/>

{errors.name && <p className="text-red-500 text-sm">Name required</p>}

<input
type="email"
placeholder="Email"
className="w-full border p-2 rounded"
{...register("email",{required:true})}
/>

{errors.email && <p className="text-red-500 text-sm">Email required</p>}

<input
type="password"
placeholder="Password"
className="w-full border p-2 rounded"
{...register("password",{required:true})}
/>

<input
type="password"
placeholder="Confirm Password"
className="w-full border p-2 rounded"
{...register("confirmPassword",{required:true})}
/>

<input
placeholder="Institution"
className="w-full border p-2 rounded"
{...register("institution",{required:true})}
/>

<input
placeholder="Location"
className="w-full border p-2 rounded"
{...register("location",{required:true})}
/>

{role==="student" && (

<select
className="w-full border p-2 rounded"
{...register("class",{required:true})}

>

<option value="">Select Class</option>

{[1,2,3,4,5,6,7,8,9,10].map((c)=>(

<option key={c} value={c}>
Class {c}
</option>
))}

</select>

)}

<button
type="submit"
disabled={loading}
className="w-full bg-purple-600 text-white py-2 rounded"

>

{loading ? "Registering..." : "Register"}

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
