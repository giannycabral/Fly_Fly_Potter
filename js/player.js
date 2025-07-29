// Classe do jogador (personagem)
class Player {
    constructor(x, y, selectedBroomKey, selectedCharacterKey) {
        this.x = x;
        this.y = y;
        this.baseWidth = 56;
        this.baseHeight = 48;
        this.width = 56;
        this.height = 48;
        this.velocity = 0;
        this.isInvincible = false;
        this.invincibilityTimer = 0;
        this.visualEffect = null;
        this.visualEffectTimer = 0;
        this.selectedBroomKey = selectedBroomKey;
        this.selectedCharacterKey = selectedCharacterKey;
    }
    
    draw(ctx, frame) {
        ctx.save();
        if (this.isInvincible) {
            ctx.fillStyle = `rgba(251, 191, 36, ${0.5 + Math.sin(frame * 0.3) * 0.2})`;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 40, 0, Math.PI * 2);
            ctx.fill();
        }

        if (this.visualEffect) {
            switch(this.visualEffect) {
                case 'rainbow': ctx.globalAlpha = 0.5 + Math.sin(frame * 0.5) * 0.5; break;
                case 'spin':
                    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                    ctx.rotate(frame * 0.2);
                    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
                    break;
            }
        }

        // Vassoura - redimensionada para ser menor
        // Calculando dimensões menores para a vassoura
        const broomWidth = this.width * 0.65; // Redução de 35% da largura
        const broomHeight = this.height * 0.12; // Redução da altura para ser mais fina
        const broomX = this.x + (this.width - broomWidth) / 2; // Centralizar
        
        // Vassoura (parte traseira - cerdas)
        ctx.fillStyle = '#FBBF24';
        ctx.fillRect(broomX - broomWidth * 0.14, this.y + this.height * 0.66, broomWidth * 0.12, broomHeight);
        
        // Vassoura (cabo)
        ctx.fillStyle = CONFIG.brooms[this.selectedBroomKey].color;
        ctx.fillRect(broomX, this.y + this.height * 0.66, broomWidth, broomHeight);
        
        if (this.selectedBroomKey === 'firebolt') {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(broomX + broomWidth * 0.75, this.y + this.height * 0.66, broomWidth * 0.08, broomHeight);
        }
        
        // Corpo
        ctx.fillStyle = '#374151';
        ctx.fillRect(this.x + this.width * 0.28, this.y + this.height * 0.16, this.width * 0.42, this.height * 0.5);
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(this.x + this.width * 0.28, this.y + this.height * 0.58, this.width * 0.42, this.height * 0.16);
        ctx.fillStyle = '#FBBF24';
        ctx.fillRect(this.x + this.width * 0.32, this.y + this.height * 0.58, this.width * 0.07, this.height * 0.16);
        ctx.fillRect(this.x + this.width * 0.46, this.y + this.height * 0.58, this.width * 0.07, this.height * 0.16);
        ctx.fillRect(this.x + this.width * 0.60, this.y + this.height * 0.58, this.width * 0.07, this.height * 0.16);
        
        // Cabeça
        ctx.fillStyle = '#FDE68A';
        ctx.fillRect(this.x + this.width * 0.35, this.y, this.width * 0.28, this.height * 0.33);
        
        // Cabelo e Óculos
        const currentChar = CONFIG.characters[this.selectedCharacterKey];
        ctx.fillStyle = currentChar.hairColor;
        if (this.selectedCharacterKey === 'hermione') { // Cabelo da Hermione
             ctx.fillRect(this.x + this.width * 0.32, this.y - this.height * 0.04, this.width * 0.35, this.height * 0.16);
             ctx.fillRect(this.x + this.width * 0.28, this.y + this.height * 0.04, this.width * 0.42, this.height * 0.12);
             ctx.fillRect(this.x + this.width * 0.28, this.y + this.height * 0.16, this.width * 0.14, this.height * 0.25);
        } else { // Cabelo do Harry e Rony
            ctx.fillRect(this.x + this.width * 0.35, this.y, this.width * 0.28, this.height * 0.08);
            ctx.fillRect(this.x + this.width * 0.32, this.y + this.height * 0.08, this.width * 0.07, this.height * 0.08);
            ctx.fillRect(this.x + this.width * 0.60, this.y + this.height * 0.08, this.width * 0.07, this.height * 0.08);
        }

        if (currentChar.hasGlasses) {
            ctx.fillStyle = '#111827';
            ctx.fillRect(this.x + this.width * 0.39, this.y + this.height * 0.12, this.width * 0.07, this.height * 0.08);
            ctx.fillRect(this.x + this.width * 0.53, this.y + this.height * 0.12, this.width * 0.07, this.height * 0.08);
        }
        ctx.restore();
    }
    
    update(groundHeight) {
        const currentBroom = CONFIG.brooms[this.selectedBroomKey];
        
        this.velocity += currentBroom.gravity;
        this.y += this.velocity;
        
        if (this.y < 0) { 
            this.y = 0; 
            this.velocity = 0; 
        }
        
        if (this.y + this.height > CONFIG.BASE_HEIGHT - groundHeight) {
            this.y = CONFIG.BASE_HEIGHT - groundHeight - this.height;
            this.velocity = 0;
            return true; // Retorna true se o jogador bater no chão
        }
        
        if(this.isInvincible) {
            this.invincibilityTimer--;
            if(this.invincibilityTimer <= 0) this.isInvincible = false;
        }
        
        if(this.visualEffect) {
            this.visualEffectTimer--;
            if(this.visualEffectTimer <= 0) {
                this.visualEffect = null;
                this.width = this.baseWidth;
                this.height = this.baseHeight;
            }
        }
        
        return false; // Jogador não bateu no chão
    }
    
    flap() {
        let currentLift = CONFIG.brooms[this.selectedBroomKey].lift;
        if (this.visualEffect === 'invert') {
            currentLift = -currentLift;
        }
        this.velocity = currentLift;
        audioManager.playSfx(audioManager.sfx.flap, "C5", "8n", Tone.now());
    }
    
    setInvincible(duration) {
        this.isInvincible = true;
        this.invincibilityTimer = duration;
    }
    
    applyVisualEffect(effect, duration) {
        this.visualEffect = effect;
        this.visualEffectTimer = duration;
        
        if (effect === 'resize') {
            const scale = Math.random() < 0.5 ? 0.5 : 1.5; // Encolher ou aumentar
            this.width = this.baseWidth * scale;
            this.height = this.baseHeight * scale;
        }
    }
    
    updateSelectedOptions(broomKey, characterKey) {
        this.selectedBroomKey = broomKey;
        this.selectedCharacterKey = characterKey;
    }
}
