// Função para depuração da tela inicial
document.addEventListener('DOMContentLoaded', function() {
    console.log('Verificando se os elementos foram encontrados:', {
        startScreen: document.getElementById('startScreen'), 
        characterSelection: document.getElementById('characterSelection'), 
        broomSelection: document.getElementById('broomSelection')
    });
    
    // Verificar estilos aplicados
    const startScreen = document.getElementById('startScreen');
    if (startScreen) {
        console.log('Estilos da tela inicial:', window.getComputedStyle(startScreen));
        
        // Forçar visibilidade da tela inicial
        startScreen.style.display = 'block';
        startScreen.style.opacity = '1';
        startScreen.style.zIndex = '100';
        startScreen.classList.remove('hidden');
        
        // Forçar visibilidade do ui-layer
        const uiLayer = document.getElementById('ui-layer');
        if (uiLayer) {
            uiLayer.style.zIndex = '50';
        }
    } else {
        console.error('A tela inicial não foi encontrada!');
    }
});
