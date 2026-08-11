import React, { useState, useEffect } from 'react';
import API_BASE from '../api';

interface Registration {
  id: number;
  owner_name: string;
  student_id: string;
  laptop_brand: string;
  serial_number: string;
  status: string;
  created_at: string;
}

interface BrandCount {
  brand: string;
  count: number;
}

function Stats() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await fetch(`${API_BASE}/registrations`);
      const data: Registration[] = await res.json();
      setRegistrations(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const total = registrations.length;
  const inside = registrations.filter(r => r.status === 'inside').length;
  const outside = registrations.filter(r => r.status === 'outside').length;
  const today = registrations.filter(r => {
    const date = new Date(r.created_at).toDateString();
    return date === new Date().toDateString();
  }).length;

  // Count by brand
  const brandCounts: BrandCount[] = Object.entries(
    registrations.reduce((acc: { [key: string]: number }, r) => {
      acc[r.laptop_brand] = (acc[r.laptop_brand] || 0) + 1;
      return acc;
    }, {})
  ).map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => b.count - a.count);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-900 text-white rounded-2xl p-6 text-center">
          <div className="text-5xl font-bold mb-2">{total}</div>
          <div className="text-blue-200">Total Registrations</div>
        </div>
        <div className="bg-green-600 text-white rounded-2xl p-6 text-center">
          <div className="text-5xl font-bold mb-2">{inside}</div>
          <div className="text-green-100">Currently Inside</div>
        </div>
        <div className="bg-red-600 text-white rounded-2xl p-6 text-center">
          <div className="text-5xl font-bold mb-2">{outside}</div>
          <div className="text-red-100">Currently Outside</div>
        </div>
        <div className="bg-yellow-500 text-white rounded-2xl p-6 text-center">
          <div className="text-5xl font-bold mb-2">{today}</div>
          <div className="text-yellow-100">Registered Today</div>
        </div>
      </div>

      {/* Brand Breakdown */}
      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">💻 Laptops by Brand</h2>
        {brandCounts.length === 0 && (
          <p className="text-gray-500 text-center py-4">No data yet.</p>
        )}
        <div className="space-y-4">
          {brandCounts.map(({ brand, count }) => (
            <div key={brand}>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">{brand}</span>
                <span className="font-bold text-blue-900">{count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4">
                <div
                  className="bg-blue-900 h-4 rounded-full transition-all"
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inside vs Outside */}
      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">📊 Inside vs Outside</h2>
        <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden">
          <div className="flex h-8">
            <div
              className="bg-green-600 h-8 flex items-center justify-center text-white text-sm font-bold transition-all"
              style={{ width: total > 0 ? `${(inside / total) * 100}%` : '0%' }}
            >
              {total > 0 ? `${Math.round((inside / total) * 100)}%` : ''}
            </div>
            <div
              className="bg-red-600 h-8 flex items-center justify-center text-white text-sm font-bold transition-all"
              style={{ width: total > 0 ? `${(outside / total) * 100}%` : '0%' }}
            >
              {total > 0 ? `${Math.round((outside / total) * 100)}%` : ''}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            <span>Inside ({inside})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            <span>Outside ({outside})</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Stats;