// Configurações globais do jogo
const CONFIG = {
    BASE_WIDTH: 800,
    BASE_HEIGHT: 640,
    SPELL_TIME_LIMIT: 180,
    
    // Dados das Vassouras
    brooms: {
        shootingStar: { name: 'Shooting Star', description: 'Equilibrada e confiável.', lift: -10, gravity: 0.6, color: '#A0522D' },
        nimbus2000: { name: 'Nimbus 2000', description: 'Rápida e ágil.', lift: -11, gravity: 0.7, color: '#5D4037' },
        firebolt: { name: 'Firebolt', description: 'Velocidade máxima!', lift: -12, gravity: 0.8, color: '#212121' }
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
        frequency: 100 
    },
    
    // Propriedades dos feijõezinhos
    beanProps: {
        width: 12, 
        height: 20, 
        frequency: 150,
        goodColors: ['#ef4444', '#22c55e', '#3b82f6', '#fde047'],
        badColors: ['#78716c', '#57534e', '#a3a3a3']
    },
    
    // Propriedades do cenário
    groundHeight: 75
};
