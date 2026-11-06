import { useNavigate } from "react-router";
import "@/styles/landing.css";
import "@/styles/auth.css";
import PublicNavbar from "../components/PublicNavbar";

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
            <PublicNavbar />

            {/* Hero */}
            <section style={{ textAlign: 'center', padding: '80px 64px 60px', background: 'linear-gradient(135deg, #eef1fe 0%, #f0fdf9 60%, #f3f4f8 100%)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ede9ff', borderRadius: 20, padding: '6px 14px', marginBottom: 24 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>⚡ India's #1 Referral Network</span>
                </div>
                <h1 style={{ fontSize: 48, fontWeight: 800, color: '#111', lineHeight: 1.15, marginBottom: 20 }}>How RefNet Works</h1>
                <p style={{ fontSize: 17, color: '#666', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.6 }}>
                    We connect freshers with IT professionals at top companies for genuine, direct referrals — no middlemen, no spam.
                </p>
                <button onClick={() => navigate('/signup')} style={{ padding: '14px 32px', borderRadius: 12, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                    Get Started Free →
                </button>
            </section>

            {/* Steps */}
            <section style={{ padding: '64px 80px', background: '#fff' }}>
                <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 48, color: '#111' }}>4 Simple Steps</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
                    {[
                        { icon: '🔍', step: '1. Find a Job', desc: 'Browse thousands of openings at top IT companies like Google, Flipkart, TCS and more.', color: '#ede9ff' },
                        { icon: '🤝', step: '2. Match a Referrer', desc: 'Get matched with verified professionals who currently work at your target company.', color: '#ede9ff' },
                        { icon: '📤', step: '3. Request Referral', desc: 'Send your profile and a personalised message to request a referral with one click.', color: '#d1fae5' },
                        { icon: '📈', step: '4. Track & Get Hired', desc: 'Monitor your referral status in real-time — from Pending all the way to Offer Letter.', color: '#fef3c7' },
                    ].map(item => (
                        <div key={item.step} style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 24, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{item.icon}</div>
                            <p style={{ fontWeight: 700, fontSize: 15, color: '#111', margin: 0 }}>{item.step}</p>
                            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section style={{ padding: '48px 80px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, maxWidth: 900, margin: '0 auto', flexWrap: 'wrap' }}>
                    {[
                        { value: '12,400+', label: 'Freshers Placed' },
                        { value: '3,800+', label: 'Verified Professionals' },
                        { value: '94%', label: 'Response Rate' },
                        { value: '500+', label: 'Companies' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px 32px', minWidth: 160 }}>
                            <p style={{ fontSize: 32, fontWeight: 800, color: '#2563eb', margin: 0 }}>{s.value}</p>
                            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '64px 80px', textAlign: 'center', background: '#fff' }}>
                <h2 style={{ fontSize: 32, fontWeight: 700, color: '#111', marginBottom: 16 }}>Ready to get referred?</h2>
                <p style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>Join thousands of freshers who landed their dream jobs through RefNet.</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button onClick={() => navigate('/signup')} style={{ padding: '13px 28px', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Sign Up Free</button>
                    <button onClick={() => navigate('/login')} style={{ padding: '13px 28px', borderRadius: 10, border: '1.5px solid #ddd', background: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Log In</button>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#1a1a2e', padding: '24px 64px', textAlign: 'center', borderTop: '1px solid #2a2a3e' }}>
                <p style={{ fontSize: 12, color: '#444', margin: 0 }}>© 2025 RefNet. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AboutPage;
