// Gerencia a interface do usuário do jogo
class UIManager {
    constructor() {
        // Verificar e registrar elementos importantes
        console.log("UIManager construtor iniciado");
        
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.pauseMenu = document.getElementById('pauseMenu');
        this.spellModal = document.getElementById('spellModal');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.resumeButton = document.getElementById('resumeButton');
        this.soundButton = document.getElementById('soundButton');
        this.menuButton = document.getElementById('menuButton');
        this.spellButton = document.getElementById('spellButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.finalScoreEl = document.getElementById('finalScore');
        this.timerBarInner = document.getElementById('timerBarInner');
        this.broomSelectionContainer = document.getElementById('broomSelection');
        this.characterSelectionContainer = document.getElementById('characterSelection');
        
        console.log("Elementos UI encontrados:", {
            startScreen: this.startScreen,
            broomSelectionContainer: this.broomSelectionContainer,
            characterSelectionContainer: this.characterSelectionContainer
        });
        
        // Notificação de cenário
        this.notification = { text: '', timer: 0, alpha: 0 };
    }
    
    setupEventListeners(game) {
        console.log("Configurando eventos de UI");
        
        // Verifica se o botão start existe
        if (!this.startButton) {
            console.error("Botão iniciar jogo não encontrado!");
            
            // Tenta encontrá-lo novamente
            this.startButton = document.getElementById('startButton');
            if (!this.startButton) {
                console.error("Botão iniciar jogo realmente não existe!");
                
                // Cria o botão se não existir
                const startScreen = document.getElementById('startScreen');
                if (startScreen) {
                    console.log("Criando botão iniciar jogo...");
                    this.startButton = document.createElement('button');
                    this.startButton.id = 'startButton';
                    this.startButton.className = 'button-style text-base sm:text-lg';
                    this.startButton.textContent = 'Iniciar Jogo';
                    this.startButton.style.marginTop = '10px';
                    this.startButton.style.padding = '8px 16px';
                    this.startButton.style.display = 'block';
                    this.startButton.style.width = '100%';
                    startScreen.appendChild(this.startButton);
                }
            }
        }
        
        // Adiciona evento ao botão iniciar
        if (this.startButton) {
            console.log("Adicionando evento ao botão iniciar");
            this.startButton.addEventListener('click', (e) => { 
                console.log("Botão iniciar clicado!");
                e.stopPropagation(); 
                game.startGame(); 
            });
        }
        
        // Outros botões
        if (this.pauseButton) {
            this.pauseButton.addEventListener('click', (e) => {
                e.stopPropagation();
                game.togglePause();
            });
        }
        
        if (this.resumeButton) {
            this.resumeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                game.togglePause();
            });
        }

