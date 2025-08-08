// Arquivo de diagnóstico - versão completa com monitoramento
console.log("Debug inicializado - modo de diagnóstico avançado e monitoramento");

// Função para verificar visibilidade de elementos
function logVisibility(element, name) {
  if (!element) return console.warn(`Elemento ${name} não encontrado!`);
  
  const style = window.getComputedStyle(element);
  console.log(`Visibilidade de ${name}:`, {
    elemento: element,
    display: style.display,
    visibility: style.visibility,
    opacity: style.opacity,
    classList: element.className,
    zIndex: style.zIndex,
    pointerEvents: style.pointerEvents
  });
}

// Monitora mudanças na tela de Game Over
function monitorGameOver() {
  const gameOverScreen = document.getElementById('gameOverScreen');
  if (!gameOverScreen) return;
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'style' || 
           mutation.attributeName === 'class')) {
        console.log('Mudança detectada na tela de Game Over:', {
          display: gameOverScreen.style.display,
          visibility: gameOverScreen.style.visibility,
          opacity: gameOverScreen.style.opacity,
          classList: gameOverScreen.className
        });
      }
    });
  });
  
  observer.observe(gameOverScreen, {
    attributes: true,
    attributeFilter: ['style', 'class']
  });
  
  console.log("Monitoramento da tela de Game Over ativado");
}

// Garante que os botões da tela de Game Over funcionem
function fixGameOverButtons() {
  const restartButton = document.getElementById('restartButton');
  const menuButton = document.getElementById('menuFromGameOverButton');
  
  // Garante que os eventos dos botões funcionem
  if (restartButton) {
    restartButton.addEventListener('click', function(e) {
      console.log("Clique no botão Tentar Novamente detectado");
      e.stopPropagation();
    }, true);
  }
  
  if (menuButton) {
    menuButton.addEventListener('click', function(e) {
      console.log("Clique no botão Menu Principal detectado");
      e.stopPropagation();
    }, true);
  }
}

// Força a exibição da tela de Game Over quando as vidas acabam
function forceGameOverDisplay() {
  // Observa mudanças na vida do jogador
  setInterval(function() {
    const game = window.game;
    if (!game) return;
    
    // Se as vidas acabarem e a tela não estiver visível
    if (game.lives <= 0 && game.gameState === 'gameOver') {
      const gameOverScreen = document.getElementById('gameOverScreen');
      if (gameOverScreen && (gameOverScreen.style.display !== 'block' || 
                             gameOverScreen.classList.contains('hidden'))) {
        console.log("Forçando exibição da tela Game Over");
        
        gameOverScreen.classList.remove('hidden');
        gameOverScreen.classList.remove('fade-out');
        gameOverScreen.style.display = 'block';
        gameOverScreen.style.visibility = 'visible';
        gameOverScreen.style.opacity = '1';
        gameOverScreen.style.zIndex = '200';
      }
    }
  }, 500);
}

// Limpeza de telas e verificação de estado
window.addEventListener('load', function() {
  console.log("====== DEBUG: Carregamento da página ======");
  
  // Garantir que a tela de Game Over esteja oculta no início
  const gameOverScreen = document.getElementById('gameOverScreen');
  if (gameOverScreen) {
    gameOverScreen.classList.add('hidden');
    gameOverScreen.style.display = 'none';
    gameOverScreen.style.visibility = 'hidden';
    gameOverScreen.style.opacity = '0';
    logVisibility(gameOverScreen, 'gameOverScreen');
  }
  
  // Garantir que a tela inicial esteja visível
  const startScreen = document.getElementById('startScreen');
  if (startScreen) {
    startScreen.classList.remove('hidden');
    startScreen.style.display = 'block';
    startScreen.style.visibility = 'visible';
    startScreen.style.opacity = '1';
    startScreen.style.zIndex = '100';
    logVisibility(startScreen, 'startScreen');
  }
  
  // Garantir que os contêineres de seleção estejam visíveis
  const characterSelection = document.getElementById('characterSelection');
  const broomSelection = document.getElementById('broomSelection');
  
  if (characterSelection) {
    characterSelection.style.display = 'flex';
    characterSelection.style.visibility = 'visible';
    characterSelection.style.opacity = '1';
    logVisibility(characterSelection, 'characterSelection');
  }
  
  if (broomSelection) {
    broomSelection.style.display = 'flex';
    broomSelection.style.visibility = 'visible';
    broomSelection.style.opacity = '1';
    logVisibility(broomSelection, 'broomSelection');
  }
  
  // Garantir que o pauseMenu esteja oculto
  const pauseMenu = document.getElementById('pauseMenu');
  if (pauseMenu) {
    pauseMenu.classList.add('hidden');
    pauseMenu.style.display = 'none';
    logVisibility(pauseMenu, 'pauseMenu');
  }
  
  // Garantir que o spellModal esteja oculto
  const spellModal = document.getElementById('spellModal');
  if (spellModal) {
    spellModal.classList.add('hidden');
    spellModal.style.display = 'none';
    logVisibility(spellModal, 'spellModal');
  }
  
  // Garantir que o ui-layer tenha eventos de ponteiro
  const uiLayer = document.getElementById('ui-layer');
  if (uiLayer) {
    uiLayer.classList.remove('pointer-events-none');
    uiLayer.classList.add('pointer-events-auto');
    logVisibility(uiLayer, 'ui-layer');
  }
  
  // Iniciar monitoramento e correções
  monitorGameOver();
  fixGameOverButtons();
  forceGameOverDisplay();
  
  console.log("====== DEBUG: Verificação e monitoramento de UI concluídos ======");
});
