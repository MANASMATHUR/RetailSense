import { CheckCircle2, XCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface Result {
    answer: string;
    reason: string;
    exceptions: string[];
    sources: string[];
    confidence_score: number;
    policy_clarity: string;
}

export default function ResultCard({ result }: { result: Result }) {
    const isYes = result.answer.toLowerCase() === 'yes';

    return (
        <div className="card flex flex-col gap-6" style={{ borderLeft: `6px solid ${isYes ? '#10b981' : '#ef4444'}` }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {isYes ? (
                        <CheckCircle2 size={32} style={{ color: '#10b981' }} />
                    ) : (
                        <XCircle size={32} style={{ color: '#ef4444' }} />
                    )}
                    <h2 style={{ fontSize: '2rem' }}>{isYes ? 'Yes, Approved' : 'No, Not Eligible'}</h2>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        <ShieldCheck size={16} />
                        <span>{(result.confidence_score * 100).toFixed(0)}% Confidence</span>
                    </div>
                    <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Verified Today</span>
                </div>
            </div>

            <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Reasoning</h4>
                <p style={{ fontSize: '1.125rem' }}>{result.reason}</p>
            </div>

            {result.exceptions.length > 0 && (
                <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Policy Notes & Exceptions</h4>
                    <ul className="flex flex-col gap-2">
                        {result.exceptions.map((exc, i) => (
                            <li key={i} className="flex items-start gap-2 text-secondary" style={{ fontSize: '0.875rem' }}>
                                <div style={{ minWidth: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', marginTop: '0.4rem' }}></div>
                                {exc}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Sources (Direct Policy Links)</h4>
                <div className="flex flex-wrap gap-3">
                    {result.sources.map((source, i) => (
                        <a
                            key={i}
                            href={source}
                            target="_blank"
                            className="flex items-center gap-2"
                            style={{
                                padding: '0.5rem 0.75rem',
                                background: 'white',
                                border: '1px solid var(--border)',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                color: 'var(--foreground)'
                            }}
                        >
                            <ExternalLink size={14} className="text-primary" />
                            <span>{new URL(source).hostname}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
