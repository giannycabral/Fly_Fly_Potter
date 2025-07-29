// Classe para objetos de fundo (cenário)
class Background {
    constructor() {
        this.stars = [];
        this.init();
    }
    
    init() {
        for(let i=0; i<150; i++) {
            this.stars.push({
                x: Math.random() * CONFIG.BASE_WIDTH, 
                y: Math.random() * (CONFIG.BASE_HEIGHT - CONFIG.groundHeight), 
                radius: Math.random() * 2, 
                speed: Math.random() * 0.25 + 0.1 
            });
        }
    }
    
    draw(ctx, scenario) {
        let bgColor = '#2d3748';
        if (scenario === 'forest') bgColor = '#1E4620';
        if (scenario === 'quidditch') bgColor = '#87CEEB';
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, CONFIG.BASE_WIDTH, CONFIG.BASE_HEIGHT);

        if (scenario === 'castle') {
            ctx.fillStyle = '#FBBF24';
            this.stars.forEach(star => {
                star.x -= star.speed;
                if(star.x < 0) { star.x = CONFIG.BASE_WIDTH; }
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }
}

// Classe para o chão do jogo
class Ground {
    constructor(height) {
        this.height = height;
    }
    
    draw(ctx, scenario) {
        let groundColor1 = '#4A5568';
        let groundColor2 = '#2D3748';
        
        if (scenario === 'forest') { 
            groundColor1 = '#4CAF50'; 
            groundColor2 = '#388E3C'; 
        }
        
        if (scenario === 'quidditch') { 
            groundColor1 = '#66BB6A'; 
            groundColor2 = '#4CAF50'; 
        }

        for(let x=0; x < CONFIG.BASE_WIDTH; x += 24) { 
            for(let y=CONFIG.BASE_HEIGHT - this.height; y < CONFIG.BASE_HEIGHT; y += 24) { 
                ctx.fillStyle = (x/24 + y/24) % 2 === 0 ? groundColor1 : groundColor2; 
                ctx.fillRect(x, y, 24, 24); 
            } 
        } 
    }
}

// Classe para obstáculos
class Obstacle {
    constructor(x, width, gapY, gap, type) {
        this.x = x;
        this.width = width;
        this.gapY = gapY;
        this.gap = gap;
        this.type = type;
        this.passed = false;
        this.moveSpeed = type === 'moving' ? (Math.random() * 0.5 + 0.5) : 0;
        this.moveDirection = 1;
        this.initialGapY = gapY;
        this.moveRange = 45;
    }
    
    update() {
        this.x -= 2;
        
        if (this.type === 'moving') {
            this.gapY += this.moveSpeed * this.moveDirection;
            if (this.gapY <= this.initialGapY - this.moveRange || this.gapY >= this.initialGapY + this.moveRange) {
                this.moveDirection *= -1;
            }
        }
    }
    
    draw(ctx, scenario) {
        const topPillarHeight = this.gapY;
        const bottomPillarY = this.gapY + this.gap;
        
        if (scenario === 'castle') {
            this.drawCastleTower(ctx, topPillarHeight, bottomPillarY);
        } else if (scenario === 'forest') {
            this.drawForestTree(ctx, topPillarHeight, bottomPillarY);
        } else if (scenario === 'quidditch') {
            this.drawQuidditchGoal(ctx, topPillarHeight, bottomPillarY);
        }
    }
    
    drawCastleTower(ctx, topPillarHeight, bottomPillarY) {
        const mainColor = this.type === 'moving' ? '#581C87' : '#78716C';
        const highlightColor = this.type === 'moving' ? '#9333EA' : '#A8A29E';
        const shadowColor = this.type === 'moving' ? '#3B0764' : '#57534E';
        const windowColor = '#FBBF24';

        ctx.fillStyle = mainColor;
        ctx.fillRect(this.x, 0, this.width, topPillarHeight);
        ctx.fillStyle = highlightColor;
        ctx.fillRect(this.x + 6, 0, this.width - 12, topPillarHeight);
        ctx.fillStyle = shadowColor;
        ctx.fillRect(this.x, 0, 6, topPillarHeight);
        ctx.fillRect(this.x + this.width - 6, 0, 6, topPillarHeight);
        
        const windowWidth = 9;
        const windowHeight = 15;
        for(let winY = topPillarHeight - 45; winY > 30; winY -= 60) {
            ctx.fillStyle = windowColor;
            ctx.fillRect(this.x + this.width/2 - windowWidth/2, winY - windowHeight/2, windowWidth, windowHeight);
        }

        const battlementSize = 12;
        for (let bx = 0; bx < this.width; bx += battlementSize * 2) {
            ctx.fillStyle = shadowColor;
            ctx.fillRect(this.x + bx, topPillarHeight - battlementSize, battlementSize, battlementSize);
        }
        
        const bottomPillarHeight = CONFIG.BASE_HEIGHT - bottomPillarY;
        ctx.fillStyle = mainColor;
        ctx.fillRect(this.x, bottomPillarY, this.width, bottomPillarHeight);
        ctx.fillStyle = highlightColor;
        ctx.fillRect(this.x + 6, bottomPillarY, this.width - 12, bottomPillarHeight);
        ctx.fillStyle = shadowColor;
        ctx.fillRect(this.x, bottomPillarY, 6, bottomPillarHeight);
        ctx.fillRect(this.x + this.width - 6, bottomPillarY, 6, bottomPillarHeight);

        for(let winY = bottomPillarY + 45; winY < CONFIG.BASE_HEIGHT - CONFIG.groundHeight - 30; winY += 60) {
             ctx.fillStyle = windowColor;
             ctx.fillRect(this.x + this.width/2 - windowWidth/2, winY - windowHeight/2, windowWidth, windowHeight);
        }

        for (let bx = 0; bx < this.width; bx += battlementSize * 2) {
            ctx.fillStyle = shadowColor;
            ctx.fillRect(this.x + bx, bottomPillarY, battlementSize, battlementSize);
        }
    }

    drawForestTree(ctx, topPillarHeight, bottomPillarY) {
        const trunkColor = '#5D4037';
        const leavesColor = this.type === 'moving' ? '#2E7D32' : '#388E3C';
        const leavesHighlight = this.type === 'moving' ? '#4CAF50' : '#66BB6A';
        
        ctx.fillStyle = trunkColor;
        ctx.fillRect(this.x, 0, this.width, topPillarHeight);
        ctx.fillStyle = leavesColor;
        ctx.fillRect(this.x - 10, topPillarHeight - 40, this.width + 20, 40);
        ctx.fillStyle = leavesHighlight;
        ctx.fillRect(this.x - 5, topPillarHeight - 35, this.width + 10, 30);

        const bottomPillarHeight = CONFIG.BASE_HEIGHT - bottomPillarY;
        ctx.fillStyle = trunkColor;
        ctx.fillRect(this.x, bottomPillarY, this.width, bottomPillarHeight);
        ctx.fillStyle = leavesColor;
        ctx.fillRect(this.x - 10, bottomPillarY, this.width + 20, 40);
        ctx.fillStyle = leavesHighlight;
        ctx.fillRect(this.x - 5, bottomPillarY + 5, this.width + 10, 30);
    }

    drawQuidditchGoal(ctx, topPillarHeight, bottomPillarY) {
        const postColor = '#A1887F';
        const hoopColor = '#FFD700';

        ctx.fillStyle = postColor;
        ctx.fillRect(this.x + this.width/2 - 5, 0, 10, topPillarHeight);
        ctx.fillStyle = hoopColor;
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, topPillarHeight, 30, 0, Math.PI * 2);
        ctx.lineWidth = 8;
        ctx.strokeStyle = hoopColor;
        ctx.stroke();

        ctx.fillStyle = postColor;
        ctx.fillRect(this.x + this.width/2 - 5, bottomPillarY, 10, CONFIG.BASE_HEIGHT - bottomPillarY);
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, bottomPillarY, 30, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    checkCollision(player) {
        if (player.isInvincible) return false;
        
        const topPillarHeight = this.gapY;
        const bottomPillarY = this.gapY + this.gap;
        
        const playerCollidesTop = player.x < this.x + this.width && 
                                  player.x + player.width > this.x && 
                                  player.y < topPillarHeight;
                                  
        const playerCollidesBottom = player.x < this.x + this.width && 
                                     player.x + player.width > this.x && 
                                     player.y + player.height > bottomPillarY;
                                     
        return playerCollidesTop || playerCollidesBottom;
    }
    
    isPassed(playerX) {
        if (this.x + this.width < playerX && !this.passed) {
            this.passed = true;
            return true;
        }
        return false;
    }
}
