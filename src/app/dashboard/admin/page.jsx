"use client";

import {
  LuUsers,
  LuUserCheck,
  LuSchool,
  LuFileText
} from "react-icons/lu";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";

export default function AdminDashboard() {

  const stats = [
    {
      label: "Students",
      value: "120",
      icon: <LuUsers />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      label: "Teachers",
      value: "15",
      icon: <LuUserCheck />,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      label: "Institutions",
      value: "5",
      icon: <LuSchool />,
      color: "bg-amber-100 text-amber-600"
    },
    {
      label: "Exams",
      value: "32",
      icon: <LuFileText />,
      color: "bg-indigo-100 text-indigo-600"
    },
  ];


  /* Line Chart Data */

  const growthData = [
    { month: "Jan", students: 10 },
    { month: "Feb", students: 20 },
    { month: "Mar", students: 35 },
    { month: "Apr", students: 40 },
    { month: "May", students: 55 },
    { month: "Jun", students: 70 },
    { month: "Jul", students: 95 },
    { month: "Aug", students: 120 },
  ];


  /* Pie Chart Data */

  const distributionData = [
    { name: "Students", value: 120 },
    { name: "Teachers", value: 15 },
    { name: "Institutions", value: 5 },
    { name: "Exams", value: 32 },
  ];

  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#6366f1"
  ];


  return (

    <div className="space-y-8 max-w-[1400px] mx-auto pb-10">


      {/* Header */}

      <div className="bg-white p-8 rounded-3xl border shadow-sm">

        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          System Overview
        </p>

      </div>



      {/* Charts Section */}

      <div className="grid lg:grid-cols-3 gap-6">


        {/* Line Chart */}

        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border shadow-sm">

          <h3 className="mb-4 font-semibold text-gray-700">
            Students Growth
          </h3>

          <div className="h-64">

            <ResponsiveContainer>

              <LineChart data={growthData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>



        {/* Pie Chart */}

        <div className="bg-white p-6 rounded-3xl border shadow-sm">

          <h3 className="mb-4 font-semibold text-gray-700">
            Distribution
          </h3>

          <div className="h-64">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={distributionData}
                  dataKey="value"
                  outerRadius={90}
                  label
                >

                  {distributionData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={colors[index]}
                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>



      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map(stat => (

          <div
            key={stat.label}
            className="bg-white p-6 rounded-3xl border shadow-sm flex justify-between items-center hover:shadow-md transition"
          >

            <div>

              <p className="text-gray-500 text-sm">
                {stat.label}
              </p>

              <h2 className="text-3xl font-bold mt-2 text-gray-800">
                {stat.value}
              </h2>

            </div>


            <div className={`text-3xl p-3 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>

          </div>

        ))}

      </div>



      {/* Activity */}

      <div className="bg-white p-6 rounded-3xl border shadow-sm">

        <h3 className="mb-4 font-semibold text-gray-700">
          Recent Activity
        </h3>

        <div className="space-y-3 text-gray-600">

          <div className="bg-gray-50 p-4 rounded-xl">
            New student registered
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            Teacher added
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            Exam created
          </div>

        </div>

      </div>

    </div>
  );
}