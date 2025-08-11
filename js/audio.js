// Gerenciamento de áudio e efeitos sonoros
class AudioManager {
    constructor() {
        this.isSoundOn = true;
        
        // Criamos um volume master para poder controlar todos os sons facilmente
        this.masterVolume = new Tone.Volume(-3).toDestination();
        
        this.sfx = {
            flap: new Tone.Synth({ 
                oscillator: { type: 'triangle' }, 
                envelope: { attack: 0.005, decay: 0.1, sustain: 0.01, release: 0.1 } 
            }).connect(this.masterVolume),
            
            score: new Tone.Synth({ 
                oscillator: { type: 'sine' }, 
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 } 
            }).connect(this.masterVolume),
            
            hit: new Tone.MembraneSynth({ 
                pitchDecay: 0.1, 
                octaves: 6, 
                oscillator: { type: 'sine' }, 
                envelope: { attack: 0.001, decay: 0.5, sustain: 0.01, release: 1.4, attackCurve: 'exponential' } 
            }).connect(this.masterVolume),
            
            powerup: new Tone.Synth({ 
                oscillator: { type: 'pwm', modulationFrequency: 0.2 }, 
                envelope: { attack: 0.05, decay: 0.3, sustain: 0.2, release: 0.4 } 
            }).connect(this.masterVolume),
            
            dementor: new Tone.FMSynth({ 
                harmonicity: 1.5, 
                modulationIndex: 10, 
                envelope: { attack: 2, decay: 1, release: 4 }, 
                modulationEnvelope: { attack: 2, release: 4 } 
            }).connect(this.masterVolume),
            
            bean: new Tone.Synth({ 
                oscillator: { type: 'square' }, 
                envelope: { attack: 0.01, decay: 0.1, sustain: 0.05, release: 0.1 } 
            }).connect(this.masterVolume),
            
            badBean: new Tone.Synth({ 
                oscillator: { type: 'sawtooth' }, 
                envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 }, 
                volume: -10 
            }).connect(this.masterVolume),
            
            patronus: new Tone.PolySynth(Tone.Synth, { 
                oscillator: { type: "fatsawtooth", count: 3, spread: 30 }, 
                envelope: { attack: 0.01, decay: 1.5, sustain: 0.5, release: 1.5, attackCurve: "exponential" } 
            }).connect(this.masterVolume),
            
            fail: new Tone.Synth({ 
                oscillator: { type: 'sine' }, 
                envelope: { attack: 0.1, decay: 0.5, sustain: 0, release: 0.1 } 
            }).connect(this.masterVolume),
            
            lifeUp: new Tone.Synth({ 
                oscillator: { type: 'sine' }, 
                envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.4 } 
            }).connect(this.masterVolume)
        };
    }
    
    // Adicionamos uma propriedade para rastrear o tempo da última reprodução
    lastPlayedTime = 0;
    
    playSfx(sound, ...args) {
        if (this.isSoundOn) {
            if (sound.triggerAttackRelease) {
                const now = Tone.now();
                // Verifica se passou tempo suficiente desde a última reprodução
                if (now > this.lastPlayedTime + 0.05) { // 50ms de intervalo mínimo
                    this.lastPlayedTime = now;
                    // Substitui qualquer timestamp fornecido pelo usuário com o tempo atual
                    const newArgs = [...args];
                    if (newArgs.length > 2) {
                        newArgs[2] = now;
                    } else {
                        newArgs.push(now);
                    }
                    sound.triggerAttackRelease(...newArgs);
                }
            }
        }
    }
    
    toggleSound() {
        this.isSoundOn = !this.isSoundOn;
        
        // Se o som está desligado, mutamos o volume mestre
        if (!this.isSoundOn) {
            this.masterVolume.mute = true;
        } else {
            this.masterVolume.mute = false;
        }
        
        return this.isSoundOn;
    }
    
    isSoundOn() {
        return this.isSoundOn;
    }
    
    setMasterVolume(value) {
        // value deve estar entre -60 e 0 (dB)
        if (value < -60) value = -60;
        if (value > 0) value = 0;
        
        this.masterVolume.volume.value = value;
    }
    
    async init() {
        try {
            // Verificar se o contexto já está em execução
            if (Tone.context.state !== 'running') {
                console.log("Iniciando AudioContext após interação do usuário...");
                await Tone.start();
                console.log("AudioContext iniciado com sucesso!");
                
                // Verificando se estamos usando a nova API AudioWorkletNode
                const usingWorklet = Tone.getContext().rawContext.audioWorklet !== undefined;
                console.log(`Usando AudioWorkletNode: ${usingWorklet}`);
                
                // Defina um volume global mais baixo para evitar sons muito altos
                try {
                    const context = Tone.getContext();
                    if (context && context.volume) {
                        context.volume.value = -6; // -6dB
                    } else {
                        console.log("Volume não disponível, usando masterVolume");
                        this.masterVolume.volume.value = -6; // Alternativa usando masterVolume
                    }
                } catch (e) {
                    console.log("Não foi possível ajustar o volume:", e);
                }
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
