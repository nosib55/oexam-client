"use client";

import React, { useState, useEffect } from "react";
import {
  LuSearch,
  LuEye,
  LuTrash2,
  LuUsers,
  LuX
} from "react-icons/lu";

export default function StudentPage() {

  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await fetch("/api/admin/students");
    const data = await res.json();
    setStudents(data);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">

      {/* Header */}
      <div className="bg-white p-8 rounded-3xl border shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">
          Student Management
        </h1>
        <p className="text-gray-500 mt-2">
          Manage all registered students
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-3xl border shadow-sm">
        <div className="flex items-center gap-3">
          <LuSearch size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search student..."
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

        <div className="p-8 border-b flex items-center gap-3">
          <LuUsers size={22} />
          <h2 className="font-semibold text-lg">
            Student List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="p-6">Name</th>
                <th>Email</th>
                <th>Institution</th>
                <th>Status</th>
                <th className="text-right pr-8">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.map(student => (

                <tr key={student._id} className="border-b hover:bg-gray-50">

                  <td className="p-6 font-semibold">
                    {student.name}
                  </td>

                  <td className="text-gray-600">
                    {student.email}
                  </td>

                  <td className="text-gray-600">
                    {student.institution}
                  </td>

                  <td>
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700">
                      Active
                    </span>
                  </td>

                  <td className="text-right pr-8 space-x-2">

                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    >
                      <LuEye size={18} />
                    </button>

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


      {/* Modal */}
      {selectedStudent && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[500px] rounded-3xl p-8 shadow-xl">

            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">
                Student Details
              </h2>

              <button onClick={() => setSelectedStudent(null)}>
                <LuX size={22} />
              </button>
            </div>

            <div className="space-y-4 text-gray-700">

              <div>
                <span className="font-semibold">Name:</span>
                {" "}
                {selectedStudent.name}
              </div>

              <div>
                <span className="font-semibold">Email:</span>
                {" "}
                {selectedStudent.email}
              </div>

              <div>
                <span className="font-semibold">Institution:</span>
                {" "}
                {selectedStudent.institution}
              </div>

              <div>
                <span className="font-semibold">Class:</span>
                {" "}
                {selectedStudent.userClass}
              </div>

              <div>
                <span className="font-semibold">Location:</span>
                {" "}
                {selectedStudent.location}
              </div>

            </div>

            <button
              onClick={() => setSelectedStudent(null)}
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