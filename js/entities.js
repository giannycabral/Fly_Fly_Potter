// Classe para os feijõezinhos
class Bean {
    constructor(x, y, type, color) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(
            this.x, 
            this.y, 
            CONFIG.beanProps.width / 2, 
            CONFIG.beanProps.height / 2, 
            0, 0, Math.PI * 2
        );
        ctx.fill();
    }
    
    update() {
        // Reduzir velocidade para manter compatível com os obstáculos
        this.x -= 0.9; // Reduzido para deixar o jogo mais lento
    }
    
    checkCollision(player) {
        return player.x < this.x + CONFIG.beanProps.width && 
               player.x + player.width > this.x &&
               player.y < this.y + CONFIG.beanProps.height && 
               player.y + player.height > this.y;
    }
}

// Classe para o Dementador
class Dementor {
    constructor() {
        this.x = -100;
        this.y = 300;
        this.width = 60;
        this.height = 80;
        this.active = false;
        this.speedX = 0.4;
        // Pre-calculate smoke details for consistent appearance
        this.smokeDetails = [];
        for (let i = 0; i < this.width; i += 7) {
            this.smokeDetails.push({
                offset: i,
                randomHeight: 8 + Math.random() * 12,
                randomRadius: 4 + Math.random() * 2
            });
        }
    }
    
    draw(ctx) {
        if (!this.active) return;

        // Corpo principal (silhueta ondulada)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.5, this.y);
        ctx.bezierCurveTo(
            this.x + this.width * 0.2, this.y + this.height * 0.3,
            this.x + this.width * 0.8, this.y + this.height * 0.3,
            this.x + this.width * 0.5, this.y + this.height
        );
        ctx.bezierCurveTo(
            this.x + this.width * 0.1, this.y + this.height * 0.7,
            this.x + this.width * 0.9, this.y + this.height * 0.7,
            this.x + this.width * 0.5, this.y
        );
        ctx.closePath();
        ctx.fillStyle = 'rgba(23, 23, 23, 0.92)';
        ctx.shadowColor = '#111';
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Capa ondulada
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height * 0.7);
        const waveTime = performance.now() / 80;
        for (let i = 0; i <= this.width; i += 8) {
            const wave = Math.sin((i + waveTime) / 8) * 6;
            ctx.lineTo(this.x + i, this.y + this.height * 0.85 + wave);
        }
        ctx.lineTo(this.x + this.width, this.y + this.height * 0.7);
        ctx.closePath();
        ctx.fillStyle = 'rgba(30, 30, 30, 0.85)';
        ctx.fill();

        // Cabeça (oval escura)
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width * 0.5,
            this.y + this.height * 0.22,
            this.width * 0.22,
            this.height * 0.19,
            0, 0, 2 * Math.PI
        );
        ctx.fillStyle = 'rgba(15, 15, 15, 0.98)';
        ctx.fill();

        // Olhos vermelhos brilhantes
        ctx.beginPath();
        ctx.arc(this.x + this.width * 0.38, this.y + this.height * 0.22, 4, 0, 2 * Math.PI);
        ctx.arc(this.x + this.width * 0.62, this.y + this.height * 0.22, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff2222';
        ctx.shadowColor = '#ff2222';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Boca (fina, sombria)
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width * 0.5,
            this.y + this.height * 0.28,
            7, 2, 0, 0, Math.PI * 2
        );
        ctx.fillStyle = 'rgba(60,0,0,0.5)';
        ctx.fill();

        // Mãos (garras)
        ctx.beginPath();
        ctx.arc(this.x + this.width * 0.18, this.y + this.height * 0.65, 7, 0, Math.PI * 2);
        ctx.arc(this.x + this.width * 0.82, this.y + this.height * 0.65, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(40, 40, 40, 0.85)';
        ctx.fill();
        // Detalhes de "fumaça" na base (usando valores pré-calculados para evitar flicker)
        for (const smoke of this.smokeDetails) {
            ctx.beginPath();
            ctx.arc(this.x + smoke.offset, this.y + this.height * 0.97, smoke.randomRadius, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(30,30,30,0.4)';
            ctx.fill();
        }  ctx.restore();
    }
    
    update(frame) {
        if (!this.active) return;
        
        this.x += this.speedX;
        this.y += Math.sin(frame * 0.05) * 1.2;
        
        if (this.x > CONFIG.BASE_WIDTH) this.active = false;
    }
    spawn(playerY) {
        this.active = true;
        this.x = -this.width;
        
        // Limitar onde o dementador pode aparecer para evitar que fique muito difícil
        const minY = 100; // Não muito alto
        const maxY = CONFIG.BASE_HEIGHT - CONFIG.groundHeight - this.height - 50; // Não muito baixo
        
        // Ajustar posição do dementador baseado no jogador, mas com limitações
        let targetY = playerY + (Math.random() - 0.5) * 150;
        targetY = Math.max(minY, Math.min(maxY, targetY));
        this.y = targetY;
        
        // Ajustar velocidade (um pouco aleatória para ser menos previsível)
        this.speedX = 0.4 + Math.random() * 0.2;

        // Recalcular smoke details for each spawn for variety
        this.smokeDetails = [];
        for (let i = 0; i < this.width; i += 7) {
            this.smokeDetails.push({
                offset: i,
                randomHeight: 8 + Math.random() * 12,
                randomRadius: 4 + Math.random() * 2
            });
        }
        
        // Efeito visual para acentuar o aparecimento do dementador
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.style.filter = 'brightness(0.8) saturate(0.8)';
            setTimeout(() => {
                canvas.style.filter = 'none';
            }, 300);
        }
        
        // Tocar som do dementador
        audioManager.playSfx(audioManager.sfx.dementor, "C2", "4n");
    }
    
    checkCollision(player) {
        if (!this.active || player.isInvincible) return false;
        
        return player.x < this.x + this.width && 
               player.x + player.width > this.x &&
               player.y < this.y + this.height && 
               player.y + player.height > this.y;
    }
}

