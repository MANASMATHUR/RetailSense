export class SpeechService {
    private static instance: SpeechService;
    private synth: SpeechSynthesis | null = null;
    private voices: SpeechSynthesisVoice[] = [];

    private constructor() {
        if (typeof window !== 'undefined') {
            this.synth = window.speechSynthesis;
            // Load voices immediately
            this.loadVoices();
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = this.loadVoices.bind(this);
            }
        }
    }

    public static getInstance(): SpeechService {
        if (!SpeechService.instance) {
            SpeechService.instance = new SpeechService();
        }
        return SpeechService.instance;
    }

    private loadVoices() {
        if (this.synth) {
            this.voices = this.synth.getVoices();
        }
    }

    public speak(text: string, onEnd?: () => void) {
        if (!this.synth) return;

        // Stop any current speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Find Aussie Male voice
        // Common Aussie voice names: "Russell", "James" (en-AU), "Microsoft James Online (Natural) - English (Australia)"
        const aussieMaleVoice = this.voices.find(voice =>
            voice.lang === 'en-AU' &&
            (voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('james') || voice.name.toLowerCase().includes('russell'))
        ) || this.voices.find(voice => voice.lang === 'en-AU'); // Fallback to any Aussie voice

        if (aussieMaleVoice) {
            utterance.voice = aussieMaleVoice;
        }

        utterance.pitch = 0.9; // Slightly lower pitch for a male-ish feel
        utterance.rate = 1.0;

        if (onEnd) {
            utterance.onend = onEnd;
        }

        this.synth.speak(utterance);
    }

    public stop() {
        if (this.synth) {
            this.synth.cancel();
        }
    }
}
