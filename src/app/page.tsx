'use client';

import Header from '@/components/Header';
import DynamicText from '@/components/DynamicText';
import VoiceRecorder from '@/components/VoiceRecorder';
import BrowserPreview from '@/components/BrowserPreview';
import ResultCard from '@/components/ResultCard';
import { ChevronDown, Sparkles, Eye, Shield, Zap, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SpeechService } from '@/utils/SpeechService';

export default function Home() {
  const [activities, setActivities] = useState<string[]>([]);
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTranscript = async (text: string) => {
    setTranscript(text);
    setIsAnalyzing(true);
    setResult(null);
    setActivities([]);
    setIsSpeaking(false);
    SpeechService.getInstance().stop();

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      // Simulate live activity streaming
      if (data.activities) {
        for (const activity of data.activities) {
          setActivities(prev => [...prev, activity]);
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      setResult(data.result);

      // Conversational Auto-Reply with Aussie Accent
      if (data.result.conversational_reply) {
        setIsSpeaking(true);
        SpeechService.getInstance().speak(data.result.conversational_reply, () => {
          setIsSpeaking(false);
        });
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section className="py-20 text-center container">
        <h1>Instant Answers to <DynamicText /> Policy Questions</h1>
        <p className="text-secondary mt-8" style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '2rem auto' }}>
          Ask about returns, exchanges, or eligibility—our autonomous web agent navigates retailer sites in real-time to find accurate, verified answers.
        </p>
        <p style={{ color: 'var(--primary)', fontWeight: 600 }}>No outdated databases. Live policy verification.</p>
      </section>

      {/* Main Interaction Area */}
      <section className="container mb-20">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
          <div className="flex flex-col gap-8">
            <VoiceRecorder onTranscript={handleTranscript} isSpeaking={isSpeaking} />

            {transcript && (
              <div className="card">
                <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Transcription</span>
                <p style={{ fontSize: '1.125rem', fontWeight: 500, marginTop: '0.5rem' }}>"{transcript}"</p>
              </div>
            )}

            {result && <ResultCard result={result} />}

            <div className="card">
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Example Questions</h4>
              <div className="flex flex-col gap-3">
                <p
                  className="text-secondary"
                  style={{ fontSize: '0.875rem', cursor: 'pointer' }}
                  onClick={() => handleTranscript("Can I return a laptop to Best Buy after 30 days?")}
                >
                  "Can I return a laptop to Best Buy after 30 days?"
                </p>
                <p
                  className="text-secondary"
                  style={{ fontSize: '0.875rem', cursor: 'pointer' }}
                  onClick={() => handleTranscript("What's Amazon's policy on opened headphones?")}
                >
                  "What's Amazon's policy on opened headphones?"
                </p>
              </div>
            </div>
          </div>

          <BrowserPreview activities={activities} />
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20" style={{ background: '#f1f5f9' }}>
        <div className="container text-center">
          <h2 className="mb-8">Why Autonomous Web Agents?</h2>
          <p className="text-secondary mb-8" style={{ maxWidth: '800px', margin: '0 auto 4rem' }}>
            Traditional search and chatbots give you outdated or generic answers. RetailSense actively browses retailer websites to find accurate, current policy details.
          </p>

          <div className="grid">
            <FeatureCard
              icon={<Sparkles size={24} />}
              title="Autonomous Web Agent"
              desc="Unlike simple chatbots, RetailSense actively navigates retailer websites to find accurate, up-to-date policy information."
            />
            <FeatureCard
              icon={<Eye size={24} />}
              title="Full Transparency"
              desc="See exactly what the agent does — every page visited, every policy checked, every decision explained."
            />
            <FeatureCard
              icon={<Shield size={24} />}
              title="Verified Sources"
              desc="Every answer links directly to official retailer policy pages so you can verify the information yourself."
            />
            <FeatureCard
              icon={<Zap size={24} />}
              title="Real-Time Intelligence"
              desc="Policies change frequently. Our agent checks live pages, not outdated databases or cached information."
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 container">
        <div className="text-center mb-12">
          <div className="badge mb-4">
            <Info size={16} />
            <span>Frequently Asked Questions</span>
          </div>
          <h2>Everything You Need To Know</h2>
          <p className="text-secondary mt-4">Learn more about how RetailSense works and why autonomous web agents provide superior policy intelligence.</p>
        </div>

        <div className="accordion">
          <FaqItem
            question="How does RetailSense differ from a regular chatbot?"
            answer="RetailSense uses autonomous web navigation (Mino) to browse real-time retail websites instead of relying on pre-trained static data."
          />
          <FaqItem
            question="Which retailers does RetailSense support?"
            answer="RetailSense can navigate and extract policy information from most major retailers by reasoning through their website structure dynamically."
          />
          <FaqItem
            question="How accurate are the answers?"
            answer="Our agent uses source-backed reasoning, meaning every answer is derived directly from official policy documents. The accuracy is significantly higher than static LLMs."
          />
          <FaqItem
            question="What happens if a retailer's policy has changed recently?"
            answer="Since RetailSense browses the live web for every request, it captures policy changes the moment they are updated on the retailer's site."
          />
        </div>
      </section>

      <footer className="py-8 text-center text-secondary" style={{ borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.75rem' }}>RetailSense demonstrates autonomous web agent capabilities. Results shown are simulated for demonstration purposes.</p>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="card text-left flex flex-col gap-4">
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '0.5rem',
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--secondary)'
      }}>
        {icon}
      </div>
      <h4 style={{ fontWeight: 700 }}>{title}</h4>
      <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{desc}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="accordion-item">
      <button className="accordion-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <ChevronDown size={20} className={`text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div style={{ marginTop: '1rem', color: 'var(--secondary)', fontSize: '0.875rem' }}>
          {answer}
        </div>
      )}
    </div>
  );
}
