// Classe principal do jogo
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Estado do jogo
        this.gameState = 'start'; // start, playing, paused, gameOver, spellCasting
        this.score = 0;
        this.lives = 3;
        this.highScore = localStorage.getItem('flyflypotter_highscore') || 0;
        this.frame = 0;
        this.scenario = 'castle';
        this.previousScenario = 'castle';
        this.spellTimer = 0;
        this.selectedBroomKey = 'shootingStar';
        this.selectedCharacterKey = 'harry';
        
        // Objetos do jogo
        this.player = new Player(120, 300, this.selectedBroomKey, this.selectedCharacterKey);
        this.background = new Background();
        this.ground = new Ground(CONFIG.groundHeight);
        this.obstacles = [];
        this.beans = [];
        this.dementor = new Dementor();
        this.goldenSnitch = new GoldenSnitch();
        this.chocolateFrog = new ChocolateFrog();
        
        // Interface do usuário
        this.ui = new UIManager();
        
        this.init();
    }
    
    init() {
        // Configurar o canvas
        this.canvas.width = CONFIG.BASE_WIDTH;
        this.canvas.height = CONFIG.BASE_HEIGHT;
        this.ctx.imageSmoothingEnabled = false;
        
        // Configurar UI
        this.ui.setupCharacterSelection((charKey) => {
            this.selectedCharacterKey = charKey;
            this.player.updateSelectedOptions(this.selectedBroomKey, this.selectedCharacterKey);
            this.drawInitialScreen();
        });
        
        this.ui.setupBroomSelection((broomKey) => {
            this.selectedBroomKey = broomKey;
            this.player.updateSelectedOptions(this.selectedBroomKey, this.selectedCharacterKey);
        });
        
        this.ui.setupEventListeners(this);
        
        // Certifique-se de que a tela inicial seja visível
        this.ui.showStartScreen();
        
        this.drawInitialScreen();
    }
    
    drawInitialScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.background.draw(this.ctx, this.scenario);
        this.ground.draw(this.ctx, this.scenario);
        this.player.draw(this.ctx, this.frame);
        this.ui.drawScore(this.ctx, this.score);
        this.ui.drawLives(this.ctx, this.lives);
    }
    
    async startGame() {
        try {
            // Inicializa o áudio quando o usuário interage com a página (clicando em Start)
            await audioManager.init();
            
            // Salva a seleção do jogador
            const selectedCharacterEl = document.querySelector('#characterSelection .selected');
            const selectedBroomEl = document.querySelector('#broomSelection .selected');
            
            if (selectedCharacterEl && selectedCharacterEl.dataset.char) {
                this.selectedCharacterKey = selectedCharacterEl.dataset.char;
            }
            
            if (selectedBroomEl && selectedBroomEl.dataset.broom) {
                this.selectedBroomKey = selectedBroomEl.dataset.broom;
            }
            
            // Recria o jogador com as seleções corretas
            this.player = new Player(
                120, 
                300, 
                this.selectedBroomKey, 
                this.selectedCharacterKey
            );
            
            this.ui.hideStartScreen(() => {
                this.resetGame();
                this.gameState = 'playing';
                this.gameLoop();
            });
        } catch (error) {
            console.warn("Erro ao iniciar o jogo:", error);
            // Continua com o jogo mesmo se o áudio falhar
            this.ui.hideStartScreen(() => {
                this.resetGame();
                this.gameState = 'playing';
                this.gameLoop();
            });
        }
    }
    
    gameLoop() {
        if (this.gameState === 'playing') {
            this.updatePlaying();
        } else if (this.gameState === 'spellCasting') {
            this.updateSpellCasting();
        }
        
        this.drawGame();
        
        if (this.gameState !== 'gameOver' && this.gameState !== 'paused') {
            this.frame++;
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    
    updatePlaying() {
        // Atualizar cenário com base na pontuação
        if (this.score >= 40) this.scenario = 'quidditch';
        else if (this.score >= 20) this.scenario = 'forest';
        else this.scenario = 'castle';

        if (this.scenario !== this.previousScenario) {
            this.ui.showScenarioNotification(this.scenario);
            this.previousScenario = this.scenario;
        }
        
        // Atualizar jogador
        const hitGround = this.player.update(CONFIG.groundHeight);
        if (hitGround && !this.player.isInvincible) this.loseLife();
        
        // Atualizar obstáculos
        this.updateObstacles();
        
        // Atualizar feijõezinhos
        this.updateBeans();
        
        // Atualizar outros elementos do jogo
        this.goldenSnitch.update(this.frame);
        this.dementor.update(this.frame);
        this.chocolateFrog.update(this.frame);
        
        // Gerar novos elementos
        this.generateObstacles();
        this.spawnBean();
        this.spawnGoldenSnitch();
        this.spawnDementor();
        this.spawnChocolateFrog();
        
        // Verificar colisões
        this.checkCollisions();
    }
    
    updateSpellCasting() {
        this.spellTimer--;
        this.ui.updateSpellTimerBar((this.spellTimer / CONFIG.SPELL_TIME_LIMIT) * 100);
        this.dementor.update(this.frame); // Dementador continua a mover-se
        
        if (this.spellTimer <= 0) {
            audioManager.playSfx(audioManager.sfx.fail, "C3", "4n", Tone.now());
            this.loseLife();
            this.resolveSpellEvent();
        }
    }
    
    drawGame() {
        this.ctx.clearRect(0, 0, CONFIG.BASE_WIDTH, CONFIG.BASE_HEIGHT);
        
        // Desenhar fundo
        this.background.draw(this.ctx, this.scenario);
        this.ground.draw(this.ctx, this.scenario);
        
        // Desenhar obstáculos
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx, this.scenario));
        
        // Desenhar feijõezinhos
        this.beans.forEach(bean => bean.draw(this.ctx));
        
        // Desenhar outros elementos
        this.goldenSnitch.draw(this.ctx);
        this.dementor.draw(this.ctx);
        this.chocolateFrog.draw(this.ctx);
        
        // Desenhar jogador
        this.player.draw(this.ctx, this.frame);
        
        // Desenhar UI
        this.ui.drawScore(this.ctx, this.score);
        this.ui.drawLives(this.ctx, this.lives);
        this.ui.drawNotification(this.ctx);
    }
    
    generateObstacles() {
        if (this.frame % CONFIG.obstacleProps.frequency === 0) {
            const type = Math.random() < 0.65 ? 'static' : 'moving';
            const gapY = Math.random() * (CONFIG.BASE_HEIGHT - CONFIG.obstacleProps.gap - CONFIG.groundHeight - 200) + 100;
            
            this.obstacles.push(new Obstacle(
                CONFIG.BASE_WIDTH,
                CONFIG.obstacleProps.width,
                gapY,
                CONFIG.obstacleProps.gap,
                type
            ));
        }
    }
    
    updateObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            let obstacle = this.obstacles[i];
            
            obstacle.update();
            
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(i, 1);
            }
            
            if (obstacle.checkCollision(this.player)) {
                this.loseLife();
            }
            
            if (obstacle.isPassed(this.player.x)) {
                this.score++;
                audioManager.playSfx(audioManager.sfx.score, "E6", "16n", Tone.now());
            }
        }
    }
    
    spawnBean() {
        if (this.frame > 200 && this.frame % CONFIG.beanProps.frequency === 0 && Math.random() < 0.5) {
            const type = Math.random() < 0.7 ? 'good' : 'bad';
            const color = type === 'good' 
                ? CONFIG.beanProps.goodColors[Math.floor(Math.random() * CONFIG.beanProps.goodColors.length)]
                : CONFIG.beanProps.badColors[Math.floor(Math.random() * CONFIG.beanProps.badColors.length)];
            
            this.beans.push(new Bean(
                CONFIG.BASE_WIDTH,
                Math.random() * (CONFIG.BASE_HEIGHT - CONFIG.groundHeight - 200) + 100,
                type,
                color
            ));
        }
    }
    
    updateBeans() {
        for (let i = this.beans.length - 1; i >= 0; i--) {
            let bean = this.beans[i];
            
            bean.update();
            
            if (bean.x + CONFIG.beanProps.width < 0) {
                this.beans.splice(i, 1);
                continue;
            }
            
            if (bean.checkCollision(this.player)) {
                if (bean.type === 'good') {
                    audioManager.playSfx(audioManager.sfx.bean, "G6", "16n", Tone.now());
                    this.score += 5;
                } else {
                    audioManager.playSfx(audioManager.sfx.badBean, "C3", "8n", Tone.now());
                    
                    const effects = ['rainbow', 'spin', 'invert', 'resize'];
                    const effect = effects[Math.floor(Math.random() * effects.length)];
                    
                    this.player.applyVisualEffect(effect, 240); // 4 segundos
                }
                
                this.beans.splice(i, 1);
            }
        }
    }
    
    spawnGoldenSnitch() {
        if (this.score > 5 && !this.goldenSnitch.active && this.frame % 300 === 0 && Math.random() < 0.40) {
            this.goldenSnitch.spawn();
        }
    }
    
    spawnDementor() {
        if (this.gameState === 'playing' && this.score > 8 && !this.dementor.active && this.frame % 450 === 0 && Math.random() < 0.5) {
            this.dementor.spawn(this.player.y);
        }
    }
    
    spawnChocolateFrog() {
        if (this.score > 10 && this.lives < 3 && !this.chocolateFrog.active && this.frame % 600 === 0 && Math.random() < 0.4) {
            this.chocolateFrog.spawn();
        }
    }
    
    checkCollisions() {
        // Verificar colisão com dementador
        if (this.dementor.active && this.dementor.x > -this.dementor.width) {
            this.gameState = 'spellCasting';
            this.spellTimer = CONFIG.SPELL_TIME_LIMIT;
            this.ui.showSpellModal();
        }
        
        // Verificar colisão com dementador (sem iniciar modal)
        if (this.dementor.checkCollision(this.player)) {
            this.loseLife();
        }
        
        // Verificar colisão com pomo de ouro
        if (this.goldenSnitch.checkCollision(this.player)) {
            this.goldenSnitch.active = false;
            this.player.setInvincible(300);
            audioManager.playSfx(audioManager.sfx.powerup, "G5", "0.5s", Tone.now());
        }
        
        // Verificar colisão com sapo de chocolate
        if (this.chocolateFrog.checkCollision(this.player)) {
            this.chocolateFrog.active = false;
            if (this.lives < 3) {
                this.lives++;
                audioManager.playSfx(audioManager.sfx.lifeUp, "A5", "8n", Tone.now());
            }
        }
    }
    
    loseLife() {
        if (this.player.isInvincible) return;
        
        audioManager.playSfx(audioManager.sfx.hit, "C2", "8n", Tone.now());
        this.lives--;
        
        if (this.lives <= 0) {
            this.endGame();
        } else {
            this.player.setInvincible(120);
        }
    }
    
    endGame() {
        if (this.gameState === 'gameOver') return;
        
        this.gameState = 'gameOver';
        this.ui.hidePauseButton();
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('flyflypotter_highscore', this.highScore);
        }
        
        this.ui.showGameOverScreen(this.score, this.highScore);
    }
    
    resetGame() {
        this.player.y = 300;
        this.player.velocity = 0;
        this.player.isInvincible = false;
        this.player.invincibilityTimer = 0;
        this.player.visualEffect = null;
        this.player.visualEffectTimer = 0;
        this.player.width = this.player.baseWidth;
        this.player.height = this.player.baseHeight;
        
        this.obstacles = [];
        this.beans = [];
        
        this.goldenSnitch.active = false;
        this.chocolateFrog.active = false;
        this.dementor.active = false;
        this.dementor.x = -this.dementor.width;
        
        this.score = 0;
        this.lives = 3;
        this.frame = 0;
        this.scenario = 'castle';
        this.previousScenario = 'castle';
        
        this.ui.notification.timer = 0;
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.ui.showPauseMenu();
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.ui.hidePauseMenu();
            this.gameLoop();
        }
    }
    
    resolveSpellEvent() {
        this.dementor.active = false;
        this.ui.hideSpellModal();
        
        if (this.gameState !== 'gameOver') {
            this.gameState = 'playing';
        }
    }
    
    returnToMenu() {
        this.gameState = 'start';
        this.ui.hidePauseMenu();
        this.ui.hidePauseButton();
        
        this.ui.showStartScreen();
        
        this.resetGame();
        this.drawInitialScreen();
    }
    
    restartFromGameOver() {
        this.ui.hideGameOverScreen(() => {
            this.ui.showStartScreen();
            
            this.resetGame();
            this.drawInitialScreen();
        });
    }
    
    handleInput() {
        if (this.gameState === 'playing') {
            this.player.flap();
        }
    }
}
