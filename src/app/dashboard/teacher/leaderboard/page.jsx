"use client"
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const LeaderboardChart = ({ data }) => {
  const chartData = data.slice(0, 10).map(item => ({
    name: item.studentName.split(' ')[0], 
    marks: item.totalMarks,
  }));

  const colors = ['#6d4fc2', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        Top 10 Performers Analytics
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Bar dataKey="marks" radius={[10, 10, 0, 0]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeaderboardChart;


