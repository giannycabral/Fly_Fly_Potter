// Classe do jogador (personagem)
class Player {
    constructor(ctx, x, y, characterKey = 'harry', broomKey = 'nimbus') {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 32;
        this.velY = 0;
        this.gravity = 0.5;
        this.jumpForce = -10;
        this.character = CONFIG.characters[characterKey];
        this.broom = CONFIG.brooms[broomKey];
        this.characterKey = characterKey;
        this.broomKey = broomKey;
        this.isFlapping = false;
        this.lives = 3;
        this.flapTimer = 0;
        
        // Para animação
        this.rotation = 0;
        this.frameWidth = this.width;
        this.frameHeight = this.height;
        
        console.log(`Jogador criado com personagem: ${characterKey}, vassoura: ${broomKey}`);
    }
    
    jump() {
        this.velY = this.jumpForce;
        this.isFlapping = true;
        this.flapTimer = 10;
    }
    
    update() {
        // Aplicar gravidade
        this.velY += this.gravity;
        this.y += this.velY;
        
        // Limites da tela
        if (this.y < 0) {
            this.y = 0;
            this.velY = 0;
        }
        
        if (this.y + this.height > CONFIG.BASE_HEIGHT) {
            this.y = CONFIG.BASE_HEIGHT - this.height;
            this.velY = 0;
        }
        
        // Rotação baseada na velocidade vertical
        this.rotation = this.velY * 1.5;
        if (this.rotation > 50) this.rotation = 50;
        if (this.rotation < -30) this.rotation = -30;
        
        // Decrementar o timer do flap
        if (this.flapTimer > 0) {
            this.flapTimer--;
        } else {
            this.isFlapping = false;
        }
    }
    
    draw() {
        this.ctx.save();
        
        // Ponto de rotação centrado no jogador
        this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.ctx.rotate(this.rotation * Math.PI / 180);
        
        // Pixel size para o desenho pixelado
        const p = 3;  // Reduzido tamanho para melhor escala
        
        // Posição ajustada para desenho centralizado
        const drawX = -this.width / 3;  // Reduzido para centralizar
        const drawY = -this.height / 3;  // Reduzido para centralizar
        
        // Desenhar a vassoura - REDUZIDA
        // Cabo da vassoura
        this.ctx.fillStyle = this.broom.color;
        this.ctx.fillRect(drawX, drawY + 6, 30, 4);
        
        // Cerdas na parte de trás da vassoura
        this.ctx.fillStyle = '#FBBF24';
        this.ctx.fillRect(drawX - 8, drawY + 5, 8, 6);
        
        if (this.broomKey === 'firebolt') {
            // Detalhes dourados para a Firebolt
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillRect(drawX + 22, drawY + 6, 3, 4);
        }
        
        // Desenhar o personagem - REDUZIDO
        // Corpo
        this.ctx.fillStyle = this.character.robeColor;
        this.ctx.fillRect(drawX + 8, drawY + 2, 12, 16);
        
        // Cabeça
        this.ctx.fillStyle = '#FDE68A';
        this.ctx.fillRect(drawX + 10, drawY - 2, 8, 8);
        
        // Cabelo
        this.ctx.fillStyle = this.character.hairColor;
        this.ctx.fillRect(drawX + 10, drawY - 5, 8, 3);
        
        // Se for o Harry, adicionar os óculos
        if (this.characterKey === 'harry') {
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(drawX + 11, drawY, 2, 2);
            this.ctx.fillRect(drawX + 15, drawY, 2, 2);
            this.ctx.fillRect(drawX + 13, drawY + 1, 2, 1);
        }
        
        // Efeito de 'flapear' quando pula
        if (this.isFlapping) {
            this.ctx.fillStyle = this.character.robeColor;
            this.ctx.fillRect(drawX + 4, drawY + 7, 4, 3);
            this.ctx.fillRect(drawX + 20, drawY + 7, 4, 3);
        }
        
        this.ctx.restore();
    }
