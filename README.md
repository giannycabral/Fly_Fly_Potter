
# 🧙‍♂️ Fly Fly Potter 🧹

![Fly Fly Potter Banner](https://img.shields.io/badge/Fly%20Fly%20Potter-Jogo%20Mágico-yellow?style=for-the-badge&logo=javascript)

> Um jogo voador mágico inspirado no universo de Harry Potter, com uma jogabilidade viciante no estilo Flappy Bird!

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Responsivo-✅-success?style=for-the-badge)

## ✨ Características

🏰 **Cenários Mágicos**
- Navegue pelo **Castelo de Hogwarts**, adentre a misteriosa **Floresta Proibida** e sobrevoe o emocionante **Campo de Quadribol**
- Gráficos em pixel art nostálgicos que homenageiam a série

🧙 **Personagens Icônicos**
- Escolha entre seus bruxos e bruxas favoritos da saga
- Cada personagem com características únicas

🧹 **Vassouras Mágicas**
- Múltiplas vassouras para escolher, cada uma com seu próprio estilo
- Da clássica Nimbus 2000 à veloz Firebolt

🍬 **Itens e Colecionáveis**
- **Feijõezinhos de Todos os Sabores**: com efeitos especiais que podem ajudar ou atrapalhar
- **Pomo de Ouro**: para invencibilidade temporária e pontos extras
- **Sapos de Chocolate**: ganhe vidas extras para continuar a aventura

⚡ **Mecânicas Envolventes**
- Batalhas contra Dementadores usando o feitiço Expecto Patronum
- Sistema de pontuação progressivo que desbloqueia novos cenários
- Desafios crescentes que testam seus reflexos

## 📱 Experiência Mobile Otimizada

O jogo foi cuidadosamente ajustado para oferecer uma experiência consistente e sem cortes em telas pequenas, especialmente em **modo paisagem**.

### 🔄 Orientação & Escala
- **Detecção automática** de orientação (retrato/paisagem)
- **Sugestão de uso em paisagem** para melhor área jogável
- Estratégia de escala **contain + letterbox** (sem cortes no topo/baixo): preserva toda a área lógica (800x640) evitando que vidas e pontuação desapareçam
- Cálculo de **offsets de letterbox** para reposicionar HUD (corações e score sempre visíveis)

### 🖥️ Modo Tela Cheia
- **Botão dedicado** para entrar/sair de fullscreen
- Tenta aplicar `screen.orientation.lock('landscape')` (quando suportado)
- Classe CSS específica (`.fullscreen-mode`) para ajustes visuais

### � Controles
- Toque único (ou clique / tecla Espaço) para fazer o personagem subir
- Sem gestos complexos: foco em resposta rápida e previsível
- Debounce / cooldown para evitar múltiplas ativações acidentais e erros de áudio

### 🔊 Áudio Estável
- Uso de **Tone.js** para efeitos
- **Cooldown anti-spam** evita erro “Start time must be strictly greater than previous start time” em disparos muito rápidos
- Botão de alternância de som na UI

### HUD Aprimorado em Paisagem
- Fundo translúcido e bordas para score e vidas
- Corações com brilho, sombra e leve aumento de escala
- Notificações contextuais (ex: Floresta Proibida) com destaque visual

### ⚡ Performance
- Canvas único + desenhistas especializados
- Efeitos visuais condicionais ao cenário
- Minimiza relayouts reposicionando apenas contêiner externo na mudança de orientação

## 🎮 Como Jogar

