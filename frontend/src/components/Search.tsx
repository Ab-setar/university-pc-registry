import React, { useState } from 'react';

interface Registration {
  id: number;
  owner_name: string;
  student_id: string;
  laptop_brand: string;
  serial_number: string;
  status: string;
  created_at: string;
}

function Search() {
  const [serial, setSerial] = useState<string>('');
  const [result, setResult] = useState<Registration | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!serial) {
      setMessage('❌ Please enter a serial number!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://university-pc-registry-production.up.railway.app/search/${serial}`);
      const data = await res.json();
      if (data.found) {
        setResult(data.data);
        setMessage('');
      } else {
        setResult(null);
        setMessage('❌ No laptop found with this serial number!');
      }
    } catch (err) {
      setMessage('❌ Error connecting to server!');
    }
    setLoading(false);
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      await fetch(`https://university-pc-registry-production.up.railway.app/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (result) setResult({ ...result, status });
    } catch (err) {
      setMessage('❌ Error updating status!');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-1">🔍 Guard Check</h2>
      <p className="text-gray-500 mb-6">Search laptop by serial number when leaving campus</p>

      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          placeholder="Enter Serial Number"
          value={serial}
          onChange={e => setSerial(e.target.value)}
        />
        <button
          className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          onClick={handleSearch}
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>

      {message && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 font-medium">
          {message}
        </div>
      )}

      {result && (
        <div className="border-2 border-blue-900 rounded-xl p-6">
          <h3 className="text-xl font-bold text-green-600 mb-4">✅ Laptop Found!</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-semibold text-blue-900">👤 Owner</span>
              <span>{result.owner_name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-semibold text-blue-900">🎓 Student ID</span>
              <span>{result.student_id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-semibold text-blue-900">💻 Brand</span>
              <span>{result.laptop_brand}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-semibold text-blue-900">🔢 Serial</span>
              <span>{result.serial_number}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-semibold text-blue-900">📅 Registered</span>
              <span>{new Date(result.created_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-semibold text-blue-900">Status</span>
              <span className={`font-bold ${result.status === 'inside' ? 'text-green-600' : 'text-red-600'}`}>
                {result.status === 'inside' ? '🟢 Inside Campus' : '🔴 Outside Campus'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              onClick={() => handleStatus(result.id, 'inside')}
            >
              ✅ Mark as Inside
            </button>
            <button
              className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              onClick={() => handleStatus(result.id, 'outside')}
            >
              🚪 Mark as Outside
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;