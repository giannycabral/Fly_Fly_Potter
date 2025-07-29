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
    }
    
    // Inicializa o jogo
    const game = new Game();
    
    // Garantir que a tela inicial seja visível
    game.ui.showStartScreen();
    
    // Redimensionar o canvas quando a janela for redimensionada
    window.addEventListener('resize', () => {
        const gameContainer = document.getElementById('game-container');
        
        // Garantir que o canvas mantenha suas dimensões base
        game.canvas.width = CONFIG.BASE_WIDTH;
        game.canvas.height = CONFIG.BASE_HEIGHT;
        
        game.ctx.imageSmoothingEnabled = false;
        
        // Redesenha o estado atual
        if (game.gameState === 'start' || game.gameState === 'gameOver') {
            game.drawInitialScreen();
        }
    });
});