// Classe para o Pomo de Ouro
class GoldenSnitch {
    constructor() {
        this.x = -100;
        this.y = 300;
        this.width = 24;
        this.height = 24;
        this.active = false;
        this.speedY = 1;
    }
    
    draw(ctx) {
        if (!this.active) return;
        
        // Asas com movimento
        const wingOffset = Math.sin(performance.now() / 100) * 4;
        
        // Asa esquerda
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.save();
        ctx.translate(this.x - 9, this.y + 9);
        ctx.rotate(-0.2 - wingOffset / 20);
        ctx.fillRect(-2, 0, 14, 6);
        ctx.restore();
        
        // Asa direita
        ctx.save();
        ctx.translate(this.x + 21, this.y + 9);
        ctx.rotate(0.2 + wingOffset / 20);
        ctx.fillRect(0, 0, 14, 6);
        ctx.restore();
        
        // Corpo dourado com brilho
        ctx.save();
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2, this.y + this.height / 2, 0,
            this.x + this.width / 2, this.y + this.height / 2, this.width / 2
        );
        gradient.addColorStop(0, '#FFF7B2');
        gradient.addColorStop(0.7, '#FBBF24');
        gradient.addColorStop(1, '#B45309');
        
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 8;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Detalhes
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 2, this.y + this.height / 2 - 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#B45309';
        ctx.fill();
        
        ctx.restore();
    }
    
    update(frame) {
        if (!this.active) return;
        
        // Velocidade ainda mais reduzida
        this.x -= 2.8; // Reduzido para deixar o jogo mais lento
        this.y += Math.sin(frame * 0.08) * this.speedY; // Movimento mais suave
        
        if (this.x + this.width < 0) this.active = false;
    }
    
    spawn() {
        this.active = true;
        this.x = CONFIG.BASE_WIDTH;
        this.y = Math.random() * (CONFIG.BASE_HEIGHT - CONFIG.groundHeight - 200) + 100;
    }
    
    checkCollision(player) {
        if (!this.active) return false;
        
        return player.x < this.x + this.width && 
               player.x + player.width > this.x &&
               player.y < this.y + this.height && 
               player.y + player.height > this.y;
    }
}

// Classe para o Sapo de Chocolate
class ChocolateFrog {
    constructor() {
        this.x = -100;
        this.y = 300;
        this.width = 32;
        this.height = 28;
        this.active = false;
    }
    
    draw(ctx) {
        if (!this.active) return;
        
        const p = 4;
        ctx.save();
        
        // Pulo animado
        const jumpOffset = Math.abs(Math.sin(performance.now() / 300) * 4);
        
        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x + 4*p, this.y + 7*p, 4*p, p, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Corpo
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(this.x + p, this.y - jumpOffset, 6*p, 5*p);
        
        // Detalhes do corpo - padrão de chocolate
        ctx.fillStyle = '#4A2C2A';
        ctx.fillRect(this.x + p, this.y + p - jumpOffset, 6*p, p);
        ctx.fillRect(this.x + p, this.y + 3*p - jumpOffset, 6*p, p);
        ctx.fillRect(this.x + 3*p, this.y - jumpOffset, p, 5*p);
        
        // Olhos
        ctx.fillStyle = '#FEEBC8';
        ctx.fillRect(this.x + p, this.y + 0.5*p - jumpOffset, p*1.5, p);
        ctx.fillRect(this.x + 5.5*p, this.y + 0.5*p - jumpOffset, p*1.5, p);
        
        // Pupilas
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + p + p*0.5, this.y + 0.5*p - jumpOffset, p*0.5, p);
        ctx.fillRect(this.x + 5.5*p + p*0.5, this.y + 0.5*p - jumpOffset, p*0.5, p);
        
        // Boca
        ctx.fillStyle = '#2D1B13';
        ctx.beginPath();
        ctx.ellipse(this.x + 4*p, this.y + 3.5*p - jumpOffset, 2*p, p/2, 0, 0, Math.PI);
        ctx.fill();
        
        // Pernas
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(this.x, this.y + 4*p - jumpOffset/2, p*2, p*3);
        ctx.fillRect(this.x + 6*p, this.y + 4*p - jumpOffset/2, p*2, p*3);
        
        ctx.restore();
    }
    
    update(frame) {
        if (!this.active) return;
        
        // Velocidade ainda mais reduzida
        this.x -= 2.0; // Reduzido para deixar o jogo mais lento
        this.y += Math.sin(frame * 0.15) * 1.2; // Movimento mais suave
        
        if (this.x + this.width < 0) this.active = false;
    }
    
    spawn() {
        this.active = true;
        this.x = CONFIG.BASE_WIDTH;
        
        // Ajustando para que os sapos apareçam em alturas mais acessíveis
        // Dividimos a área jogável em 3 zonas e escolhemos uma aleatoriamente
        const zone = Math.floor(Math.random() * 3);
        if (zone === 0) {
            // Zona superior
            this.y = Math.random() * 150 + 100;
        } else if (zone === 1) {
            // Zona central
            this.y = Math.random() * 150 + 250;
        } else {
            // Zona inferior
            this.y = Math.random() * 100 + 400;
        }
    }
    
    checkCollision(player) {
        if (!this.active) return false;
        
        return player.x < this.x + this.width && 
               player.x + player.width > this.x &&
               player.y < this.y + this.height && 
               player.y + player.height > this.y;
    }
}
