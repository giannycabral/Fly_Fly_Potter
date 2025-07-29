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
        // Inicializa o jogo
        const game = new Game();
        
        // Garantir que a tela inicial seja visível
        game.ui.showStartScreen();
        
        // Forçar renderização das telas de seleção
        if (game.ui.characterSelectionContainer) {
            game.ui.setupCharacterSelection((charKey) => {
                console.log("Personagem selecionado:", charKey);
                game.selectedCharacterKey = charKey;
                game.drawInitialScreen();
            });
        }
        
        if (game.ui.broomSelectionContainer) {
            game.ui.setupBroomSelection((broomKey) => {
                console.log("Vassoura selecionada:", broomKey);
                game.selectedBroomKey = broomKey;
                game.drawInitialScreen();
            });
        }
        
        // Redimensionar o canvas quando a janela for redimensionada
        window.addEventListener('resize', () => {
            // Garantir que o canvas mantenha suas dimensões base
            game.canvas.width = CONFIG.BASE_WIDTH;
            game.canvas.height = CONFIG.BASE_HEIGHT;
            game.ctx.imageSmoothingEnabled = false;
            
            // Redesenha o estado atual
            if (game.gameState === 'start' || game.gameState === 'gameOver') {
                game.drawInitialScreen();
            }
        });
    }, 100);
});
