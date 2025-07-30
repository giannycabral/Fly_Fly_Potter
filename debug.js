// Arquivo de diagnóstico - versão simples
console.log("Debug inicializado - modo silencioso");
// Limpeza de telas
window.addEventListener('load', function() {
  // Garantir que a tela de Game Over esteja oculta no início
  const gameOverScreen = document.getElementById('gameOverScreen');
  if (gameOverScreen) {
    gameOverScreen.classList.add('hidden');
    gameOverScreen.style.display = 'none';
    gameOverScreen.style.visibility = 'hidden';
    gameOverScreen.style.opacity = '0';
  }
  
  // Garantir que os contêineres de seleção estejam visíveis
  const characterSelection = document.getElementById('characterSelection');
  const broomSelection = document.getElementById('broomSelection');
  
  if (characterSelection) {
    characterSelection.style.display = 'flex';
    characterSelection.style.visibility = 'visible';
    characterSelection.style.opacity = '1';
  }
  
  if (broomSelection) {
    broomSelection.style.display = 'flex';
    broomSelection.style.visibility = 'visible';
    broomSelection.style.opacity = '1';
  }
});
