'use client';

import { Mic, Square } from 'lucide-react';
import { useState, useRef } from 'react';

export default function VoiceRecorder({
    onTranscript,
    isSpeaking
}: {
    onTranscript: (text: string) => void,
    isSpeaking?: boolean
}) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const formData = new FormData();
                formData.append('file', audioBlob, 'audio.webm');

                try {
                    const res = await fetch('/api/transcribe', {
                        method: 'POST',
                        body: formData,
                    });
                    const data = await res.json();
                    if (data.text) {
                        onTranscript(data.text);
                    }
                } catch (err) {
                    console.error('Transcription error:', err);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <div className="card flex flex-col items-center justify-center gap-4" style={{ height: '300px', border: isSpeaking ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
            <button
                className={`mic-button ${isRecording ? 'recording' : ''} ${isSpeaking ? 'speaking' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isSpeaking}
                style={{ background: isSpeaking ? 'var(--primary)' : 'var(--accent)' }}
            >
                {isRecording ? <Square size={32} /> : <Mic size={32} />}
            </button>
            <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    {isRecording ? 'Recording... click to stop' : isSpeaking ? 'Agent is speaking...' : 'Click to ask a question'}
                </h4>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                    {isSpeaking ? 'Listening to policy intelligence' : 'Ask about returns, exchanges, or policy eligibility'}
                </p>
            </div>
        </div>
    );
}
