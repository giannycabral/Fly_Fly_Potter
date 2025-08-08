// Inicialização do jogo
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM completamente carregado, iniciando jogo...");
    
    // Verifica se os elementos HTML estão presentes
    console.log("Verificando elementos críticos:", {
        canvas: document.getElementById('gameCanvas'),
        startScreen: document.getElementById('startScreen'),
        characterSelection: document.getElementById('characterSelection'),
        broomSelection: document.getElementById('broomSelection')
    });
    
    // Verificando visibilidade da tela inicial
    const startScreen = document.getElementById('startScreen');
    if (startScreen) {
        console.log("Estilo atual da tela inicial:", window.getComputedStyle(startScreen));
        
        // Garantir que a tela inicial esteja visível
        startScreen.style.display = 'block';
        startScreen.style.visibility = 'visible';
        startScreen.style.opacity = '1';
        startScreen.style.zIndex = '100';
    }
    
    // Garantir que o ui-layer esteja com pointer-events ativo
    const uiLayer = document.getElementById('ui-layer');
    if (uiLayer) {
        uiLayer.classList.remove('pointer-events-none');
        uiLayer.classList.add('pointer-events-auto');
    }
    
    // Esperar um pouco para garantir que tudo esteja carregado
    setTimeout(() => {
        // Inicializa o jogo e o torna acessível globalmente
        window.game = new Game();
        
        // Garantir que a tela inicial seja visível
        window.game.ui.showStartScreen();
        
        // Forçar renderização das telas de seleção
        if (window.game.ui.characterSelectionContainer) {
            window.game.ui.setupCharacterSelection((charKey) => {
                console.log("Personagem selecionado:", charKey);
                window.game.selectedCharacterKey = charKey;
                window.game.drawInitialScreen();
            });
        }
        
        if (window.game.ui.broomSelectionContainer) {
            window.game.ui.setupBroomSelection((broomKey) => {
                console.log("Vassoura selecionada:", broomKey);
                window.game.selectedBroomKey = broomKey;
                window.game.drawInitialScreen();
            });
        }
        
        // Redimensionar o canvas quando a janela for redimensionada
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
    }, 100);
});
