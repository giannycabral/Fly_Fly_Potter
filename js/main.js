// Inicialização do jogo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar estado das telas
    initializeUIState();
    
    // Inicializar o jogo com um pequeno atraso para garantir que tudo esteja carregado
    setTimeout(() => {
        // Inicializa o jogo e o torna acessível globalmente
        window.game = new Game();
        
        // Garantir que a tela inicial seja visível
        window.game.ui.showStartScreen();
        
        // Inicializar seletores
        initializeSelectors();
        
        // Configurar redimensionamento
        setupResizeListener();
    }, 100);
});

// Função para inicializar o estado da UI
function initializeUIState() {
    // Garantir que a tela inicial esteja visível
    const startScreen = document.getElementById('startScreen');
    if (startScreen) {
        startScreen.style.display = 'block';
        startScreen.style.visibility = 'visible';
        startScreen.style.opacity = '1';
        startScreen.style.zIndex = '100';
    }
    
    // Garantir que a tela de Game Over esteja oculta
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) {
        gameOverScreen.classList.add('hidden');
        gameOverScreen.style.display = 'none';
        gameOverScreen.style.visibility = 'hidden';
        gameOverScreen.style.opacity = '0';
    }
    
    // Garantir que os contêineres de seleção estejam visíveis
    const characterSelection = document.getElementById('characterSelection');
    if (characterSelection) {
        characterSelection.style.display = 'flex';
        characterSelection.style.visibility = 'visible';
        characterSelection.style.opacity = '1';
    }
    
    const broomSelection = document.getElementById('broomSelection');
    if (broomSelection) {
        broomSelection.style.display = 'flex';
        broomSelection.style.visibility = 'visible';
        broomSelection.style.opacity = '1';
    }
    
    // Garantir que o ui-layer permita interações
    const uiLayer = document.getElementById('ui-layer');
    if (uiLayer) {
        uiLayer.classList.remove('pointer-events-none');
        uiLayer.classList.add('pointer-events-auto');
    }
    
    // Garantir que as outras telas estejam ocultas
    const pauseMenu = document.getElementById('pauseMenu');
    if (pauseMenu) {
        pauseMenu.classList.add('hidden');
        pauseMenu.style.display = 'none';
    }
    
    const spellModal = document.getElementById('spellModal');
    if (spellModal) {
        spellModal.classList.add('hidden');
        spellModal.style.display = 'none';
    }
}

// Função para inicializar os seletores
function initializeSelectors() {
    if (window.game.ui.characterSelectionContainer) {
        window.game.ui.setupCharacterSelection((charKey) => {
            window.game.selectedCharacterKey = charKey;
            window.game.drawInitialScreen();
        });
    }
    
    if (window.game.ui.broomSelectionContainer) {
        window.game.ui.setupBroomSelection((broomKey) => {
            window.game.selectedBroomKey = broomKey;
            window.game.drawInitialScreen();
        });
    }
}

// Função para configurar o listener de redimensionamento
function setupResizeListener() {
    window.addEventListener('resize', () => {
        // Garantir que o canvas mantenha suas dimensões base
        window.game.canvas.width = CONFIG.BASE_WIDTH;
        window.game.canvas.height = CONFIG.BASE_HEIGHT;
        window.game.ctx.imageSmoothingEnabled = false;
        
        // Redesenha o estado atual
        if (window.game.gameState === 'start' || window.game.gameState === 'gameOver') {
            window.game.drawInitialScreen();
        }
    });
}
