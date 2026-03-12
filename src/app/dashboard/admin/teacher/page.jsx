"use client";

import React, { useState, useEffect } from "react";
import {
  LuSearch,
  LuEye,
  LuTrash2,
  LuUserCheck,
  LuX
} from "react-icons/lu";

export default function TeacherPage() {

  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    const res = await fetch("/api/admin/teachers");
    const data = await res.json();
    setTeachers(data);
  };


  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(search.toLowerCase())
  );


  return (

    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">


      {/* Header */}

      <div className="bg-white p-8 rounded-3xl border shadow-sm">

        <h1 className="text-3xl font-bold text-gray-800">
          Teacher Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage all registered teachers
        </p>

      </div>



      {/* Search */}

      <div className="bg-white p-6 rounded-3xl border shadow-sm">

        <div className="flex items-center gap-3">

          <LuSearch size={20} className="text-gray-500" />

          <input
            type="text"
            placeholder="Search teacher..."
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>



      {/* Table */}

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

        <div className="p-8 border-b flex items-center gap-3">

          <LuUserCheck size={22} />

          <h2 className="font-semibold text-lg">
            Teacher List
          </h2>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="text-left text-sm text-gray-500 border-b">

                <th className="p-6">Name</th>
                <th>Email</th>
                <th>Institution</th>
                <th>Location</th>
                <th>Status</th>

                <th className="text-right pr-8">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredTeachers.map(teacher => (

                <tr
                  key={teacher._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-6 font-semibold">
                    {teacher.name}
                  </td>


                  <td className="text-gray-600">
                    {teacher.email}
                  </td>


                  <td className="text-gray-600">
                    {teacher.institution}
                  </td>


                  <td className="text-gray-600">
                    {teacher.location}
                  </td>


                  <td>

                    <span
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700"
                    >
                      Active
                    </span>

                  </td>


                  <td className="text-right pr-8 space-x-2">


                    {/* View */}

                    <button
                      onClick={() => setSelectedTeacher(teacher)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    >
                      <LuEye size={18} />
                    </button>


                    {/* Delete */}

                    <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                      <LuTrash2 size={18} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>



      {/* Teacher Details Modal */}

      {selectedTeacher && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


          <div className="bg-white w-[500px] rounded-3xl p-8 shadow-xl">


            {/* Header */}

            <div className="flex justify-between mb-6">

              <h2 className="text-xl font-bold">
                Teacher Details
              </h2>

              <button
                onClick={() => setSelectedTeacher(null)}
              >
                <LuX size={22} />
              </button>

            </div>



            {/* Details */}

            <div className="space-y-4 text-gray-700">

              <div>
                <span className="font-semibold">Name:</span>
                {" "}
                {selectedTeacher.name}
              </div>


              <div>
                <span className="font-semibold">Email:</span>
                {" "}
                {selectedTeacher.email}
              </div>


              <div>
                <span className="font-semibold">Institution:</span>
                {" "}
                {selectedTeacher.institution}
              </div>


              <div>
                <span className="font-semibold">Location:</span>
                {" "}
                {selectedTeacher.location}
              </div>


              <div>
                <span className="font-semibold">Verification:</span>
                {" "}
                {selectedTeacher.isVerified ? "Verified" : "Unverified"}
              </div>

            </div>



            <button
              onClick={() => setSelectedTeacher(null)}
              className="mt-6 w-full bg-blue-900 text-white py-3 rounded-xl font-semibold"
            >
              Close
            </button>


          </div>

        </div>

      )}

    </div>

  );
}