        if (this.soundButton) {
            this.soundButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const isSoundOn = audioManager.toggleSound();
                this.soundButton.textContent = `Som: ${isSoundOn ? 'Ligado' : 'Desligado'}`;
            });
        }

        if (this.menuButton) {
            this.menuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                game.returnToMenu();
            });
        }

        this.restartButton.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            game.restartFromGameOver();
        });

        this.spellButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (game.gameState !== 'spellCasting') return;
            audioManager.playSfx(audioManager.sfx.patronus, ["C4", "E4", "G4"], "2n", Tone.now());
            game.score += 10;
            game.resolveSpellEvent();
        });
        
        window.addEventListener('mousedown', () => game.handleInput());
        window.addEventListener('touchstart', (e) => { 
            e.preventDefault(); 
            game.handleInput(); 
        });
        window.addEventListener('keydown', (e) => { 
            if (e.code === 'Space') { game.handleInput(); }
            if (e.code === 'Escape' || e.code === 'KeyP') { game.togglePause(); }
        });
    }
    
    setupCharacterSelection(onCharacterSelected) {
        console.log("Configurando seleção de personagens");
        
        if (!this.characterSelectionContainer) {
            console.error("Container de seleção de personagens não encontrado!");
            return;
        }
        
        this.characterSelectionContainer.innerHTML = '';
        this.characterSelectionContainer.style.display = "flex";
        this.characterSelectionContainer.style.justifyContent = "center";
        this.characterSelectionContainer.style.gap = "10px";
        
        Object.keys(CONFIG.characters).forEach(key => {
            const char = CONFIG.characters[key];
            const container = document.createElement('div');
            container.className = 'selection-container text-center';
            container.dataset.char = key;
            container.style.width = "64px";
            container.style.maxHeight = "80px";

            const portraitCanvas = document.createElement('canvas');
            portraitCanvas.width = 40;
            portraitCanvas.height = 40;
            portraitCanvas.style.width = "40px";
            portraitCanvas.style.height = "40px";
            
            const charCtx = portraitCanvas.getContext('2d');
            charCtx.imageSmoothingEnabled = false;
            this.drawCharacterPreview(charCtx, key);
            
            const nameP = document.createElement('p');
            nameP.className = 'text-xs mt-1';
            nameP.textContent = char.name.split(' ')[0];
            nameP.style.fontSize = "8px";
            nameP.style.marginTop = "4px";

            container.appendChild(portraitCanvas);
            container.appendChild(nameP);
            
            container.addEventListener('click', () => {
                console.log("Personagem selecionado:", key);
                onCharacterSelected(key);
                document.querySelectorAll('#characterSelection .selection-container').forEach(el => el.classList.remove('selected'));
                container.classList.add('selected');
            });

            this.characterSelectionContainer.appendChild(container);
        });
        
        const firstChar = document.querySelector('#characterSelection .selection-container');
        if (firstChar) {
            firstChar.classList.add('selected');
            console.log("Primeiro personagem selecionado por padrão");
        } else {
            console.error("Nenhum personagem disponível para seleção");
        }
    }
    
    setupBroomSelection(onBroomSelected) {
        console.log("Configurando seleção de vassouras");
        
        if (!this.broomSelectionContainer) {
            console.error("Container de seleção de vassouras não encontrado!");
            return;
        }
        
        this.broomSelectionContainer.innerHTML = '';
        this.broomSelectionContainer.style.display = "flex";
        this.broomSelectionContainer.style.justifyContent = "center";
        this.broomSelectionContainer.style.gap = "10px";
        
        Object.keys(CONFIG.brooms).forEach(key => {
            const broom = CONFIG.brooms[key];
            const container = document.createElement('div');
            container.className = 'selection-container text-center';
            container.dataset.broom = key;
            container.style.width = "64px";
            container.style.maxHeight = "80px";

            const portraitCanvas = document.createElement('canvas');
            portraitCanvas.width = 48;
            portraitCanvas.height = 24;
            portraitCanvas.style.width = "48px";
            portraitCanvas.style.height = "24px";

            const broomCtx = portraitCanvas.getContext('2d');
            broomCtx.imageSmoothingEnabled = false;
            this.drawBroomPreview(broomCtx, key);

            const nameP = document.createElement('p');
            nameP.className = 'text-xs mt-1';
            nameP.textContent = broom.name;
            nameP.style.fontSize = "8px";
            nameP.style.marginTop = "4px";

            container.appendChild(portraitCanvas);
            container.appendChild(nameP);

            container.addEventListener('click', () => {
                console.log("Vassoura selecionada:", key);
                onBroomSelected(key);
                document.querySelectorAll('#broomSelection .selection-container').forEach(el => el.classList.remove('selected'));
                container.classList.add('selected');
            });

            this.broomSelectionContainer.appendChild(container);
        });
        
        const firstBroom = document.querySelector('#broomSelection .selection-container');
        if (firstBroom) {
            firstBroom.classList.add('selected');
            console.log("Primeira vassoura selecionada por padrão");
        } else {
            console.error("Nenhuma vassoura disponível para seleção");
        }
    }
    
    drawCharacterPreview(charCtx, charKey) {
        const char = CONFIG.characters[charKey];
        const canvasWidth = charCtx.canvas.width;
        const canvasHeight = charCtx.canvas.height;
        const p = 4;

        charCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        const faceX = canvasWidth / 2 - (4 * p) / 2;
        const faceY = canvasHeight / 2 - (4 * p) / 2;
        charCtx.fillStyle = '#FDE68A';
        charCtx.fillRect(faceX, faceY, 4 * p, 4 * p);

        charCtx.fillStyle = char.hairColor;
        if (charKey === 'hermione') {
            charCtx.fillRect(faceX - p, faceY - p, 6 * p, 2 * p);
            charCtx.fillRect(faceX - p, faceY + p, p, 4 * p);
            charCtx.fillRect(faceX + 4 * p, faceY + p, p, 4 * p);
            charCtx.fillRect(faceX, faceY + 4*p, 4*p, p);
        } else {
            charCtx.fillRect(faceX, faceY - p/2, 4 * p, p * 1.5);
            charCtx.fillRect(faceX - p/2, faceY + p, p, p);
            charCtx.fillRect(faceX + 4*p - p/2, faceY + p, p, p);
        }

        if (char.hasGlasses) {
            charCtx.fillStyle = '#111827';
            charCtx.fillRect(faceX + p/2, faceY + p * 1.5, p, p);
            charCtx.fillRect(faceX + p*2.5, faceY + p * 1.5, p, p);
            charCtx.fillRect(faceX + p/2 + p, faceY + p * 2, p, p/2);
        }
    }

    drawBroomPreview(broomCtx, broomKey) {
        const broom = CONFIG.brooms[broomKey];
        const canvasWidth = broomCtx.canvas.width;
        const canvasHeight = broomCtx.canvas.height;
        const p = 2; // Pixel pequeno para o preview

        broomCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Centralizar a vassoura no canvas
        const broomY = canvasHeight / 2 - (p*1.5)/2;

        // Cerdas da vassoura (parte traseira)
        broomCtx.fillStyle = '#FBBF24';
        broomCtx.fillRect(canvasWidth/2 - 10*p, broomY, 3*p, p*1.5);

        // Cabo da vassoura
        broomCtx.fillStyle = broom.color;
        broomCtx.fillRect(canvasWidth/2 - 7*p, broomY, 8*p, p*1.5);

        if (broomKey === 'firebolt') {
            broomCtx.fillStyle = '#FFD700';
            broomCtx.fillRect(canvasWidth/2 - p, broomY, p, p*1.5);
        }
        
        console.log(`Vassoura ${broomKey} desenhada com tamanho ${canvasWidth}x${canvasHeight}`);
    }
    
    showStartScreen() {
        if (!this.startScreen) {
            console.error("startScreen não encontrado");
            return;
        }
        
        // Garantir que a tela inicial esteja visível
        this.startScreen.classList.remove('hidden');
        this.startScreen.style.display = 'block';
        this.startScreen.style.visibility = 'visible';
        this.startScreen.style.opacity = '1';
        this.startScreen.style.zIndex = '100';
        this.startScreen.classList.add('fade-in');
        
        setTimeout(() => this.startScreen.classList.remove('fade-in'), 500);
        
        console.log("Tela inicial mostrada", this.startScreen);
    }
    
    hideStartScreen(callback) {
        this.startScreen.classList.add('fade-out');
        this.pauseButton.classList.remove('hidden');
        
        setTimeout(() => {
            this.startScreen.classList.add('hidden');
            this.startScreen.classList.remove('fade-out');
            
            if (callback) callback();
        }, 500);
    }
    
    showGameOverScreen(score, highScore) {
        this.finalScoreEl.textContent = score;
        this.gameOverScreen.classList.remove('hidden');
    }
    
    hideGameOverScreen(callback) {
        this.gameOverScreen.classList.add('fade-out');
        
        setTimeout(() => {
            this.gameOverScreen.classList.add('hidden');
            this.gameOverScreen.classList.remove('fade-out');
            
            if (callback) callback();
        }, 500);
    }
    
    showPauseMenu() {
        this.pauseMenu.classList.remove('hidden');
    }
    
    hidePauseMenu() {
        this.pauseMenu.classList.add('hidden');
    }
    
    showSpellModal() {
        this.spellModal.classList.remove('hidden');
    }
    
    hideSpellModal() {
        this.spellModal.classList.add('hidden');
    }
    
    showPauseButton() {
        this.pauseButton.classList.remove('hidden');
    }
    
    hidePauseButton() {
        this.pauseButton.classList.add('hidden');
    }
    
    updateSpellTimerBar(percentage) {
        this.timerBarInner.style.width = `${percentage}%`;
    }
    
    showScenarioNotification(newScenario) {
        if (newScenario === 'forest') {
            this.notification.text = "Floresta Proibida";
        } else if (newScenario === 'quidditch') {
            this.notification.text = "Campo de Quadribol";
        }
        this.notification.timer = 180;
        this.notification.alpha = 1.0;
    }
    
    drawNotification(ctx) {
        if (this.notification.timer > 0) {
            ctx.save();
            if (this.notification.timer < 60) {
                this.notification.alpha = this.notification.timer / 60;
            }
            ctx.globalAlpha = this.notification.alpha;
            ctx.fillStyle = '#FFF';
            ctx.font = '24px "Press Start 2P"';
            ctx.textAlign = "center";
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 5;
            ctx.fillText(this.notification.text, CONFIG.BASE_WIDTH / 2, CONFIG.BASE_HEIGHT / 2);
            this.notification.timer--;
            ctx.restore();
        }
    }
    
    drawScore(ctx, score) {
        ctx.fillStyle = '#FFF';
        ctx.font = '36px "Press Start 2P"';
        ctx.textAlign = "center";
        ctx.fillText(score, CONFIG.BASE_WIDTH / 2, 75);
    }
    
    drawLives(ctx, lives) {
        const padding = 15;
        const heartPixelSize = 5;
        const heartSpacing = 35;

        for (let i = 0; i < lives; i++) {
            const startX = padding + i * heartSpacing;
            const startY = padding;
            
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(startX + heartPixelSize, startY, heartPixelSize, heartPixelSize);
            ctx.fillRect(startX + heartPixelSize * 3, startY, heartPixelSize, heartPixelSize);
            ctx.fillRect(startX, startY + heartPixelSize, heartPixelSize * 5, heartPixelSize);
            ctx.fillRect(startX + heartPixelSize, startY + heartPixelSize * 2, heartPixelSize * 3, heartPixelSize);
            ctx.fillRect(startX + heartPixelSize * 2, startY + heartPixelSize * 3, heartPixelSize, heartPixelSize);
        }
    }
}
