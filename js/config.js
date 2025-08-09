// Configurações globais do jogo
const CONFIG = {
    BASE_WIDTH: 800,
    BASE_HEIGHT: 640,
    SPELL_TIME_LIMIT: 180,
    
    // Dados das Vassouras - ajustados para controle muito mais suave
    brooms: {
        shootingStar: { name: 'Shooting Star', description: 'Equilibrada e confiável.', lift: -8, gravity: 0.4, color: '#A0522D' },
        nimbus2000: { name: 'Nimbus 2000', description: 'Rápida e ágil.', lift: -8.5, gravity: 0.45, color: '#5D4037' },
        firebolt: { name: 'Firebolt', description: 'Velocidade máxima!', lift: -9, gravity: 0.5, color: '#212121' }
    },
    
    // Dados dos Personagens
    characters: {
        harry: { name: 'Harry Potter', hairColor: '#111827', hasGlasses: true },
        ron: { name: 'Rony Weasley', hairColor: '#D97706', hasGlasses: false },
        hermione: { name: 'Hermione Granger', hairColor: '#78350F', hasGlasses: false }
    },
    
    // Propriedades de obstáculos
    obstacleProps: { 
        width: 78, 
        gap: 240, 
        frequency: 180 // Aumentado ainda mais para tornar o jogo mais fácil - menos obstáculos
    },
    
    // Propriedades dos feijõezinhos
    beanProps: {
        width: 12, 
        height: 20, 
        frequency: 100, // Reduzido de 150 para 100 (aparecem com mais frequência)
        goodColors: ['#ef4444', '#22c55e', '#3b82f6', '#fde047'],
        badColors: ['#78716c', '#57534e', '#a3a3a3']
    },
    
    // Propriedades do cenário
    groundHeight: 75
};
