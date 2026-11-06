import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Shared navbar rendered on all public marketing pages:
 * /, /about, /contact, /pricing, /resources
 *
 * Links: How It Works · For Employers · Pricing · Resources
 * CTAs:  Log In / Dashboard  +  Get Referred Free / My Profile
 */
const PublicNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const navLinks = [
    { label: 'How It Works', path: '/about' },
    { label: 'For Employers', path: '/contact' },
    { label: 'Pricing',       path: '/pricing' },
    { label: 'Resources',     path: '/resources' },
  ];

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 64px',
        height: 72,
        borderBottom: '1px solid #eee',
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ width: 14, height: 2, background: '#fff', borderRadius: 1 }} />
            <div style={{ width: 10, height: 2, background: '#fff', borderRadius: 1 }} />
            <div style={{ width: 7,  height: 2, background: '#fff', borderRadius: 1 }} />
          </div>
        </div>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>RefNet</span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 32 }}>
        {navLinks.map(link => (
          <span
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{ fontSize: 14, fontWeight: 500, color: '#444', cursor: 'pointer' }}
          >
            {link.label}
          </span>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: 12 }}>
        {isAuthenticated ? (
          <>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '8px 20px', borderRadius: 10,
                border: '1.5px solid #e2e8f0', background: '#fff',
                fontWeight: 600, cursor: 'pointer', fontSize: 14,
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/profile')}
              style={{
                padding: '8px 20px', borderRadius: 10,
                border: 'none', background: '#2563eb', color: '#fff',
                fontWeight: 600, cursor: 'pointer', fontSize: 14,
              }}
            >
              My Profile
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '8px 20px', borderRadius: 10,
                border: '1.5px solid #e2e8f0', background: '#fff',
                fontWeight: 600, cursor: 'pointer', fontSize: 14,
              }}
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup')}
              style={{
                padding: '8px 20px', borderRadius: 10,
                border: 'none', background: '#2563eb', color: '#fff',
                fontWeight: 600, cursor: 'pointer', fontSize: 14,
              }}
            >
              Get Referred Free
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
