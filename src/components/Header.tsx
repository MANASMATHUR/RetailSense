import { ShieldCheck } from 'lucide-react';

export default function Header() {
    return (
        <header style={{
            padding: '1.5rem 0',
            borderBottom: '1px solid var(--border)',
            background: 'white'
        }}>
            <div className="container flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--accent)',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h3l3-9 6 18 3-9h3" /></svg>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>RetailSense</h3>
                        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Voice-Driven Policy Intelligence</p>
                    </div>
                </div>

                <div className="badge">
                    <ShieldCheck size={16} className="text-primary" />
                    <span>Autonomous Web Agent</span>
                </div>
            </div>
        </header>
    );
}
