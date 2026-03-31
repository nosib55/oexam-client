"use client";

import React, { useState, useEffect } from "react";
import {
  LuSchool,
  LuEye,
  LuTrash2,
  LuX
} from "react-icons/lu";

export default function InstitutionsPage() {

  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    const res = await fetch("/api/admin/institutions");
    const data = await res.json();
    setInstitutions(data);
  };


  return (

    <div className="max-w-[1400px] mx-auto space-y-8 pb-10">


      {/* Header */}

      <div className="bg-white p-8 rounded-3xl border shadow-sm">

        <h1 className="text-3xl font-bold text-gray-800">
          Institution Management
        </h1>

        <p className="text-gray-500 mt-2">
          Manage registered schools
        </p>

      </div>



      {/* Table */}

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

        <div className="p-8 border-b flex items-center gap-3">

          <LuSchool size={22} />

          <h2 className="font-semibold text-lg">
            Institution List
          </h2>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="text-left text-sm text-gray-500 border-b">

                <th className="p-6">
                  Institution Name
                </th>

                <th>
                  Location
                </th>

                <th>
                  Teachers
                </th>

                <th>
                  Students
                </th>

                <th className="text-right pr-8">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {institutions.map((school) => (

                <tr
                  key={school.name}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="p-6 font-semibold">
                    {school.name}
                  </td>


                  <td className="text-gray-600">
                    {school.location}
                  </td>


                  <td className="text-gray-600 font-medium">
                    {school.teachers}
                  </td>


                  <td className="text-gray-600 font-medium">
                    {school.students}
                  </td>


                  <td className="text-right pr-8 space-x-2">


                    {/* View */}

                    <button
                      onClick={() => setSelectedInstitution(school)}
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



      {/* Institution Details Modal */}

      {selectedInstitution && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


          <div className="bg-white w-[500px] rounded-3xl p-8 shadow-xl">


            {/* Header */}

            <div className="flex justify-between mb-6">

              <h2 className="text-xl font-bold">
                Institution Details
              </h2>

              <button
                onClick={() => setSelectedInstitution(null)}
              >
                <LuX size={22} />
              </button>

            </div>



            {/* Details */}

            <div className="space-y-4 text-gray-700">

              <div>
                <span className="font-semibold">
                  Name:
                </span>
                {" "}
                {selectedInstitution.name}
              </div>


              <div>
                <span className="font-semibold">
                  Location:
                </span>
                {" "}
                {selectedInstitution.location}
              </div>


              <div>
                <span className="font-semibold">
                  Address:
                </span>
                {" "}
                {selectedInstitution.address}
              </div>


              <div>
                <span className="font-semibold">
                  Phone:
                </span>
                {" "}
                {selectedInstitution.phone}
              </div>


              <div>
                <span className="font-semibold">
                  Teachers:
                </span>
                {" "}
                {selectedInstitution.teachers}
              </div>


              <div>
                <span className="font-semibold">
                  Students:
                </span>
                {" "}
                {selectedInstitution.students}
              </div>

            </div>



            <button
              onClick={() => setSelectedInstitution(null)}
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