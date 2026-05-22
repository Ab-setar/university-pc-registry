import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Registration {
  id: number;
  owner_name: string;
  student_id: string;
  laptop_brand: string;
  serial_number: string;
  status: string;
  created_at: string;
}

function AllRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filtered, setFiltered] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(registrations);
    } else {
      setFiltered(
        registrations.filter(r =>
          r.owner_name.toLowerCase().includes(search.toLowerCase()) ||
          r.serial_number.toLowerCase().includes(search.toLowerCase()) ||
          r.student_id.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, registrations]);

  const fetchAll = async () => {
    try {
      const res = await fetch('http://localhost:3001/registrations');
      const data: Registration[] = await res.json();
      setRegistrations(data);
      setFiltered(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await fetch(`http://localhost:3001/delete/${id}`, {
        method: 'DELETE',
      });
      setMessage('✅ Record deleted successfully!');
      fetchAll();
    } catch (err) {
      setMessage('❌ Error deleting record!');
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(26, 35, 126);
    doc.text('University PC Registry', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Campus Laptop Management System', 105, 28, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 35, { align: 'center' });

    // Summary
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Total: ${registrations.length}  |  Inside: ${registrations.filter(r => r.status === 'inside').length}  |  Outside: ${registrations.filter(r => r.status === 'outside').length}`, 105, 45, { align: 'center' });

    // Table
    autoTable(doc, {
      startY: 55,
      head: [['#', 'Owner Name', 'Student ID', 'Brand', 'Serial Number', 'Status', 'Date']],
      body: filtered.map(reg => [
        reg.id,
        reg.owner_name,
        reg.student_id,
        reg.laptop_brand,
        reg.serial_number,
        reg.status === 'inside' ? 'Inside' : 'Outside',
        new Date(reg.created_at).toLocaleDateString(),
      ]),
      headStyles: { fillColor: [26, 35, 126] },
      alternateRowStyles: { fillColor: [240, 242, 245] },
      styles: { fontSize: 9 },
    });

    doc.save('university-pc-registry.pdf');
  };

  return (
    <div className="bg-white rounded-2xl shadow p-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-1">📋 All Registrations</h2>
      <p className="text-gray-500 mb-6">All laptops registered on campus</p>

      {/* Search and Export */}
      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="🔍 Search by name, student ID or serial number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          onClick={handleExportPDF}
        >
          📄 Export PDF
        </button>
      </div>

      {message && (
        <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-6 font-medium">
          {message}
        </div>
      )}

      {loading && (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-10 text-gray-500">No laptops found.</div>
      )}

      <div className="space-y-4">
        {filtered.map(reg => (
          <div key={reg.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-blue-900">{reg.owner_name}</h3>
                <p className="text-gray-500 text-sm">🎓 {reg.student_id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${reg.status === 'inside' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {reg.status === 'inside' ? '🟢 Inside' : '🔴 Outside'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
              <div><span className="font-medium">💻 Brand:</span> {reg.laptop_brand}</div>
              <div><span className="font-medium">🔢 Serial:</span> {reg.serial_number}</div>
              <div className="col-span-2"><span className="font-medium">📅 Date:</span> {new Date(reg.created_at).toLocaleString()}</div>
            </div>

            <button
              className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
              onClick={() => handleDelete(reg.id)}
            >
              🗑️ Delete Record
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllRegistrations;