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
        
        // Inicializar o gerenciador de responsividade
        if (window.responsiveManager) {
            window.responsiveManager.init(this);
        }
        
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
            this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
        } else if (this.gameState === 'gameOver') {
            // Se for game over, certifique-se que a tela está visível
            const gameOverScreen = document.getElementById('gameOverScreen');
            if (gameOverScreen && (gameOverScreen.style.display !== 'block' || gameOverScreen.style.visibility !== 'visible')) {
                console.log("Corrigindo visibilidade da tela de Game Over no gameLoop");
                this.ui.showGameOverScreen(this.score, this.highScore);
            }
        }
    }
    
    updatePlaying() {
        // Atualizar cenário com base na pontuação
        if (this.score >= 40) this.scenario = 'quidditch';
        else if (this.score >= 15) this.scenario = 'forest'; // Reduzido de 20 para 15 pontos
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
        // Atualizar o temporizador do feitiço
        this.spellTimer--;
        
        // Atualizar a barra de progresso
        this.ui.updateSpellTimerBar((this.spellTimer / CONFIG.SPELL_TIME_LIMIT) * 100);
        
        // Mudar a cor da barra conforme o tempo diminui
        const timerBarInner = document.getElementById('timerBarInner');
        if (timerBarInner) {
            if (this.spellTimer < CONFIG.SPELL_TIME_LIMIT * 0.3) {
                timerBarInner.style.backgroundColor = '#ef4444'; // Vermelho quando o tempo está acabando
            } else if (this.spellTimer < CONFIG.SPELL_TIME_LIMIT * 0.6) {
                timerBarInner.style.backgroundColor = '#fde047'; // Amarelo quando na metade do tempo
            }
        }
        
        // O dementador continua se movendo
        this.dementor.update(this.frame);
        
        // Efeito visual de "ameaça" - piscar a tela levemente em vermelho
        if (this.frame % 10 === 0) {
            const canvas = document.getElementById('gameCanvas');
            if (canvas) {
                canvas.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.5)';
                setTimeout(() => {
                    canvas.style.boxShadow = 'none';
                }, 100);
            }
        }
        
        // Verificar se o tempo acabou
        if (this.spellTimer <= 0) {
            console.log("Tempo esgotado para lançar o feitiço! O Dementador venceu!");
            audioManager.playSfx(audioManager.sfx.fail, "C3", "4n", Tone.now());
            
            // Efeito visual de derrota - escurecer a tela
            const canvas = document.getElementById('gameCanvas');
            if (canvas) {
                canvas.style.filter = 'brightness(0.5) grayscale(1)';
            }
            
            // Exibir mensagem sobre o Dementador
            this.ui.notification.text = "O Dementador levou sua alma!";
            this.ui.notification.timer = 180;
            this.ui.notification.alpha = 1.0;
            
            // Remover todas as vidas para causar game over
            this.lives = 0;
            
            // Definir game over
            this.gameState = 'gameOver';
            
            // Ocultar o modal de feitiço
            this.ui.hideSpellModal();
            
            // Mostrar tela de game over com pequeno atraso para visualização do efeito
            setTimeout(() => {
                this.ui.showGameOverScreen(this.score, this.highScore);
                // Restaurar filtro da tela
                if (canvas) {
                    canvas.style.filter = 'none';
                }
            }, 1500);
        }
        
        // Nota: Não configuramos event listeners de teclado aqui
        // A captura de tecla para lançar o feitiço é gerenciada pelo UIManager
    }
    
    // Método para lidar com mudanças na orientação ou responsividade
    handleResponsiveUpdate(isLandscapeMode) {
        // Atualiza a informação sobre o modo atual no objeto do jogo
        this.isLandscapeMode = isLandscapeMode;
        
        // Informa a UI sobre a mudança de orientação
        if (this.ui) {
            this.ui.updateOrientation(isLandscapeMode);
        }
    }
    
    drawGame() {
        this.ctx.clearRect(0, 0, CONFIG.BASE_WIDTH, CONFIG.BASE_HEIGHT);
        
        this.ctx.save(); // Salva o estado atual do contexto
        
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
        
        this.ctx.restore(); // Restaura o estado antes de desenhar a UI
        
        // Desenhar UI - sempre por último para garantir que apareça sobre tudo
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
                this.score += 2; // Aumentado de 1 para 2 pontos por obstáculo
                audioManager.playSfx(audioManager.sfx.score, "E6", "16n", Tone.now());
            }
        }
    }
    
    spawnBean() {
        if (this.frame > 200 && this.frame % CONFIG.beanProps.frequency === 0 && Math.random() < 0.5) {
            const type = Math.random() < 0.8 ? 'good' : 'bad'; // Aumentado para 80% de chance de feijões bons
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
                    
                    // Reduzir a probabilidade do efeito 'invert' que é o mais difícil de controlar
                    let effects = ['rainbow', 'spin', 'resize'];
                    
                    // Adiciona 'invert' com probabilidade menor (apenas 15% de chance)
                    if (Math.random() < 0.15) {
                        effects.push('invert');
                    }
                    
                    const effect = effects[Math.floor(Math.random() * effects.length)];
                    
                    // Duração reduzida para 3 segundos em vez de 4
                    this.player.applyVisualEffect(effect, 180);
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
        // Aumentada a frequência e probabilidade dos sapos de chocolate
        // Removida a limitação de vidas para que apareçam mesmo com vida cheia
        if (this.score > 5 && !this.chocolateFrog.active && this.frame % 400 === 0 && Math.random() < 0.6) {
            this.chocolateFrog.spawn();
            console.log("Sapo de chocolate gerado!");
        }
    }
    
    checkCollisions() {
        // Verificar colisão com dementador e iniciar evento de feitiço
        if (this.dementor.active && this.gameState === 'playing' && this.dementor.x > 0 && 
            this.dementor.x < CONFIG.BASE_WIDTH - 100) {
            console.log("Dementador detectado! Iniciando modo de feitiço...");
            
            // Mudar o estado do jogo para lançamento de feitiço
            this.gameState = 'spellCasting';
            
            // Iniciar temporizador para o feitiço
            this.spellTimer = CONFIG.SPELL_TIME_LIMIT;
            
            // Mostrar o modal de feitiço
            this.ui.showSpellModal();
            
            // Mostrar notificação de alerta sobre o dementador
            this.ui.notification.text = "DEMENTADOR! Use Expecto Patronum!";
            this.ui.notification.timer = 180;
            this.ui.notification.alpha = 1.0;
            
            // Reproduzir som de alerta
            audioManager.playSfx(audioManager.sfx.hit, "D2", "4n", Tone.now());
            
            // Fazer o dementador "pairar" na tela durante o confronto
            this.dementor.pauseMovement = true;
        }
        
        // Verificar colisão direta com dementador quando não estiver no modo de feitiço
        if (this.dementor.active && this.dementor.checkCollision(this.player) && this.gameState !== 'spellCasting') {
            console.log("Colisão com dementador!");
            this.loseLife();
            this.dementor.active = false;
        }
        
        // Verificar colisão com pomo de ouro
        if (this.goldenSnitch.active && this.goldenSnitch.checkCollision(this.player)) {
            console.log("Pomo de ouro coletado!");
            this.goldenSnitch.active = false;
            this.player.setInvincible(300);
            this.score += 50; // Bônus por pegar o pomo
            audioManager.playSfx(audioManager.sfx.powerup, "G5", "0.5s", Tone.now());
        }
        
        // Verificar colisão com sapo de chocolate
        if (this.chocolateFrog.active && this.chocolateFrog.checkCollision(this.player)) {
            console.log("Sapo de chocolate coletado!");
            this.chocolateFrog.active = false;
            
            if (this.lives < 3) {
                // Adiciona vida se o jogador tem menos de 3 vidas
                this.lives++;
                audioManager.playSfx(audioManager.sfx.lifeUp, "A5", "8n", Tone.now());
                this.ui.notification.text = "+1 Vida!";
                this.ui.notification.timer = 120;
                this.ui.notification.alpha = 1.0;
            } else {
                // Se o jogador já tem todas as vidas, ganha pontos extras
                this.score += 15;
                audioManager.playSfx(audioManager.sfx.score, "C6", "8n", Tone.now());
                this.ui.notification.text = "+15 Pontos!";
                this.ui.notification.timer = 120;
                this.ui.notification.alpha = 1.0;
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
        // Evitar múltiplas chamadas se já estiver no estado gameOver
        if (this.gameState === 'gameOver') return;
        
        // Atualizar estado do jogo
        this.gameState = 'gameOver';
        this.ui.hidePauseButton();
        
        // Atualizar recorde se necessário
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('flyflypotter_highscore', this.highScore);
        }
        
        // Parar a animação do jogo
        cancelAnimationFrame(this.animationFrameId);
        
        // Garantir que a interface permita interações
        const uiLayer = document.getElementById('ui-layer');
        if (uiLayer) {
            uiLayer.classList.remove('pointer-events-none');
            uiLayer.classList.add('pointer-events-auto');
        }
        
        // Exibir tela de Game Over com um pequeno atraso
        setTimeout(() => {
            this.ui.showGameOverScreen(this.score, this.highScore);
            
            // Verificação adicional para garantir que a tela aparece
            setTimeout(() => {
                const gameOverScreen = document.getElementById('gameOverScreen');
                if (gameOverScreen && 
                    (gameOverScreen.style.display !== 'block' || 
                     gameOverScreen.classList.contains('hidden'))) {
                    this.ui.showGameOverScreen(this.score, this.highScore);
                }
            }, 300);
        }, 100);
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
        console.log("Resolvendo evento de feitiço...");
        
        // Efeito visual de luz ao lançar o feitiço
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.8)';
            setTimeout(() => {
                canvas.style.boxShadow = 'none';
            }, 500);
        }
        
        // Desativar o dementador com animação
        if (this.dementor.active) {
            // Efeito de "desaparecimento" - poderia ser substituído por uma animação mais elaborada
            this.dementor.active = false;
            this.dementor.x = -this.dementor.width; // Mover para fora da tela
        }
        
        // Ocultar o modal de feitiço
        this.ui.hideSpellModal();
        
        // Voltar ao estado normal do jogo se não for game over
        if (this.gameState !== 'gameOver') {
            this.gameState = 'playing';
            
            // Dar um breve período de invencibilidade após lançar o feitiço
            this.player.setInvincible(60);
            
            // Mostrar notificação de sucesso
            this.ui.notification.text = "Expecto Patronum!";
            this.ui.notification.timer = 180; // Duração maior para melhor visibilidade
            this.ui.notification.alpha = 1.0;
            
            // Bônus de pontuação por derrotar o dementador
            this.score += 25;
        }
    }
    
    returnToMenu() {
        console.log("Retornando ao menu principal...");
        this.gameState = 'start';
        this.ui.hidePauseMenu();
        this.ui.hidePauseButton();
        
        // Sempre ocultar a tela de game over quando voltamos ao menu
        // Isso garante que ela não ficará visível quando for acessada pelo botão "Menu Principal"
        this.ui.hideGameOverScreen(() => {
            // Reiniciar o jogo antes de mostrar a tela inicial
            this.resetGame();
            
            // Forçar a exibição dos elementos da tela inicial
            const startScreen = document.getElementById('startScreen');
            if (startScreen) {
                startScreen.style.display = 'block';
                startScreen.style.visibility = 'visible';
                startScreen.style.opacity = '1';
                startScreen.classList.remove('hidden');
                startScreen.classList.remove('fade-out');
            }
            
            // Reconfiguramos os seletores de personagens e vassouras
            if (this.ui.characterSelectionContainer) {
                this.ui.characterSelectionContainer.style.display = 'flex';
                this.ui.setupCharacterSelection((charKey) => {
                    console.log("Personagem selecionado ao voltar ao menu:", charKey);
                    this.selectedCharacterKey = charKey;
                    this.drawInitialScreen();
                });
            }
            
            if (this.ui.broomSelectionContainer) {
                this.ui.broomSelectionContainer.style.display = 'flex';
                this.ui.setupBroomSelection((broomKey) => {
                    console.log("Vassoura selecionada ao voltar ao menu:", broomKey);
                    this.selectedBroomKey = broomKey;
                    this.drawInitialScreen();
                });
            }
            
            this.ui.showStartScreen();
            this.drawInitialScreen();
        });
    }
    
    restartFromGameOver() {
        console.log("Reiniciando jogo após Game Over");
        // Reinicia com o mesmo personagem e vassoura
        
        // Certifique-se de que a animação anterior foi cancelada
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        this.ui.hideGameOverScreen(() => {
            this.resetGame();
            this.gameState = 'playing';
            
            // Mostrar o botão de pausa após reiniciar o jogo
            this.ui.showPauseButton();
            
            // Iniciar o loop do jogo
            this.gameLoop();
            
            console.log("Jogo reiniciado e botão de pausa exibido");
        });
    }
    
    handleInput() {
        if (this.gameState === 'playing') {
            this.player.flap();
        }
    }
}
