import React, { useState } from 'react';

interface FormData {
  owner_name: string;
  student_id: string;
  laptop_brand: string;
  serial_number: string;
}

interface Receipt {
  id: number;
  owner_name: string;
  student_id: string;
  laptop_brand: string;
  serial_number: string;
  created_at: string;
}

function Register() {
  const [form, setForm] = useState<FormData>({
    owner_name: '',
    student_id: '',
    laptop_brand: '',
    serial_number: '',
  });
  const [message, setMessage] = useState<string>('');
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const handleSubmit = async () => {
    if (!form.owner_name || !form.student_id || !form.laptop_brand || !form.serial_number) {
      setMessage('❌ Please fill all fields!');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Laptop registered successfully!');
        setReceipt({
          id: data.id,
          owner_name: form.owner_name,
          student_id: form.student_id,
          laptop_brand: form.laptop_brand,
          serial_number: form.serial_number,
          created_at: new Date().toLocaleString(),
        });
        setForm({ owner_name: '', student_id: '', laptop_brand: '', serial_number: '' });
      }
    } catch (err) {
      setMessage('❌ Error connecting to server!');
    }
  };

  return (
    <div className="space-y-6">

      {/* Form Card */}
      <div className="no-print bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-1">📝 Register Laptop</h2>
        <p className="text-gray-500 mb-6">Fill in the details when entering campus</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Full Name</label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Fatima Ahmed"
              value={form.owner_name}
              onChange={e => setForm({ ...form, owner_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. UGR/12345/15"
              value={form.student_id}
              onChange={e => setForm({ ...form, student_id: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Laptop Brand</label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Dell, HP, Lenovo"
              value={form.laptop_brand}
              onChange={e => setForm({ ...form, laptop_brand: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. ABC123XYZ"
              value={form.serial_number}
              onChange={e => setForm({ ...form, serial_number: e.target.value })}
            />
          </div>
        </div>

        <button
          className="w-full mt-6 bg-blue-900 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition"
          onClick={handleSubmit}
        >
          Register Laptop
        </button>

        {message && (
          <p className="text-center mt-4 font-medium text-green-600">{message}</p>
        )}
      </div>

      {/* Receipt */}
      {receipt && (
        <div className="bg-white rounded-2xl shadow p-8 border-2 border-dashed border-blue-900">
          <div className="text-center border-b-2 border-blue-900 pb-4 mb-6">
            <div className="text-4xl mb-2">🎓</div>
            <h2 className="text-2xl font-bold text-blue-900">University PC Registry</h2>
            <p className="text-gray-500">Registration Receipt</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-semibold text-blue-900">Registration ID</span>
              <span>#{receipt.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-semibold text-blue-900">Owner Name</span>
              <span>{receipt.owner_name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-semibold text-blue-900">Student ID</span>
              <span>{receipt.student_id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-semibold text-blue-900">Laptop Brand</span>
              <span>{receipt.laptop_brand}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-semibold text-blue-900">Serial Number</span>
              <span>{receipt.serial_number}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-semibold text-blue-900">Date & Time</span>
              <span>{receipt.created_at}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-semibold text-blue-900">Status</span>
              <span className="text-green-600 font-bold">🟢 Inside Campus</span>
            </div>
          </div>

          <button
            className="no-print w-full mt-6 bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
            onClick={() => window.print()}
          >
            🖨️ Print Receipt
          </button>
        </div>
      )}
    </div>
  );
}

export default Register;