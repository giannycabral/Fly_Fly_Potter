// Gerenciamento de áudio e efeitos sonoros
class AudioManager {
    constructor() {
        this.isSoundOn = true;
        this.sfx = {
            flap: new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.01, release: 0.1 } }).toDestination(),
            score: new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 } }).toDestination(),
            hit: new Tone.MembraneSynth({ pitchDecay: 0.1, octaves: 6, oscillator: { type: 'sine' }, envelope: { attack: 0.001, decay: 0.5, sustain: 0.01, release: 1.4, attackCurve: 'exponential' } }).toDestination(),
            powerup: new Tone.Synth({ oscillator: { type: 'pwm', modulationFrequency: 0.2 }, envelope: { attack: 0.05, decay: 0.3, sustain: 0.2, release: 0.4 } }).toDestination(),
            dementor: new Tone.FMSynth({ harmonicity: 1.5, modulationIndex: 10, envelope: { attack: 2, decay: 1, release: 4 }, modulationEnvelope: { attack: 2, release: 4 } }).toDestination(),
            bean: new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.05, release: 0.1 } }).toDestination(),
            badBean: new Tone.Synth({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 }, volume: -10 }).toDestination(),
            patronus: new Tone.PolySynth(Tone.Synth, { oscillator: { type: "fatsawtooth", count: 3, spread: 30 }, envelope: { attack: 0.01, decay: 1.5, sustain: 0.5, release: 1.5, attackCurve: "exponential" } }).toDestination(),
            fail: new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.1, decay: 0.5, sustain: 0, release: 0.1 } }).toDestination(),
            lifeUp: new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.4 } }).toDestination()
        };
    }
    
    playSfx(sound, ...args) {
        if (this.isSoundOn) {
            if (sound.triggerAttackRelease) {
                sound.triggerAttackRelease(...args);
            }
        }
    }
    
    toggleSound() {
        this.isSoundOn = !this.isSoundOn;
        return this.isSoundOn;
    }
    
    isSoundOn() {
        return this.isSoundOn;
    }
    
    async init() {
        try {
            // Verificar se o contexto já está em execução
            if (Tone.context.state !== 'running') {
                console.log("Iniciando AudioContext após interação do usuário...");
                await Tone.start();
                console.log("AudioContext iniciado com sucesso!");
            }
            return true;
        } catch (error) {
            console.warn("Não foi possível iniciar o AudioContext:", error);
            return false;
        }
    }
}

// Exporta como singleton
const audioManager = new AudioManager();
