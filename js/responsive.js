// Classe para gerenciar a responsividade do jogo
class ResponsiveManager {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.gameContainer = document.getElementById('game-container');
        this.gameWrapper = document.getElementById('game-wrapper');
        this.rotationMessage = document.getElementById('rotation-message');
        this.originalWidth = CONFIG.BASE_WIDTH;
        this.originalHeight = CONFIG.BASE_HEIGHT;
        this.scaleRatio = 1;
        
        // Verificar se estamos em um dispositivo móvel
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Inicializar
        this.setupEventListeners();
        this.updateCanvasSize();
        this.checkOrientation();
    }
    
    setupEventListeners() {
        // Detectar mudanças no tamanho da janela
        window.addEventListener('resize', () => {
            this.updateCanvasSize();
            this.checkOrientation();
        });
        
        // Detectar mudanças de orientação em dispositivos móveis
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.updateCanvasSize();
                this.checkOrientation();
            }, 300); // Pequeno atraso para garantir que a orientação foi alterada completamente
        });
        
        // Detectar mudanças no estado da tela cheia
        document.addEventListener('fullscreenchange', () => {
            setTimeout(() => {
                this.updateCanvasSize();
                this.checkOrientation();
                
                // Atualizar o botão de tela cheia se existir
                const fullscreenButton = document.getElementById('fullscreenButton');
                if (fullscreenButton) {
                    fullscreenButton.textContent = document.fullscreenElement ? "⟰" : "⛶";
                }
            }, 300);
        });
    }
    
    updateCanvasSize() {
        // Obter dimensões do container do jogo
        const containerWidth = this.gameContainer.clientWidth;
        const containerHeight = this.gameContainer.clientHeight;
        
        // Verificar se é um dispositivo móvel e está em modo paisagem
        const isMobileDevice = this.isMobile || window.innerWidth <= 1024;
        const isLandscape = window.matchMedia("(orientation: landscape)").matches;
        const aspectRatio = window.innerWidth / window.innerHeight;
        const isInLandscapeMode = isLandscape || aspectRatio > 1.2;
        
        // Armazenar o estado da orientação para uso em outras partes do jogo
        this.isInLandscapeMode = isInLandscapeMode;
        
        // Para dispositivos móveis, otimizar para modo paisagem (o jogo deve ser jogado em paisagem)
        if (isMobileDevice) {
            // Determinar as dimensões disponíveis da tela
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            // Definir dimensões do canvas para corresponder à resolução interna do jogo
            this.canvas.width = this.originalWidth;
            this.canvas.height = this.originalHeight;
            
            if (isInLandscapeMode) {
                // *** MODO PAISAGEM (RECOMENDADO) ***
                
                // Configurar o wrapper para usar toda a tela
                this.gameWrapper.style.width = '100vw';
                this.gameWrapper.style.height = '100vh';
                this.gameWrapper.style.overflow = 'hidden';
                
                // Configurar o container para usar toda a tela em modo paisagem
                this.gameContainer.style.maxWidth = '100vw';
                this.gameContainer.style.maxHeight = '100vh';
                this.gameContainer.style.width = '100vw';
                this.gameContainer.style.height = '100vh';
                
                // Calcular a escala para preencher toda a tela, mantendo a proporção
                const scaleToFillX = screenWidth / this.originalWidth;
                const scaleToFillY = screenHeight / this.originalHeight;
                
                // Usar a escala máxima possível para preencher toda a tela
                this.scaleRatio = Math.max(scaleToFillX, scaleToFillY);
                
                // Se a escala resultar em recorte do conteúdo, use a escala que mantém tudo visível
                if (this.originalWidth * this.scaleRatio > screenWidth || 
                    this.originalHeight * this.scaleRatio > screenHeight) {
                    this.scaleRatio = Math.min(scaleToFillX, scaleToFillY);
                }
                
                // Posicionar o container para ocupar a tela inteira sem transformação
                this.gameContainer.style.position = 'fixed';
                this.gameContainer.style.top = '0';
                this.gameContainer.style.left = '0';
                this.gameContainer.style.right = '0';
                this.gameContainer.style.bottom = '0';
                this.gameContainer.style.transform = 'none';
                
                // Remover margens e padding para maximizar o espaço
                this.gameContainer.style.margin = '0';
                this.gameContainer.style.padding = '0';
                
                // Garantir que o canvas ocupe o espaço total do container
                this.canvas.style.width = '100%';
                this.canvas.style.height = '100%';
                this.canvas.style.objectFit = 'cover'; // Usar cover para ocupar todo o espaço
                
                // Certificar-se de que a camada UI também ocupe todo o espaço
                const uiLayer = document.getElementById('ui-layer');
                if (uiLayer) {
                    uiLayer.style.width = '100vw';
                    uiLayer.style.height = '100vh';
                    uiLayer.style.top = '0';
                    uiLayer.style.left = '0';
                    uiLayer.style.right = '0';
                    uiLayer.style.bottom = '0';
                    uiLayer.style.position = 'fixed';
                }
                
                console.log(`Canvas otimizado para modo paisagem: ${this.canvas.width}x${this.canvas.height} (Escala: ${this.scaleRatio.toFixed(3)})`);
            } else {
                // *** MODO RETRATO (MOSTRAR AVISO PARA ROTACIONAR) ***
                
                // Mesmo em modo retrato, ainda apresentamos o jogo, mas com escala reduzida
                // Isso facilita a visualização enquanto o usuário rotaciona o dispositivo
                
                const scaleX = containerWidth / this.originalWidth;
                const scaleY = containerHeight / this.originalHeight;
                this.scaleRatio = Math.min(scaleX, scaleY) * 0.7; // Escala reduzida para incentivar a rotação
                
                const scaledWidth = Math.floor(this.originalWidth * this.scaleRatio);
                const scaledHeight = Math.floor(this.originalHeight * this.scaleRatio);
                
                // Ajustar o container do jogo para manter a proporção correta
                this.gameContainer.style.width = scaledWidth + 'px';
                this.gameContainer.style.height = scaledHeight + 'px';
                
                // Centralizar
                this.gameContainer.style.transform = 'translate(-50%, -50%)';
                this.gameContainer.style.left = '50%';
                this.gameContainer.style.top = '50%';
                this.gameContainer.style.position = 'absolute';
            }
        } else {
            // *** COMPORTAMENTO PARA DISPOSITIVOS DESKTOP ***
            
            // Calcular a escala mantendo a proporção
            const scaleX = containerWidth / this.originalWidth;
            const scaleY = containerHeight / this.originalHeight;
            this.scaleRatio = Math.min(scaleX, scaleY);
            
            // Definir dimensões do canvas para corresponder à resolução interna do jogo
            this.canvas.width = this.originalWidth;
            this.canvas.height = this.originalHeight;
            
            // Aplicar a escala ao canvas via CSS (renderização mais nítida)
            const scaledWidth = Math.floor(this.originalWidth * this.scaleRatio);
            const scaledHeight = Math.floor(this.originalHeight * this.scaleRatio);
            
            // Ajustar o container do jogo para manter a proporção correta
            this.gameContainer.style.width = scaledWidth + 'px';
            this.gameContainer.style.height = scaledHeight + 'px';
            
            // Adicionar transformação para centralizar o jogo
            this.gameContainer.style.transform = 'translate(-50%, -50%)';
            this.gameContainer.style.left = '50%';
            this.gameContainer.style.top = '50%';
            this.gameContainer.style.position = 'absolute';
            
            console.log(`Canvas ajustado para desktop: ${this.canvas.width}x${this.canvas.height} (Escala: ${this.scaleRatio.toFixed(3)})`);
        }
        
        // Informar ao jogo sobre a mudança de escala e orientação
        if (window.game) {
            window.game.handleResponsiveUpdate(this.isInLandscapeMode);
        }
    }
    
    checkOrientation() {
        // Verificar se é um dispositivo móvel
        const isMobileDevice = this.isMobile || window.innerWidth <= 1024;
        
        // Detectar orientação atual usando múltiplos métodos para maior precisão
        const isLandscape = window.matchMedia("(orientation: landscape)").matches;
        const aspectRatio = window.innerWidth / window.innerHeight;
        const orientationAngle = window.screen.orientation ? 
            window.screen.orientation.angle : 
            (window.orientation || 0);
        
        // Verificar se o dispositivo está realmente em modo retrato
        const isPortrait = (!isLandscape || aspectRatio < 1.2) && 
            (orientationAngle === 0 || orientationAngle === 180);
            
        // Verificar se está em modo paisagem
        const isLandscapeMode = !isPortrait;
        
        // Armazenar o estado da orientação para uso em outras funções
        this.isLandscapeMode = isLandscapeMode;
        
        // Verificar se está em modo tela cheia
        const isInFullscreen = !!document.fullscreenElement;
        
        // Adicionar ou remover classes relacionadas ao modo atual
        if (isLandscapeMode) {
            this.gameWrapper.classList.add('landscape-mode');
            
            // Aplicar estilos específicos para modo paisagem em tela cheia
            if (isInFullscreen) {
                document.body.classList.add('fullscreen-mode');
                this.gameWrapper.classList.add('fullscreen-mode');
            }
        } else {
            this.gameWrapper.classList.remove('landscape-mode');
            
            // Remover classes de tela cheia em modo retrato
            if (!isInFullscreen) {
                document.body.classList.remove('fullscreen-mode');
                this.gameWrapper.classList.remove('fullscreen-mode');
            }
        }
        
        // Notificar o jogo sobre a mudança de orientação e status de tela cheia
        if (window.game) {
            window.game.handleResponsiveUpdate(this.isLandscapeMode, isInFullscreen);
        }
        
        // Para dispositivos móveis, SEMPRE mostrar mensagem se não estiver em modo paisagem
        // O jogo foi otimizado para ser jogado APENAS em modo paisagem em celulares
        if (isMobileDevice && isPortrait) {
            this.rotationMessage.classList.remove('hidden');
            this.gameWrapper.style.opacity = "0.3";
            document.body.style.backgroundColor = "#090a0f"; // Escurecer o fundo
            
            // Atualizar texto da mensagem para deixar claro que o modo paisagem é o único suportado
            const messageElement = this.rotationMessage.querySelector('p');
            if (messageElement) {
                messageElement.textContent = "Este jogo funciona apenas em modo paisagem. Por favor, rotacione seu dispositivo!";
                messageElement.style.fontWeight = "bold";
                messageElement.style.color = "#fde047"; // Amarelo mais visível
            }
            
            // Adicionar uma animação de rotação ao ícone
            const rotationIcon = this.rotationMessage.querySelector('svg');
            if (rotationIcon) {
                rotationIcon.style.animation = 'rotate 2s infinite ease-in-out';
                if (!document.getElementById('rotation-animation')) {
                    const style = document.createElement('style');
                    style.id = 'rotation-animation';
                    style.textContent = `
                        @keyframes rotate {
                            0% { transform: rotate(0deg); }
                            25% { transform: rotate(90deg); }
                            75% { transform: rotate(90deg); }
                            100% { transform: rotate(0deg); }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
            
            // Mostrar botão de fullscreen na mensagem de rotação para dispositivos que suportam
            const fullscreenButton = document.getElementById('fullscreenButton');
            if (fullscreenButton && document.documentElement.requestFullscreen) {
                const clonedButton = fullscreenButton.cloneNode(true);
                clonedButton.id = 'rotation-fullscreen-button';
                clonedButton.style.position = 'static';
                clonedButton.style.marginTop = '20px';
                clonedButton.classList.remove('hidden');
                
                // Verificar se já existe um botão na mensagem de rotação
                const existingButton = this.rotationMessage.querySelector('#rotation-fullscreen-button');
                if (!existingButton) {
                    this.rotationMessage.querySelector('div').appendChild(clonedButton);
                    
                    clonedButton.addEventListener('click', () => {
                        if (!document.fullscreenElement) {
                            document.documentElement.requestFullscreen().then(() => {
                                // Girar a tela após entrar em modo fullscreen
                                if (window.screen.orientation && window.screen.orientation.lock) {
                                    window.screen.orientation.lock('landscape').catch(e => {
                                        console.warn('Não foi possível bloquear a orientação: ', e);
                                    });
                                }
                                
                                // Adicionar classe para estilos específicos de tela cheia
                                document.body.classList.add('fullscreen-mode');
                                this.gameWrapper.classList.add('fullscreen-mode');
                                
                                // Atualizar o layout para tela cheia
                                setTimeout(() => {
                                    this.updateCanvasSize();
                                }, 300);
                            }).catch(err => {
                                console.warn(`Erro ao tentar fullscreen: ${err.message}`);
                            });
                        }
                    });
                }
            }
        } else {
            this.rotationMessage.classList.add('hidden');
            this.gameWrapper.style.opacity = "1";
            document.body.style.backgroundColor = ""; // Restaurar cor de fundo
            
            // Mostrar o botão de fullscreen apenas em modo paisagem
            const fullscreenButton = document.getElementById('fullscreenButton');
            if (fullscreenButton && document.documentElement.requestFullscreen) {
                fullscreenButton.classList.remove('hidden');
            }
        }
        
        // Atualizar o layout baseado na orientação
        this.updateCanvasSize();
    }
    
    // Método para transformar coordenadas de toque/mouse para coordenadas do jogo
    transformCoordinates(clientX, clientY) {
        // Obter a posição do canvas
        const rect = this.canvas.getBoundingClientRect();
        
        // Calcular as coordenadas relativas
        const x = (clientX - rect.left) / this.scaleRatio;
        const y = (clientY - rect.top) / this.scaleRatio;
        
        return { x, y };
    }
    
    // Configurar controles de toque para dispositivos móveis
    setupTouchControls() {
        // Verificar se o jogo está disponível
        if (!window.game) {
            console.error('O jogo ainda não foi inicializado.');
            return;
        }
        
        // Impedir comportamentos padrão de toque que podem interferir com o jogo
        document.addEventListener('touchmove', (e) => {
            if (window.game.gameState === 'playing') {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Configurar controle de toque para voar
        this.canvas.addEventListener('touchstart', (e) => {
            if (window.game.gameState === 'playing') {
                e.preventDefault();
                window.game.player.flap();
                
                // Tornar o controle responsivo ao toque contínuo
                if (!this._touchInterval) {
                    this._touchInterval = setInterval(() => {
                        if (window.game.gameState === 'playing') {
                            window.game.player.flap();
                        }
                    }, 350); // Intervalo entre flaps quando mantém o toque
                }
            }
        }, { passive: false });
        
        // Parar de voar quando soltar o toque
        this.canvas.addEventListener('touchend', (e) => {
            if (this._touchInterval) {
                clearInterval(this._touchInterval);
                this._touchInterval = null;
            }
        }, { passive: false });
        
        // Adicionar detector de gestos para pausa ao deslizar para baixo
        let touchStartY = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        this.canvas.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const diffY = touchY - touchStartY;
            
            // Se deslizar para baixo com força suficiente, pausar o jogo
            if (diffY > 100 && window.game.gameState === 'playing') {
                window.game.pauseGame();
            }
        }, { passive: true });
        
        console.log('Controles de toque configurados para dispositivos móveis');
    }
}

// Função para forçar a atualização do layout em mudanças de orientação
function forceLayoutUpdate() {
    if (window.responsiveManager) {
        window.responsiveManager.checkOrientation();
        window.responsiveManager.updateCanvasSize();
        console.log("Layout atualizado devido à mudança de orientação");
    }
}

// Criar uma instância global do gerenciador de responsividade quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Garantir que a instância é criada após o carregamento da página
    window.responsiveManager = new ResponsiveManager();
    
    // Adicionar eventos específicos para detectar mudanças de orientação de forma mais confiável
    if ('onorientationchange' in window) {
        window.addEventListener('orientationchange', function() {
            setTimeout(forceLayoutUpdate, 300);
        });
    }
    
    // Tratar mudanças de tamanho de tela para dispositivos que não têm evento orientationchange
    const mql = window.matchMedia("(orientation: portrait)");
    if (mql && mql.addEventListener) {
        mql.addEventListener('change', function() {
            setTimeout(forceLayoutUpdate, 300);
        });
    } else if (mql && mql.addListener) {
        // Fallback para navegadores mais antigos
        mql.addListener(function() {
            setTimeout(forceLayoutUpdate, 300);
        });
    }
});

// Método de inicialização chamado quando o jogo estiver pronto
ResponsiveManager.prototype.init = function(game) {
    // Armazenar referência ao jogo
    this.gameInstance = game;
    
    // Atualizar o tamanho do canvas com base na nova referência do jogo
    this.updateCanvasSize();
    
    // Se estivermos em um dispositivo móvel, configurar controles de toque
    if (this.isMobile) {
        this.setupTouchControls();
        this.setupFullscreenButton();
    }
    
    console.log('Gerenciador de responsividade inicializado com o jogo');
    
    // Retornar this para permitir encadeamento
    return this;
};

// Configurar botão de tela cheia para dispositivos móveis
ResponsiveManager.prototype.setupFullscreenButton = function() {
    const fullscreenButton = document.getElementById('fullscreenButton');
    
    // Mostrar botão apenas em dispositivos que suportam tela cheia
    if (fullscreenButton && document.documentElement.requestFullscreen) {
        fullscreenButton.classList.remove('hidden');
        
        fullscreenButton.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen()
                    .then(() => {
                        fullscreenButton.textContent = "⟰";
                        
                        // Bloquear orientação em paisagem se for um dispositivo móvel
                        if (this.isMobile && window.screen.orientation && window.screen.orientation.lock) {
                            window.screen.orientation.lock('landscape').catch(e => {
                                console.warn('Não foi possível bloquear a orientação: ', e);
                            });
                        }
                        
                        // Sempre configurar o game-wrapper para usar toda a tela em fullscreen
                        this.gameWrapper.style.width = '100vw';
                        this.gameWrapper.style.height = '100vh';
                        this.gameWrapper.style.overflow = 'hidden';
                        this.gameWrapper.style.padding = '0';
                        this.gameWrapper.style.margin = '0';
                        
                        // Configurar o gameContainer para usar toda a tela em fullscreen
                        this.gameContainer.style.maxWidth = '100vw';
                        this.gameContainer.style.maxHeight = '100vh';
                        this.gameContainer.style.width = '100vw';
                        this.gameContainer.style.height = '100vh';
                        this.gameContainer.style.padding = '0';
                        this.gameContainer.style.margin = '0';
                        
                        // Garantir que o canvas ocupe todo o espaço
                        this.canvas.style.width = '100%';
                        this.canvas.style.height = '100%';
                        this.canvas.style.objectFit = 'cover';
                        
                        // Garantir que a camada UI ocupe toda a tela
                        const uiLayer = document.getElementById('ui-layer');
                        if (uiLayer) {
                            uiLayer.style.width = '100%';
                            uiLayer.style.height = '100%';
                            uiLayer.style.position = 'absolute';
                            uiLayer.style.top = '0';
                            uiLayer.style.left = '0';
                            uiLayer.style.right = '0';
                            uiLayer.style.bottom = '0';
                        }
                        
                        // Verificar orientação após entrar em tela cheia
                        setTimeout(() => {
                            this.checkOrientation();
                            this.updateCanvasSize(); // Garantir que o tamanho é atualizado após entrar em tela cheia
                            
                            // Adicionar classe especial para estilos em modo tela cheia
                            document.body.classList.add('fullscreen-mode');
                            this.gameWrapper.classList.add('fullscreen-mode');
                        }, 300);
                        
                        // Forçar uma atualização do tamanho após entrar em tela cheia
                        window.dispatchEvent(new Event('resize'));
                    })
                    .catch(err => {
                        console.warn(`Erro ao tentar entrar em tela cheia: ${err.message}`);
                    });
            } else {
                document.exitFullscreen()
                    .then(() => {
                        fullscreenButton.textContent = "⛶";
                        
                        // Remover classe de tela cheia
                        document.body.classList.remove('fullscreen-mode');
                        this.gameWrapper.classList.remove('fullscreen-mode');
                        
                        // Verificar orientação após sair da tela cheia
                        setTimeout(() => {
                            this.checkOrientation();
                            this.updateCanvasSize(); // Garantir que o tamanho é atualizado após sair da tela cheia
                        }, 300);
                        
                        // Forçar uma atualização do tamanho após sair da tela cheia
                        window.dispatchEvent(new Event('resize'));
                    })
                    .catch(err => {
                        console.warn(`Erro ao tentar sair da tela cheia: ${err.message}`);
                    });
            }
        });
    }
};
