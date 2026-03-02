"use client";

import {
  LuTriangleAlert,
  LuBug,
  LuUser,
  LuCheck,
  LuClock
} from "react-icons/lu";

export default function ComplaintsPage() {

  /* Complaints Data */

  const complaints = [
    {
      id: 1,
      user: "Rahim Uddin",
      role: "Teacher",
      type: "Bug",
      message: "Student list not loading properly",
      status: "Pending",
      date: "2 Mar 2026"
    },
    {
      id: 2,
      user: "Karim Hasan",
      role: "Student",
      type: "Issue",
      message: "Unable to submit exam",
      status: "Resolved",
      date: "1 Mar 2026"
    },
    {
      id: 3,
      user: "Nusrat Jahan",
      role: "Teacher",
      type: "Bug",
      message: "Attendance save error",
      status: "In Progress",
      date: "28 Feb 2026"
    }
  ];


  /* System Status */

  const systemStatus = [
    { name: "Server", status: "Running" },
    { name: "Database", status: "Running" },
    { name: "API", status: "Running" },
    { name: "Authentication", status: "Running" }
  ];


  return (

    <div className="space-y-8 max-w-[1400px] mx-auto pb-10">


      {/* Header */}

      <div className="bg-white p-8 rounded-3xl border shadow-sm">

        <h1 className="text-3xl font-bold text-gray-800">
          Complaints & System Status
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor bugs, issues and system health
        </p>

      </div>



      {/* System Status */}

      <div className="bg-white p-6 rounded-3xl border shadow-sm">

        <div className="flex items-center gap-3 mb-6">

          <LuCheck size={22}/>

          <h3 className="text-xl font-semibold text-gray-800">
            System Status
          </h3>

        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

          {systemStatus.map((item,index)=>(

            <div
              key={index}
              className="bg-gray-50 border p-5 rounded-2xl flex justify-between"
            >

              <span className="font-medium text-gray-700">
                {item.name}
              </span>

              <span className="text-green-600 font-semibold">
                {item.status}
              </span>

            </div>

          ))}

        </div>

      </div>



      {/* Complaints Table */}

      <div className="bg-white p-6 rounded-3xl border shadow-sm">

        <div className="flex items-center gap-3 mb-6">

          <LuTriangleAlert size={22}/>

          <h3 className="text-xl font-semibold text-gray-800">
            Complaints & Bugs
          </h3>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b text-gray-600 text-sm">

                <th className="text-left py-3">User</th>
                <th className="text-left py-3">Role</th>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">Message</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Date</th>

              </tr>

            </thead>


            <tbody>

              {complaints.map((c)=>(
                
                <tr
                  key={c.id}
                  className="border-b hover:bg-gray-50"
                >

                  {/* User */}

                  <td className="py-4 flex items-center gap-2">

                    <LuUser/>

                    {c.user}

                  </td>



                  {/* Role */}

                  <td className="py-4">

                    <span className={`px-3 py-1 rounded-lg text-sm

                    ${
                      c.role==="Teacher"
                      ? "bg-blue-100 text-blue-700"
                      :"bg-purple-100 text-purple-700"
                    }`}>

                      {c.role}

                    </span>

                  </td>



                  {/* Type */}

                  <td className="py-4 flex items-center gap-2">

                    {c.type==="Bug"
                    ?<LuBug/>
                    :<LuTriangleAlert/>
                    }

                    {c.type}

                  </td>



                  {/* Message */}

                  <td className="py-4 text-gray-600">
                    {c.message}
                  </td>



                  {/* Status */}

                  <td className="py-4">

                    <span className={`px-3 py-1 rounded-lg text-sm font-medium

                    ${
                      c.status==="Resolved"
                      ?"bg-green-100 text-green-700":

                      c.status==="Pending"
                      ?"bg-red-100 text-red-700":

                      "bg-yellow-100 text-yellow-700"
                    }`}>

                      {c.status}

                    </span>

                  </td>



                  {/* Date */}

                  <td className="py-4 text-gray-500 flex items-center gap-2">

                    <LuClock/>

                    {c.date}

                  </td>


                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


    </div>
  );
}