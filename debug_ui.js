// Script para garantir que os botões da UI funcionem corretamente
console.log("Debug UI inicializado - verificação de botões");

// Função para adicionar ou corrigir os listeners de eventos nos botões do Game Over
function fixGameOverButtons() {
    const restartButton = document.getElementById('restartButton');
    const menuButton = document.getElementById('menuFromGameOverButton');
    
    if (restartButton) {
        restartButton.style.pointerEvents = 'auto';
        restartButton.style.cursor = 'pointer';
        
        restartButton.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log("Botão tentar novamente clicado (debug_ui)");
            
            if (window.game) {
                window.game.restartFromGameOver();
            } else {
                console.error("Objeto game não encontrado!");
            }
            
            return false;
        };
    }
    
    if (menuButton) {
        menuButton.style.pointerEvents = 'auto';
        menuButton.style.cursor = 'pointer';
        
        menuButton.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log("Botão menu principal clicado (debug_ui)");
            
            if (window.game) {
                window.game.returnToMenu();
            } else {
                console.error("Objeto game não encontrado!");
            }
            
            return false;
        };
    }
}

// Verificar periodicamente os botões do Game Over
setInterval(function() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    
    // Se a tela de Game Over estiver visível, verifica os botões
    if (gameOverScreen && 
        gameOverScreen.style.display === 'block' && 
        gameOverScreen.style.visibility === 'visible') {
        fixGameOverButtons();
    }
}, 500);

// Observar mudanças na tela de Game Over
function observeGameOverScreen() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (!gameOverScreen) return;
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' || 
                mutation.type === 'childList' || 
                mutation.attributeName === 'style' || 
                mutation.attributeName === 'class') {
                
                // Se a tela de Game Over ficou visível, corrige os botões
                if (gameOverScreen.style.display === 'block' && 
                    gameOverScreen.style.visibility === 'visible') {
                    fixGameOverButtons();
                }
            }
        });
    });
    
    observer.observe(gameOverScreen, {
        attributes: true,
        childList: true,
        subtree: true
    });
}

// Quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', function() {
    observeGameOverScreen();
    
    // Verifica imediatamente após o carregamento
    setTimeout(fixGameOverButtons, 1000);
});
