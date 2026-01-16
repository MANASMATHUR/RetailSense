import { Monitor } from 'lucide-react';

export default function BrowserPreview({ activities }: { activities: string[] }) {
    return (
        <div className="card flex flex-col gap-4" style={{ minHeight: '400px', background: '#fcfcfc', position: 'sticky', top: '2rem' }}>
            <div className="flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div className="flex items-center gap-2">
                    <Monitor size={20} className="text-secondary" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Live Agent Browser View</span>
                </div>
                <div className="flex items-center gap-1">
                    <span style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>powered by</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--foreground)' }}>Mino</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
                {activities.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {activities.map((activity, i) => (
                            <div key={i} style={{
                                padding: '0.75rem',
                                background: i === activities.length - 1 ? 'rgba(45, 212, 191, 0.1)' : 'var(--background)',
                                borderRadius: '0.5rem',
                                borderLeft: `3px solid ${i === activities.length - 1 ? 'var(--primary)' : 'var(--border)'}`,
                                transition: 'all 0.3s ease'
                            }}>
                                <div className="flex items-center gap-2">
                                    {i === activities.length - 1 && (
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1.5s infinite' }}></div>
                                    )}
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{activity}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8" style={{ background: 'white', border: '1px dashed var(--border)', borderRadius: '0.75rem' }}>
                        <Monitor size={48} className="text-border mb-4" />
                        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Browser preview will appear here during agent activity</p>
                    </div>
                )}
            </div>
        </div>
    );
}
