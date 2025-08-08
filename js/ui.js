// Gerencia a interface do usuário do jogo
class UIManager {
    constructor() {
        // Capturar e armazenar referências a elementos importantes da interface
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.pauseMenu = document.getElementById('pauseMenu');
        this.spellModal = document.getElementById('spellModal');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.resumeButton = document.getElementById('resumeButton');
        this.soundButton = document.getElementById('soundButton');
        this.menuButton = document.getElementById('menuButton');
        this.menuFromGameOverButton = document.getElementById('menuFromGameOverButton');
        this.spellButton = document.getElementById('spellButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.finalScoreEl = document.getElementById('finalScore');
        this.timerBarInner = document.getElementById('timerBarInner');
        this.broomSelectionContainer = document.getElementById('broomSelection');
        this.characterSelectionContainer = document.getElementById('characterSelection');
        
        // Garantir que o ui-layer permita interações
        const uiLayer = document.getElementById('ui-layer');
        if (uiLayer) {
            uiLayer.classList.remove('pointer-events-none');
            uiLayer.classList.add('pointer-events-auto');
        }
        
        // Notificação de cenário
        this.notification = { text: '', timer: 0, alpha: 0 };
        
        // Configurar observador para a tela de Game Over
        this.setupGameOverObserver();
    }
    
    // Monitora e corrige problemas com a tela de Game Over
    setupGameOverObserver() {
        if (!this.gameOverScreen) return;
        
        const self = this;
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Quando a tela de Game Over muda, verificamos se os botões estão funcionando
                if (self.gameOverScreen.style.display === 'block' && 
                    self.gameOverScreen.style.visibility === 'visible') {
                    self.ensureGameOverButtonsFunctionality();
                }
            });
        });
        
        // Observar mudanças na tela de Game Over
        observer.observe(this.gameOverScreen, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }
    
    // Garante que os botões da tela de Game Over funcionem corretamente
    ensureGameOverButtonsFunctionality() {
        // Verificar se temos acesso ao jogo
        if (!window.game) return;
        
        // Garantir que o botão "Tentar Novamente" funcione
        if (this.restartButton) {
            this.restartButton.style.pointerEvents = 'auto';
            this.restartButton.style.cursor = 'pointer';
        }
        
        // Garantir que o botão "Menu Principal" funcione
        if (this.menuFromGameOverButton) {
            this.menuFromGameOverButton.style.pointerEvents = 'auto';
            this.menuFromGameOverButton.style.cursor = 'pointer';
        }
    }
    
    setupEventListeners(game) {
        // Verificar e garantir elementos da UI
        this.ensureUIElements();
        
        // Armazenar a referência ao jogo para acesso global
        window.game = game;
        
        // Configurar botão iniciar com addEventListener
        if (this.startButton) {
            const newStartButton = this.startButton.cloneNode(true);
            this.startButton.parentNode.replaceChild(newStartButton, this.startButton);
            this.startButton = newStartButton;
            
            this.startButton.addEventListener('click', (e) => { 
                e.stopPropagation();
                e.preventDefault();
                console.log("Botão iniciar clicado");
                game.startGame();
                return false;
            });
        }
        
        // Configurar botão de pausa com addEventListener
        if (this.pauseButton) {
            const newPauseButton = this.pauseButton.cloneNode(true);
            this.pauseButton.parentNode.replaceChild(newPauseButton, this.pauseButton);
            this.pauseButton = newPauseButton;
            
            // Estilizar o botão de pausa para ser mais visível
            this.pauseButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            this.pauseButton.style.color = '#F6E05E';
            this.pauseButton.style.border = '2px solid #F6E05E';
            this.pauseButton.style.cursor = 'pointer';
            this.pauseButton.style.zIndex = '100';
            this.pauseButton.style.pointerEvents = 'auto';
            
            this.pauseButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log("Botão de pausa clicado");
                game.togglePause();
                return false;
            });
        }
        
        // Configurar botão de retomar jogo com addEventListener
        if (this.resumeButton) {
            const newResumeButton = this.resumeButton.cloneNode(true);
            this.resumeButton.parentNode.replaceChild(newResumeButton, this.resumeButton);
            this.resumeButton = newResumeButton;
            
            this.resumeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log("Botão retomar clicado");
                game.togglePause();
                return false;
            });
        }
        
        // Configurar botão de som com addEventListener
        if (this.soundButton) {
            const newSoundButton = this.soundButton.cloneNode(true);
            this.soundButton.parentNode.replaceChild(newSoundButton, this.soundButton);
            this.soundButton = newSoundButton;
            
            this.soundButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log("Botão de som clicado");
                const isSoundOn = audioManager.toggleSound();
                this.soundButton.textContent = `Som: ${isSoundOn ? 'Ligado' : 'Desligado'}`;
                return false;
            });
        }
        
        // Configurar botão de menu no pauseMenu com addEventListener
        if (this.menuButton) {
            const newMenuButton = this.menuButton.cloneNode(true);
            this.menuButton.parentNode.replaceChild(newMenuButton, this.menuButton);
            this.menuButton = newMenuButton;
            
            this.menuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log("Botão de menu clicado");
                game.returnToMenu();
                return false;
            });
        }
        
        // Configuração inicial do botão de feitiço
        // Uma configuração mais completa é feita em setupSpellButton
        this.setupSpellButton();
        
        // Configurar os botões da tela Game Over
        this.setupGameOverButtons();
        
        // Configurar eventos globais de input
        window.addEventListener('mousedown', () => game.handleInput());
        window.addEventListener('touchstart', (e) => { 
            e.preventDefault(); 
            game.handleInput(); 
        });
        window.addEventListener('keydown', (e) => { 
            if (e.code === 'Space' && game.gameState === 'playing') { 
                game.handleInput(); 
            }
            if (e.code === 'Escape' || e.code === 'KeyP') { 
                game.togglePause(); 
            }
        });
        
        console.log("Todos os eventos de UI configurados com sucesso");
    }
    
    // Garante que todos os elementos da UI existem
    ensureUIElements() {
        if (!this.startButton) this.startButton = document.getElementById('startButton');
        if (!this.pauseButton) this.pauseButton = document.getElementById('pauseButton');
        if (!this.resumeButton) this.resumeButton = document.getElementById('resumeButton');
        if (!this.soundButton) this.soundButton = document.getElementById('soundButton');
        if (!this.menuButton) this.menuButton = document.getElementById('menuButton');
        if (!this.spellButton) this.spellButton = document.getElementById('spellButton');
        if (!this.restartButton) this.restartButton = document.getElementById('restartButton');
        if (!this.menuFromGameOverButton) this.menuFromGameOverButton = document.getElementById('menuFromGameOverButton');
    }
    
    setupCharacterSelection(onCharacterSelected) {
        this.characterSelectionContainer.innerHTML = '';
        Object.keys(CONFIG.characters).forEach(key => {
            const char = CONFIG.characters[key];
            const container = document.createElement('div');
            container.className = 'selection-container text-center';
            container.dataset.char = key;

            const portraitCanvas = document.createElement('canvas');
            portraitCanvas.width = 56;
            portraitCanvas.height = 56;
            
            const charCtx = portraitCanvas.getContext('2d');
            charCtx.imageSmoothingEnabled = false;
            this.drawCharacterPreview(charCtx, key);
            
            const nameP = document.createElement('p');
            nameP.className = 'text-xs mt-1';
            nameP.textContent = char.name.split(' ')[0];

            container.appendChild(portraitCanvas);
            container.appendChild(nameP);
            
            container.addEventListener('click', () => {
                onCharacterSelected(key);
                document.querySelectorAll('#characterSelection .selection-container').forEach(el => el.classList.remove('selected'));
                container.classList.add('selected');
            });

            this.characterSelectionContainer.appendChild(container);
        });
        document.querySelector('#characterSelection .selection-container').classList.add('selected');
    }
    
    setupBroomSelection(onBroomSelected) {
        this.broomSelectionContainer.innerHTML = '';
        Object.keys(CONFIG.brooms).forEach(key => {
            const broom = CONFIG.brooms[key];
            const container = document.createElement('div');
            container.className = 'selection-container text-center';
            container.dataset.broom = key;

            const portraitCanvas = document.createElement('canvas');
            portraitCanvas.width = 64;
            portraitCanvas.height = 32;

            const broomCtx = portraitCanvas.getContext('2d');
            broomCtx.imageSmoothingEnabled = false;
            this.drawBroomPreview(broomCtx, key);

            const nameP = document.createElement('p');
            nameP.className = 'text-xs mt-1';
            nameP.textContent = broom.name;

            container.appendChild(portraitCanvas);
            container.appendChild(nameP);

            container.addEventListener('click', () => {
                onBroomSelected(key);
                document.querySelectorAll('#broomSelection .selection-container').forEach(el => el.classList.remove('selected'));
                container.classList.add('selected');
            });

            this.broomSelectionContainer.appendChild(container);
        });
        document.querySelector('#broomSelection .selection-container').classList.add('selected');
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
        // Reduzir o tamanho do pixel para a vassoura ficar menor
        const p = 2;

        broomCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Centralizar a vassoura no canvas
        const broomY = canvasHeight / 2 - (p*1.5)/2;
        const startX = canvasWidth / 2 - (11*p) / 2;

        // Cerdas da vassoura (parte traseira)
        broomCtx.fillStyle = '#FBBF24';
        broomCtx.fillRect(startX, broomY, 3*p, p*1.5);

        // Cabo da vassoura
        broomCtx.fillStyle = broom.color;
        broomCtx.fillRect(startX + 3*p, broomY, 8*p, p*1.5);

        if (broomKey === 'firebolt') {
            broomCtx.fillStyle = '#FFD700';
            broomCtx.fillRect(startX + 9*p, broomY, p, p*1.5);
        }
        
        console.log(`Vassoura ${broomKey} desenhada em tamanho reduzido no canvas ${canvasWidth}x${canvasHeight}`);
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
        
        // Garantir que os contêineres de seleção estejam visíveis
        if (this.characterSelectionContainer) {
            this.characterSelectionContainer.style.display = 'flex';
            this.characterSelectionContainer.style.visibility = 'visible';
            this.characterSelectionContainer.style.opacity = '1';
            
            // Recriar os seletores de personagem se estiverem vazios
            if (this.characterSelectionContainer.children.length === 0) {
                this.setupCharacterSelection((charKey) => {
                    console.log("Personagem selecionado na reinicialização:", charKey);
                });
            }
        }
        
        if (this.broomSelectionContainer) {
            this.broomSelectionContainer.style.display = 'flex';
            this.broomSelectionContainer.style.visibility = 'visible';
            this.broomSelectionContainer.style.opacity = '1';
            
            // Recriar os seletores de vassouras se estiverem vazios
            if (this.broomSelectionContainer.children.length === 0) {
                this.setupBroomSelection((broomKey) => {
                    console.log("Vassoura selecionada na reinicialização:", broomKey);
                });
            }
        }
        
        setTimeout(() => this.startScreen.classList.remove('fade-in'), 500);
        
        console.log("Tela inicial mostrada", this.startScreen);
    }
    
    hideStartScreen(callback) {
        this.startScreen.classList.add('fade-out');
        this.pauseButton.classList.remove('hidden');
        
        // Garantir que os contêineres de seleção também sejam ocultados
        if (this.characterSelectionContainer) {
            this.characterSelectionContainer.style.display = 'none';
        }
        
        if (this.broomSelectionContainer) {
            this.broomSelectionContainer.style.display = 'none';
        }
        
        setTimeout(() => {
            this.startScreen.classList.add('hidden');
            this.startScreen.classList.remove('fade-out');
            this.startScreen.style.display = 'none';
            
            if (callback) callback();
        }, 500);
    }
    
    showGameOverScreen(score, highScore) {
        // Verificar elementos necessários
        if (!this.gameOverScreen) {
            this.gameOverScreen = document.getElementById('gameOverScreen');
            if (!this.gameOverScreen) return;
        }
        
        if (!this.finalScoreEl) {
            this.finalScoreEl = document.getElementById('finalScore');
            if (!this.finalScoreEl) return;
        }
        
        // Atualizar pontuação e recorde
        this.finalScoreEl.textContent = score;
        
        const highScoreDisplay = document.getElementById('highScoreDisplay');
        if (highScoreDisplay) {
            highScoreDisplay.textContent = highScore;
        }
        
        // Destacar nova pontuação recorde
        if (score >= highScore && score > 0) {
            this.finalScoreEl.classList.add('text-yellow-300');
            this.finalScoreEl.classList.add('text-glow');
        } else {
            this.finalScoreEl.classList.remove('text-yellow-300');
            this.finalScoreEl.classList.remove('text-glow');
        }
        
        // Garantir visibilidade da tela de Game Over
        this.gameOverScreen.classList.remove('hidden');
        this.gameOverScreen.classList.remove('fade-out');
        this.gameOverScreen.style.display = 'block';
        this.gameOverScreen.style.visibility = 'visible';
        this.gameOverScreen.style.opacity = '1';
        this.gameOverScreen.style.zIndex = '200';
        
        // Configurar botões
        this.setupGameOverButtons();
        
        // Garantir que o ui-layer permita eventos
        const uiLayer = document.getElementById('ui-layer');
        if (uiLayer) {
            uiLayer.classList.remove('pointer-events-none');
            uiLayer.classList.add('pointer-events-auto');
        }
    }
    
    // Método separado para configurar os botões da tela Game Over
    setupGameOverButtons() {
        // Configurar botão "Tentar Novamente"
        const restartButton = document.getElementById('restartButton');
        if (restartButton) {
            // Limpar eventos anteriores
            const newRestartButton = restartButton.cloneNode(true);
            restartButton.parentNode.replaceChild(newRestartButton, restartButton);
            this.restartButton = newRestartButton;
            
            // Garantir visibilidade e interatividade
            this.restartButton.style.pointerEvents = 'auto';
            this.restartButton.style.cursor = 'pointer';
            this.restartButton.disabled = false;
            
            // Adicionar evento de clique
            this.restartButton.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (window.game) window.game.restartFromGameOver();
                return false;
            };
        }
        
        // Configurar botão "Menu Principal"
        const menuButton = document.getElementById('menuFromGameOverButton');
        if (menuButton) {
            // Limpar eventos anteriores
            const newMenuButton = menuButton.cloneNode(true);
            menuButton.parentNode.replaceChild(newMenuButton, menuButton);
            this.menuFromGameOverButton = newMenuButton;
            
            // Garantir visibilidade e interatividade
            this.menuFromGameOverButton.style.pointerEvents = 'auto';
            this.menuFromGameOverButton.style.cursor = 'pointer';
            this.menuFromGameOverButton.disabled = false;
            
            // Adicionar evento de clique
            this.menuFromGameOverButton.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (window.game) window.game.returnToMenu();
                return false;
            };
        }
    }
    
    hideGameOverScreen(callback) {
        if (!this.gameOverScreen) {
            console.error("Game Over Screen não encontrada!");
            if (callback) callback();
            return;
        }
        
        this.gameOverScreen.classList.add('fade-out');
        
        // Garantir que a tela de Game Over realmente fica oculta
        setTimeout(() => {
            this.gameOverScreen.classList.add('hidden');
            this.gameOverScreen.classList.remove('fade-out');
            this.gameOverScreen.style.display = 'none'; // Forçar display none
            this.gameOverScreen.style.visibility = 'hidden'; // Forçar visibility hidden
            this.gameOverScreen.style.opacity = '0'; // Forçar opacity 0
            
            // Garantir que o ui-layer esteja com pointer-events auto
            const uiLayer = document.getElementById('ui-layer');
            if (uiLayer) {
                uiLayer.classList.remove('pointer-events-none');
                uiLayer.classList.add('pointer-events-auto');
            }
            
            if (callback) callback();
        }, 500);
    }
    
    showPauseMenu() {
        if (!this.pauseMenu) {
            this.pauseMenu = document.getElementById('pauseMenu');
            if (!this.pauseMenu) return;
        }
        
        // Remover classes que possam estar ocultando o menu
        this.pauseMenu.classList.remove('hidden');
        this.pauseMenu.classList.remove('fade-out');
        
        // Forçar visibilidade do menu com estilo inline explícito
        this.pauseMenu.style.display = 'block';
        this.pauseMenu.style.visibility = 'visible';
        this.pauseMenu.style.opacity = '1';
        this.pauseMenu.style.zIndex = '250'; // Colocar acima de outros elementos
        this.pauseMenu.style.position = 'absolute';
        this.pauseMenu.style.top = '50%';
        this.pauseMenu.style.left = '50%';
        this.pauseMenu.style.transform = 'translate(-50%, -50%)';
        this.pauseMenu.style.pointerEvents = 'auto';
        
        // Garantir que o ui-layer permita eventos
        const uiLayer = document.getElementById('ui-layer');
        if (uiLayer) {
            uiLayer.classList.remove('pointer-events-none');
            uiLayer.classList.add('pointer-events-auto');
        }
        
        // Atualizar o botão de som com o estado atual
        if (this.soundButton && window.audioManager) {
            const isSoundOn = window.audioManager.isSoundOn();
            this.soundButton.textContent = `Som: ${isSoundOn ? 'Ligado' : 'Desligado'}`;
        }
        
        console.log("Menu de pausa exibido:", this.pauseMenu);
    }
    
    hidePauseMenu() {
        if (!this.pauseMenu) {
            this.pauseMenu = document.getElementById('pauseMenu');
            if (!this.pauseMenu) return;
        }
        
        // Ocultar o menu com métodos completos
        this.pauseMenu.classList.add('hidden');
        this.pauseMenu.classList.add('fade-out');
        this.pauseMenu.style.display = 'none';
        this.pauseMenu.style.visibility = 'hidden';
        this.pauseMenu.style.opacity = '0';
        
        console.log("Menu de pausa ocultado");
    }
    
    showSpellModal() {
        // Garantir que o modal de feitiço esteja completamente visível e interativo
        if (!this.spellModal) {
            this.spellModal = document.getElementById('spellModal');
            if (!this.spellModal) return;
        }
        
        // Remover classes que possam estar ocultando o modal
        this.spellModal.classList.remove('hidden');
        this.spellModal.classList.remove('fade-out');
        
        // Forçar visibilidade do modal com estilo inline explícito
        this.spellModal.style.display = 'block';
        this.spellModal.style.visibility = 'visible';
        this.spellModal.style.opacity = '1';
        this.spellModal.style.zIndex = '300'; // Colocar acima de outros elementos
        this.spellModal.style.position = 'absolute';
        this.spellModal.style.top = '50%';
        this.spellModal.style.left = '50%';
        this.spellModal.style.transform = 'translate(-50%, -50%)';
        this.spellModal.style.pointerEvents = 'auto';
        
        // Garantir que o botão de feitiço esteja funcional
        this.setupSpellButton();
        
        // Garantir que o ui-layer permita eventos
        const uiLayer = document.getElementById('ui-layer');
        if (uiLayer) {
            uiLayer.classList.remove('pointer-events-none');
            uiLayer.classList.add('pointer-events-auto');
        }
        
        console.log("Modal de feitiço exibido:", this.spellModal);
    }
    
    hideSpellModal() {
        if (!this.spellModal) {
            this.spellModal = document.getElementById('spellModal');
            if (!this.spellModal) return;
        }
        
        // Ocultar o modal com métodos completos
        this.spellModal.classList.add('hidden');
        this.spellModal.classList.add('fade-out');
        this.spellModal.style.display = 'none';
        this.spellModal.style.visibility = 'hidden';
        this.spellModal.style.opacity = '0';
        
        // Limpar o evento de keydown específico do feitiço
        if (this._spellKeyHandler) {
            window.removeEventListener('keydown', this._spellKeyHandler);
        }
        
        console.log("Modal de feitiço ocultado");
    }
    
    showPauseButton() {
        if (!this.pauseButton) {
            this.pauseButton = document.getElementById('pauseButton');
            if (!this.pauseButton) return;
        }
        
        // Remover a classe hidden
        this.pauseButton.classList.remove('hidden');
        
        // Forçar visibilidade
        this.pauseButton.style.display = 'block';
        this.pauseButton.style.visibility = 'visible';
        this.pauseButton.style.opacity = '1';
        
        // Garantir interatividade
        this.pauseButton.style.pointerEvents = 'auto';
        this.pauseButton.style.cursor = 'pointer';
        
        console.log("Botão de pausa exibido");
    }
    
    hidePauseButton() {
        if (!this.pauseButton) {
            this.pauseButton = document.getElementById('pauseButton');
            if (!this.pauseButton) return;
        }
        
        // Adicionar a classe hidden
        this.pauseButton.classList.add('hidden');
        
        // Forçar invisibilidade
        this.pauseButton.style.display = 'none';
        this.pauseButton.style.visibility = 'hidden';
        this.pauseButton.style.opacity = '0';
        
        console.log("Botão de pausa ocultado");
    }
    
    // Configura o botão de feitiço para garantir que funcione
    setupSpellButton() {
        if (!this.spellButton) {
            this.spellButton = document.getElementById('spellButton');
            if (!this.spellButton) return;
        }
        
        // Remover qualquer evento anterior para evitar duplicação
        const newSpellButton = this.spellButton.cloneNode(true);
        this.spellButton.parentNode.replaceChild(newSpellButton, this.spellButton);
        this.spellButton = newSpellButton;
        
        // Garantir visibilidade e interatividade com estilos explícitos
        this.spellButton.style.pointerEvents = 'auto';
        this.spellButton.style.cursor = 'pointer';
        this.spellButton.style.display = 'block';
        this.spellButton.style.backgroundColor = '#3b82f6'; // Azul para destaque visual
        this.spellButton.style.border = '2px solid #93c5fd'; // Borda para destaque
        this.spellButton.style.padding = '10px 20px';
        this.spellButton.disabled = false;
        
        // Adicionar evento de clique com verificação completa
        this.spellButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            console.log("Botão Expecto Patronum clicado!");
            
            if (window.game && window.game.gameState === 'spellCasting') {
                audioManager.playSfx(audioManager.sfx.patronus, ["C4", "E4", "G4"], "2n", Tone.now());
                window.game.score += 10;
                window.game.resolveSpellEvent();
            }
            
            return false;
        });
        
        // Remover eventos de teclado anteriores para evitar duplicação
        // Usamos uma função nomeada para poder removê-la depois
        if (this._spellKeyHandler) {
            window.removeEventListener('keydown', this._spellKeyHandler);
        }
        
        // Adicionar novo evento de teclado para o botão Espaço lançar o feitiço
        this._spellKeyHandler = (e) => { 
            if (e.code === 'Space' && window.game && window.game.gameState === 'spellCasting') {
                console.log("Tecla Espaço pressionada para lançar feitiço!");
                audioManager.playSfx(audioManager.sfx.patronus, ["C4", "E4", "G4"], "2n", Tone.now());
                window.game.score += 10;
                window.game.resolveSpellEvent();
                
                // Impedir comportamento padrão
                e.preventDefault();
                e.stopPropagation();
            }
        };
        
        window.addEventListener('keydown', this._spellKeyHandler);
        console.log("Botão de feitiço configurado com sucesso:", this.spellButton);
    }
    
    updateSpellTimerBar(percentage) {
        if (!this.timerBarInner) {
            this.timerBarInner = document.getElementById('timerBarInner');
            if (!this.timerBarInner) return;
        }
        
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
