import React, { useState, useEffect } from 'react';

interface Registration {
  id: number;
  owner_name: string;
  student_id: string;
  laptop_brand: string;
  serial_number: string;
  status: string;
  created_at: string;
}

interface Props {
  setPage: (page: string) => void;
}

function Dashboard({ setPage }: Props) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const res = await fetch('https://university-pc-registry-production.up.railway.app/registrations');
      const data = await res.json();
      setRegistrations(data);
      setLoading(false);
    } catch { setLoading(false); }
  };

  const total = registrations.length;
  const inside = registrations.filter(r => r.status === 'inside').length;
  const outside = registrations.filter(r => r.status === 'outside').length;
  const today = registrations.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).length;
  const recent = registrations.slice(0, 5);

  return (
    <div>
      {/* Stat cards */}
      <div style={styles.grid4}>
        <div style={styles.statCard}>
          <div style={styles.statTop}>
            <div style={styles.statLabel}>Total computers</div>
            <div style={{...styles.statIcon, background: '#dbeafe'}}>💻</div>
          </div>
          <div style={styles.statValue}>{total}</div>
          <div style={styles.statSub}>All registered laptops</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTop}>
            <div style={styles.statLabel}>Inside campus</div>
            <div style={{...styles.statIcon, background: '#dcfce7'}}>✓</div>
          </div>
          <div style={{...styles.statValue, color: '#16a34a'}}>{inside}</div>
          <div style={styles.statSub}>Currently on campus</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTop}>
            <div style={styles.statLabel}>Outside campus</div>
            <div style={{...styles.statIcon, background: '#fef9c3'}}>↗</div>
          </div>
          <div style={{...styles.statValue, color: '#ca8a04'}}>{outside}</div>
          <div style={styles.statSub}>Left the campus</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTop}>
            <div style={styles.statLabel}>Registered today</div>
            <div style={{...styles.statIcon, background: '#fce7f3'}}>★</div>
          </div>
          <div style={{...styles.statValue, color: '#db2777'}}>{today}</div>
          <div style={styles.statSub}>New entries today</div>
        </div>
      </div>

      {/* Recent activity + Quick actions */}
      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <div style={styles.cardTitle}>Recent activity</div>
              <div style={styles.cardSub}>Latest laptop registrations</div>
            </div>
            <div style={styles.viewAll} onClick={() => setPage('all')}>View all →</div>
          </div>
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student</th>
                  <th style={styles.th}>Brand</th>
                  <th style={styles.th}>Serial</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(reg => (
                  <tr key={reg.id}>
                    <td style={styles.td}>
                      <div style={styles.studentName}>{reg.owner_name}</div>
                      <div style={styles.studentId}>{reg.student_id}</div>
                    </td>
                    <td style={styles.td}>{reg.laptop_brand}</td>
                    <td style={{...styles.td, fontFamily: 'monospace', fontSize: '11px', color: '#64748b'}}>{reg.serial_number}</td>
                    <td style={styles.td}>
                      <span style={reg.status === 'inside' ? styles.badgeGreen : styles.badgeAmber}>
                        {reg.status === 'inside' ? 'Inside' : 'Outside'}
                      </span>
                    </td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr><td colSpan={4} style={{...styles.td, textAlign: 'center', color: '#94a3b8'}}>No registrations yet</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>Quick actions</div>
            </div>
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: '➕', label: 'Register new PC', sub: 'Add a laptop to the system', page: 'register', bg: '#dbeafe', color: '#1e40af' },
                { icon: '🔍', label: 'Search laptop', sub: 'Find by serial or student ID', page: 'search', bg: '#dcfce7', color: '#15803d' },
                { icon: '📋', label: 'All records', sub: 'View and manage all computers', page: 'all', bg: '#fef9c3', color: '#a16207' },
                { icon: '📊', label: 'Analytics', sub: 'View statistics and reports', page: 'stats', bg: '#fce7f3', color: '#be185d' },
              ].map(item => (
                <div key={item.page} style={styles.qBtn} onClick={() => setPage(item.page)}>
                  <div style={{...styles.qIcon, background: item.bg, color: item.color}}>{item.icon}</div>
                  <div>
                    <div style={styles.qLabel}>{item.label}</div>
                    <div style={styles.qSub}>{item.sub}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#cbd5e1' }}>›</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' },
  statCard: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' },
  statTop: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' },
  statLabel: { fontSize: '12px', color: '#64748b', fontWeight: '500' },
  statIcon: { width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' },
  statValue: { fontSize: '26px', fontWeight: '600', color: '#0f172a', lineHeight: '1' },
  statSub: { fontSize: '11px', color: '#94a3b8', marginTop: '4px' },
  card: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' },
  cardHeader: { padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: '13px', fontWeight: '600', color: '#0f172a' },
  cardSub: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' },
  viewAll: { fontSize: '12px', color: '#1e40af', cursor: 'pointer' },
  loading: { padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { fontSize: '11px', fontWeight: '500', color: '#64748b', textAlign: 'left', padding: '8px 16px', borderBottom: '1px solid #f1f5f9' },
  td: { fontSize: '12px', color: '#0f172a', padding: '10px 16px', borderBottom: '1px solid #f8fafc' },
  studentName: { fontWeight: '500', fontSize: '12px' },
  studentId: { fontSize: '10px', color: '#94a3b8' },
  badgeGreen: { background: '#dcfce7', color: '#15803d', fontSize: '10px', fontWeight: '500', padding: '2px 8px', borderRadius: '10px' },
  badgeAmber: { background: '#fef9c3', color: '#a16207', fontSize: '10px', fontWeight: '500', padding: '2px 8px', borderRadius: '10px' },
  qBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f1f5f9', cursor: 'pointer', background: '#f8fafc' },
  qIcon: { width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 },
  qLabel: { fontSize: '12px', fontWeight: '500', color: '#0f172a' },
  qSub: { fontSize: '10px', color: '#94a3b8' },
};

export default Dashboard;
