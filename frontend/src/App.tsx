import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Search from './components/Search';
import AllRegistrations from './components/AllRegistrations';
import Stats from './components/Stats';
import Dashboard from './components/Dashboard';

interface User {
  role: string;
  username: string;
}

function App() {
  const [page, setPage] = useState<string>('dashboard');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: string, username: string) => {
    setUser({ role, username });
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('dashboard');
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const initials = user.username.slice(0, 2).toUpperCase();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦', section: 'main' },
    { id: 'register', label: 'Register PC', icon: '+', section: 'main', adminOnly: false },
    { id: 'search', label: 'Search', icon: '⌕', section: 'main' },
    { id: 'all', label: 'All computers', icon: '☰', section: 'admin', adminOnly: true },
    { id: 'stats', label: 'Analytics', icon: '↗', section: 'admin', adminOnly: true },
  ];

  const filteredNav = navItems.filter(item => !item.adminOnly || user.role === 'admin');

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>💻</div>
          <div>
            <div style={styles.logoTitle}>PC Registry</div>
            <div style={styles.logoSub}>Univ. of Addis Ababa</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {user.role === 'admin' && <div style={styles.navSection}>Main</div>}
          {filteredNav.filter(i => i.section === 'main').map(item => (
            <div
              key={item.id}
              style={page === item.id ? styles.navItemActive : styles.navItem}
              onClick={() => setPage(item.id)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </div>
          ))}

          {user.role === 'admin' && (
            <>
              <div style={styles.navSection}>Admin</div>
              {filteredNav.filter(i => i.section === 'admin').map(item => (
                <div
                  key={item.id}
                  style={page === item.id ? styles.navItemActive : styles.navItem}
                  onClick={() => setPage(item.id)}
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </>
          )}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userRow}>
            <div style={styles.avatar}>{initials}</div>
            <div style={{ flex: 1 }}>
              <div style={styles.userName}>{user.username}</div>
              <div style={styles.userRole}>{user.role}</div>
            </div>
            <div style={styles.logoutBtn} onClick={handleLogout}>↩</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.main}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <div style={styles.topbarLeft}>
            <span style={styles.breadcrumb}>
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </span>
          </div>
          <div style={styles.topbarRight}>
            <div style={styles.statusBadge}>
              <div style={styles.statusDot} />
              System online
            </div>
import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Search from './components/Search';
import AllRegistrations from './components/AllRegistrations';
import Stats from './components/Stats';
import Dashboard from './components/Dashboard';

interface User {
  role: string;
  username: string;
}

function App() {
  const [page, setPage] = useState<string>('dashboard');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: string, username: string) => {
    setUser({ role, username });
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('dashboard');
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const initials = user.username.slice(0, 2).toUpperCase();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦', section: 'main' },
    { id: 'register', label: 'Register PC', icon: '+', section: 'main', adminOnly: false },
    { id: 'search', label: 'Search', icon: '⌕', section: 'main' },
    { id: 'all', label: 'All computers', icon: '☰', section: 'admin', adminOnly: true },
    { id: 'stats', label: 'Analytics', icon: '↗', section: 'admin', adminOnly: true },
  ];

  const filteredNav = navItems.filter(item => !item.adminOnly || user.role === 'admin');

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>💻</div>
          <div>
            <div style={styles.logoTitle}>PC Registry</div>
            <div style={styles.logoSub}>Univ. of Addis Ababa</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {user.role === 'admin' && <div style={styles.navSection}>Main</div>}
          {filteredNav.filter(i => i.section === 'main').map(item => (
            <div
              key={item.id}
              style={page === item.id ? styles.navItemActive : styles.navItem}
              onClick={() => setPage(item.id)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </div>
          ))}

          {user.role === 'admin' && (
            <>
              <div style={styles.navSection}>Admin</div>
              {filteredNav.filter(i => i.section === 'admin').map(item => (
                <div
                  key={item.id}
                  style={page === item.id ? styles.navItemActive : styles.navItem}
                  onClick={() => setPage(item.id)}
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </>
          )}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userRow}>
            <div style={styles.avatar}>{initials}</div>
            <div style={{ flex: 1 }}>
              <div style={styles.userName}>{user.username}</div>
              <div style={styles.userRole}>{user.role}</div>
            </div>
            <div style={styles.logoutBtn} onClick={handleLogout}>↩</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.main}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <div style={styles.topbarLeft}>
            <span style={styles.breadcrumb}>
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </span>
          </div>
          <div style={styles.topbarRight}>
            <div style={styles.statusBadge}>
              <div style={styles.statusDot} />
              System online
            </div>
            <div style={styles.avatarSmall}>{initials}</div>
          </div>
        </div>

        {/* Page content */}
        <div style={styles.content}>
          {page === 'dashboard' && <Dashboard setPage={setPage} />}
          {page === 'register' && <Register />}
          {page === 'search' && <Search />}
          {page === 'all' && user.role === 'admin' && <AllRegistrations />}
          {page === 'stats' && user.role === 'admin' && <Stats />}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  app: { display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif" },
  sidebar: { width: '220px', background: '#0f172a', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  logoWrap: { padding: '18px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { width: '32px', height: '32px', background: '#1e3a5f', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },
  logoTitle: { color: '#ffffff', fontSize: '13px', fontWeight: '600' },
  logoSub: { color: '#64748b', fontSize: '10px', marginTop: '2px' },
  nav: { padding: '12px 8px', flex: 1 },
  navSection: { color: '#475569', fontSize: '10px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '6px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', marginBottom: '2px' },
  navItemActive: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '6px', color: '#60a5fa', fontSize: '12px', cursor: 'pointer', marginBottom: '2px', background: '#1e3a5f' },
  navIcon: { fontSize: '14px', width: '16px', textAlign: 'center' },
  sidebarFooter: { padding: '12px', borderTop: '1px solid #1e293b' },
  userRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar: { width: '30px', height: '30px', borderRadius: '50%', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontSize: '11px', fontWeight: '500', flexShrink: 0 },
  avatarSmall: { width: '28px', height: '28px', borderRadius: '50%', background: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: '500' },
  userName: { color: '#e2e8f0', fontSize: '12px', fontWeight: '500' },
  userRole: { color: '#64748b', fontSize: '10px' },
  logoutBtn: { color: '#64748b', cursor: 'pointer', fontSize: '16px', padding: '4px' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topbar: { background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  topbarRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  breadcrumb: { fontSize: '14px', fontWeight: '500', color: '#0f172a' },
  statusBadge: { display: 'flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', color: '#16a34a', fontWeight: '500' },
  statusDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' },
  content: { flex: 1, overflowY: 'auto', padding: '24px' },
};

export default App;