![Instruções](https://img.shields.io/badge/Dificuldade-Desafiadora!-orange?style=for-the-badge)

1. **Início Mágico:** Escolha personagem e vassoura na tela inicial
2. **Decolagem:** Toque (mobile) ou pressione Espaço / Clique (desktop)
3. **Controle de Altura:** Toques ritmados mantêm a trajetória estável
4. **Colecionáveis:** Feijõezinhos podem ajudar ou atrapalhar (observe cores)
5. **Dementadores:** Ative o feitiço quando solicitado (botão ou tecla Espaço no estado de feitiço)
6. **Sobrevivência:** Sapos de Chocolate adicionam vidas; evite colisões sucessivas
7. **Paisagem Recomendada:** Ative fullscreen para melhor campo de visão

## 🛠️ Tecnologias Utilizadas

<table>
  <tr>
    <td align="center">
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" width="40" height="40"/><br>
      <strong>HTML5 Canvas</strong><br>
      Renderização eficiente do jogo
    </td>
    <td align="center">
      <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg" width="40" height="40"/><br>
      <strong>JavaScript</strong><br>
      Lógica de jogo e animações
    </td>
    <td align="center">
      <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg" width="40" height="40"/><br>
      <strong>CSS3</strong><br>
      Estilização e responsividade
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/11019186" width="40" height="40"/><br>
      <strong>Tone.js</strong><br>
      Áudio e efeitos sonoros
    </td>
    <td align="center">
      <img src="https://cdn-icons-png.flaticon.com/512/1055/1055329.png" width="40" height="40"/><br>
      <strong>APIs Modernas</strong><br>
      Fullscreen, Orientation, Touch
    </td>
    <td align="center">
      <img src="https://cdn-icons-png.flaticon.com/512/2271/2271928.png" width="40" height="40"/><br>
      <strong>Pixel Art</strong><br>
      Gráficos nostálgicos
    </td>
  </tr>
</table>

## 🏰 Cenários Mágicos

| Cenário | Descrição | Desbloqueio |
|---------|-----------|-------------|
| **🏰 Castelo de Hogwarts** | O majestoso castelo onde tudo começa. Evite as torres e voando pelos pátios. | Disponível desde o início |
| **🌲 Floresta Proibida** | Uma densa floresta cheia de mistérios e perigos. Cuidado com as árvores e a névoa! | Desbloqueado ao atingir **15 pontos** |
| **🏟️ Campo de Quadribol** | O famoso estádio onde acontecem as partidas. Navegue entre os aros e arquibancadas. | Desbloqueado ao atingir **40 pontos** |

## 💡 Dicas de Mestre Bruxo

- **Ritmo é tudo!** Mantenha toques curtos e precisos para maior controle da vassoura
- **Modo Paisagem + Fullscreen** garante a melhor experiência visual em dispositivos móveis
- **Pomo de Ouro** proporciona invencibilidade temporária e 50 pontos extras
- **Prepare o feitiço!** Quando um Dementador aparecer, tenha o Expecto Patronum pronto
- **Padrões de obstáculos** se repetem - observe e memorize para avançar mais longe!

## 🧪 Feijõezinhos de Todos os Sabores

| Cor | Efeito | Duração |
|-----|--------|---------|
| **Verde, Azul, Amarelo** | Efeitos positivos e pontos | Instantâneo |
| **Vermelho, Preto** | Efeitos negativos como inversão de controles | 3 segundos |

---

## 👩‍💻 Desenvolvimento

<div align="center">
  <img src="https://img.shields.io/badge/Código%20com-Magia-blueviolet?style=for-the-badge&logo=html5" alt="Código com Magia">
</div>

Este projeto foi desenvolvido com dedicação e paixão, combinando o amor pela programação web com a magia do universo de Harry Potter. Cada elemento foi cuidadosamente projetado para proporcionar uma experiência imersiva e divertida.

### 🌟 Recursos de Código

- **Arquitetura modular:** arquivos separados por responsabilidade (`game.js`, `player.js`, `background.js`, `entities.js`, `ui.js`, `responsive.js`, `audio.js`)
- **Canvas lógico fixo (800x640):** simplifica física e colisões; escala visual independente
- **Gerenciador Responsivo:** converte viewport físico em escala + offsets (letterbox) e expõe `scaleRatio` & `viewportOffsets`
- **HUD adaptativo:** vidas e score reposicionados conforme offsets sem distorcer coordenadas do jogo
- **Cooldowns inteligentes:** evitam spam de áudio e entrada excessiva
- **Sistema de obstáculos contextual:** cenários ajustam gaps e estilos visuais

### 📂 Estrutura (Resumo)
```
js/
  audio.js        # Efeitos e controle de som (Tone.js + cooldown)
  background.js   # Obstáculos e cenários
  config.js       # Constantes globais
  entities.js     # Entidades auxiliares
  game.js         # Loop principal / estados
  player.js       # Lógica de movimento e ações do jogador
  responsive.js   # Escala, orientação, fullscreen, offsets
  ui.js           # HUD, menus, seleção e notificações
```

### 🔄 Ciclo de Renderização
1. Atualiza estado do jogo (física, colisões, timers)
2. Desenha cenário / obstáculos
3. Desenha jogador / entidades
4. Desenha HUD (score, vidas, notificações) aplicando offsets

### 🧪 Qualidade
- Sem dependências de build: roda direto em servidor estático
- Uso mínimo de alocação dentro do loop para reduzir GC
- Logs estratégicos para depuração de responsividade e áudio

### 🆕 Mudanças Recentes (Changelog Resumido)
| Data | Mudança |
|------|---------|
| 2025-08 | Migração de escala cover → contain + letterbox (corrige sumiço de vidas/score) |
| 2025-08 | Adicionado cálculo de `viewportOffsets` e ajuste do HUD |
| 2025-08 | Botão fullscreen + tentativa de orientation lock |
| 2025-08 | Cooldown de áudio (corrige erro Tone.js start time) |
| 2025-08 | Melhorias visuais em corações e score em paisagem |
| 2025-08 | Refinamento de seleção de personagem/vassoura em paisagem |

## 🧪 Executar Localmente

Como é um projeto front-end puro com ES Modules, abra via servidor estático (não use file://).

### Opção Rápida (Python 3)
```
python3 -m http.server 8080
```
Acesse: http://localhost:8080

### Node (http-server)
```
npm i -g http-server
http-server -p 8080
```

### Live Server (VS Code)
Instale a extensão e clique em "Open with Live Server" no `index.html`.

## 🤝 Contribuição

Sinta-se à vontade para abrir issues ou PRs:
1. Fork / branch descritiva
2. Alterações focadas e pequenas
3. Descrever claramente o problema/solução

Ideias bem-vindas: novos cenários, power-ups, acessibilidade, efeitos sonoros temáticos.

### 🚀 Futuras Atualizações

- Novos personagens e vassouras para desbloquear
- Cenários adicionais baseados em locais icônicos da saga
- Modo multijogador para competir com amigos
- Tabela de classificação global
- Conquistas para desbloquear

## 📝 Licença

<div align="center">
  <img src="https://img.shields.io/github/license/giannycabral/Fly_Fly_Potter?style=for-the-badge&color=blue" alt="Licença MIT">
</div>

Este projeto está licenciado sob os termos da [Licença MIT](LICENSE):

> Copyright (c) 2025 Regiane Cabral
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction...

A Licença MIT permite:

- ✅ Uso comercial
- ✅ Modificação
- ✅ Distribuição
- ✅ Uso privado

**Nota:** Este projeto é um tributo de fã e não possui afiliação oficial com a franquia Harry Potter. Todos os elementos relacionados a Harry Potter são propriedade de J.K. Rowling e Warner Bros. Entertainment Inc.

---

<div align="center">
  <p>Desenvolvido com 💖 e ⚡ por</p>
  <h3>Regiane Cabral</h3>
  
  [![GitHub](https://img.shields.io/badge/GitHub-giannycabral-6e5494?style=for-the-badge&logo=github)](https://github.com/giannycabral)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-Conectar-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/regiane-jesus/)
  [![Portfolio](https://img.shields.io/badge/Portfolio-Visitar-ff69b4?style=for-the-badge&logo=google-chrome)](https://giannycabral.github.io/gianniverse.dev/)
  
  ### 🧙‍♂️ Divirta-se e que a magia esteja com você! 🧹✨

[![Jogar Agora](https://img.shields.io/badge/JOGAR%20AGORA-Embarque%20na%20Aventura!-success?style=for-the-badge)](https://giannycabral.github.io/Fly_Fly_Potter/)

</div>

---

<div align="center">
  <sub>Fly Fly Potter © 2025 | Versão 1.1.0</sub>
</div>
