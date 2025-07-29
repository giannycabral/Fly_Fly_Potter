// Inicialização do jogo
// Função para garantir que o jogo inicialize corretamente
function initializeGame() {
    console.log("Inicializando jogo...");
    
    // Verifica se os elementos HTML estão presentes
    const criticalElements = {
        canvas: document.getElementById('gameCanvas'),
        startScreen: document.getElementById('startScreen'),
        characterSelection: document.getElementById('characterSelection'),
        broomSelection: document.getElementById('broomSelection')
    };
    
    console.log("Elementos críticos:", criticalElements);
    
    // Verificar se há problemas com os elementos críticos
    const missingElements = Object.entries(criticalElements)
        .filter(([key, element]) => !element)
        .map(([key]) => key);
        
    if (missingElements.length > 0) {
        console.error("Elementos ausentes:", missingElements);
        alert("Erro ao inicializar o jogo. Alguns elementos não foram encontrados.");
        return;
    }
    
    // Garantir visibilidade da tela inicial
    const startScreen = document.getElementById('startScreen');
    if (startScreen) {
        startScreen.style.display = 'block';
        startScreen.style.visibility = 'visible';
        startScreen.style.opacity = '1';
        startScreen.style.zIndex = '100';
        startScreen.classList.remove('hidden');
    }
    
    // Inicializa o jogo
    try {
        const game = new Game();
        console.log("Jogo inicializado com sucesso!");
        
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
        
        return game;
    } catch (error) {
        console.error("Erro ao inicializar o jogo:", error);
        alert("Ocorreu um erro ao inicializar o jogo. Por favor, recarregue a página.");
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM completamente carregado");
    
    // Aguardar um pequeno tempo para garantir que tudo foi renderizado
    setTimeout(() => {
        const game = initializeGame();
    }, 100);
});
