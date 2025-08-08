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
    }
    
    draw(ctx) {
        if (!this.active) return;
        
        ctx.fillStyle = 'rgba(23, 23, 23, 0.85)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        const tatterHeight = 16;
        for (let i = 0; i < this.width; i += 5) {
            const randomHeight = Math.random() * tatterHeight;
            ctx.clearRect(this.x + i, this.y + this.height - randomHeight, 5, randomHeight);
        }
        
        // Olhos vermelhos
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(this.x + 15, this.y + 20, 10, 10);
        ctx.fillRect(this.x + 35, this.y + 20, 10, 10);
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
        
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x - 9, this.y + 9, 12, 6);
        ctx.fillRect(this.x + 21, this.y + 9, 12, 6);
        
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
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
        // Corpo
        ctx.fillStyle = '#4A2C2A';
        ctx.fillRect(this.x + p, this.y, 6*p, 5*p);
        // Olhos
        ctx.fillStyle = '#FBBF24';
        ctx.fillRect(this.x + p, this.y, p*2, p);
        ctx.fillRect(this.x + 5*p, this.y, p*2, p);
        // Pernas
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(this.x, this.y + 4*p, p*2, p*3);
        ctx.fillRect(this.x + 6*p, this.y + 4*p, p*2, p*3);
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
        this.y = Math.random() * (CONFIG.BASE_HEIGHT - CONFIG.groundHeight - 150) + 75;
    }
    
    checkCollision(player) {
        if (!this.active) return false;
        
        return player.x < this.x + this.width && 
               player.x + player.width > this.x &&
               player.y < this.y + this.height && 
               player.y + player.height > this.y;
    }
}
