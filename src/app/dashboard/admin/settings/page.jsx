"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

import {
  LuUser,
  LuMail,
  LuShield,
  LuLock,
  LuSave,
  LuX
} from "react-icons/lu";

export default function AdminProfileSettings() {

const DEMO_EMAIL = "admin@system.com";


/* PROFILE */

const [formData,setFormData]=useState({
name:"Admin User",
email:DEMO_EMAIL
});


/* MODAL */

const [openModal,setOpenModal]=useState(false);
const [step,setStep]=useState(1);

const [email,setEmail]=useState("");
const [code,setCode]=useState("");

const [generatedCode,setGeneratedCode]=useState(null);

const [timer,setTimer]=useState(60);

const [verified,setVerified]=useState(false);

const [newPassword,setNewPassword]=useState("");



/* PROFILE FORM */

const handleChange=(e)=>{

setFormData({
...formData,
[e.target.name]:e.target.value
});

};


const handleSave=()=>{

alert("Profile Saved");

};


const handleCancel=()=>{

setFormData({
name:"Admin User",
email:DEMO_EMAIL
});

};



/* OTP */

const sendCode=()=>{

if(email!==DEMO_EMAIL){

alert("Use demo email: admin@system.com");

return;

}

const otp=Math.floor(100000+Math.random()*900000);

setGeneratedCode(String(otp));

alert("Demo OTP: "+otp);

setStep(2);

setTimer(60);

};



const verifyCode=()=>{

if(code===generatedCode){

setVerified(true);

alert("Verified");

}else{

alert("Wrong Code");

}

};



const savePassword=()=>{

if(newPassword.length<4){

alert("Password too short");

return;

}

alert("Password Changed");

closeModal();

};



const closeModal=()=>{

setOpenModal(false);

setStep(1);

setVerified(false);

setEmail("");

setCode("");

setGeneratedCode(null);

setNewPassword("");

};



/* TIMER */

useEffect(()=>{

if(step!==2) return;

if(timer<=0) return;

const interval=setInterval(()=>{

setTimer(prev=>prev-1);

},1000);

return()=>clearInterval(interval);

},[timer,step]);



return(

<div className="max-w-[1000px] mx-auto space-y-8 pb-10">


{/* HEADER */}

<div className="bg-white p-8 rounded-3xl border shadow-sm">

<h1 className="text-3xl font-bold text-gray-800">
Admin Profile & Settings
</h1>

<p className="text-gray-500 mt-2">
Manage profile and account settings
</p>

</div>



{/* PROFILE CARD */}

<div className="bg-white p-10 rounded-3xl border shadow-sm">


<div className="flex flex-col items-center text-center">


<Image
src="https://i.pravatar.cc/150?img=12"
width={120}
height={120}
alt="Profile"
className="rounded-full border"
/>


<h2 className="text-2xl font-bold mt-4">
{formData.name}
</h2>


<p className="text-gray-500">
{formData.email}
</p>


</div>



{/* INFO CARDS */}

<div className="grid md:grid-cols-3 gap-4 mt-8">


<div className="bg-gray-50 p-4 rounded-xl flex gap-3 items-center">

<LuUser/>

{formData.name}

</div>



<div className="bg-gray-50 p-4 rounded-xl flex gap-3 items-center">

<LuMail/>

{formData.email}

</div>



<div className="bg-gray-50 p-4 rounded-xl flex gap-3 items-center">

<LuShield/>

Admin

</div>


</div>



{/* FORM */}

<div className="mt-10 space-y-6">


<div>

<label className="text-sm font-semibold">
Admin Name
</label>


<div className="border p-3 rounded-xl flex gap-3 mt-2">

<LuUser/>

<input
name="name"
value={formData.name}
onChange={handleChange}
className="w-full outline-none"
/>

</div>

</div>



<div>

<label className="text-sm font-semibold">
Email
</label>


<div className="border p-3 rounded-xl flex gap-3 mt-2">

<LuMail/>

<input
name="email"
value={formData.email}
onChange={handleChange}
className="w-full outline-none"
/>

</div>

</div>



{/* BUTTONS */}

<div className="flex gap-4 flex-wrap">


<button
onClick={handleSave}
className="bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold flex gap-2"
>

<LuSave/>

Save

</button>



<button
onClick={handleCancel}
className="bg-gray-200 px-6 py-3 rounded-xl font-semibold flex gap-2"
>

<LuX/>

Cancel

</button>



<button
onClick={()=>setOpenModal(true)}
className="bg-black text-white px-6 py-3 rounded-xl font-semibold flex gap-2"
>

<LuLock/>

Change Password

</button>


</div>


</div>

</div>



{/* PASSWORD MODAL */}

{openModal&&(

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

<div className="bg-white p-8 rounded-3xl w-[420px] space-y-6 shadow-xl">


<h2 className="text-xl font-bold">
Reset Password
</h2>



{/* STEP 1 */}

{step===1&&(

<>

<p className="text-sm text-gray-500">

Demo Email: admin@system.com

</p>


<div className="border p-3 rounded-xl flex gap-3">

<LuMail/>

<input
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="Enter Email"
className="w-full outline-none"
/>

</div>


<button
onClick={sendCode}
className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold"
>

Get Code

</button>

</>

)}



{/* STEP 2 */}

{step===2&&!verified&&(

<>

<div className="border p-3 rounded-xl flex gap-3">

<LuLock/>

<input
value={code}
onChange={(e)=>setCode(e.target.value)}
placeholder="Enter OTP"
className="w-full outline-none"
/>

</div>


<div className="text-center text-sm">

{timer>0?

<>Resend in {timer}s</>

:

<button onClick={sendCode} className="text-blue-900">
Resend Code
</button>

}

</div>


<button
onClick={verifyCode}
className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
>

Verify Code

</button>

</>

)}



{/* STEP 3 */}

{verified&&(

<>

<div className="border p-3 rounded-xl flex gap-3">

<LuLock/>

<input
type="password"
value={newPassword}
onChange={(e)=>setNewPassword(e.target.value)}
placeholder="New Password"
className="w-full outline-none"
/>

</div>


<button
onClick={savePassword}
className="w-full bg-black text-white py-3 rounded-xl font-semibold"
>

Save Password

</button>

</>

)}



<button
onClick={closeModal}
className="w-full bg-gray-200 py-3 rounded-xl font-semibold"
>

Close

</button>


</div>

</div>

)}


</div>

);

}