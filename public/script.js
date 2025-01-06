// Seletores principais
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const rules = document.getElementById("rules");
const ranking = document.getElementById("ranking");
const gameOver = document.getElementById("gameOver");
const settings = document.getElementById("settings");
const startGame = document.getElementById("startGame");
const about = document.getElementById("about")

// Botões do menu
const aboutButton = document.getElementById("aboutButton")
const playButton = document.getElementById("playButton");
const rulesButton = document.getElementById("rulesButton");
const rankingButton = document.getElementById("rankingButton");
const exitButton = document.getElementById("exitButton");

// Seletores para a tela de configurações
const settingsButton = document.getElementById("settingsButton");
const backToMenuFromSettings = document.getElementById("backToMenuFromSettings");

const settingsButtonInGame = document.getElementById("settingsButtonInGame");
const backToGameFromSettings = document.getElementById("backToGameFromSettings");

// Evento para voltar ao menu a partir da tela de configurações
backToMenuFromSettings.addEventListener("click", () => {
    showScreen(menu);  // Exibe o menu
});

settingsButtonInGame.addEventListener("click", () => {
    showScreen(settingsingame); // Abre as configurações
});

backToGameFromSettings.addEventListener("click", () => {
    showScreen(game); // Retorna para o jogo
});

backToMenuFromAbout.addEventListener("click", () => {
    showScreen(menu);  // Exibe o menu
});

playButton.addEventListener("click", () => {
    showScreen(startGame); // Mostra a tela de "Iniciando Jogo"
    setTimeout(() => {
        showScreen(game); // Após 1 segundo, exibe a tela do jogo
        resetGame(); // Reinicia o estado do jogo
        updateUI(); // Atualiza a interface do jogo
    }, 2000); 
});

function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    screen.classList.remove("hidden");
    screen.classList.add("active");
}


// Botões dentro do jogo
const solarButton = document.getElementById("solarButton");
const infraButton = document.getElementById("infraButton");
const prepButton = document.getElementById("prepButton");
const policyButton = document.getElementById("policyButton");
const nextTurnButton = document.getElementById("nextTurnButton");

// Botões de navegação
const backToMenuFromRules = document.getElementById("backToMenuFromRules");
const backToMenuFromRanking = document.getElementById("backToMenuFromRanking");
const restartButton = document.getElementById("restartButton");

// Elementos dos recursos e clima
const populationSpan = document.getElementById("population");
const healthSpan = document.getElementById("health");
const happinessSpan = document.getElementById("happiness");
const waterSpan = document.getElementById("water");
const foodSpan = document.getElementById("food");
const energySpan = document.getElementById("energy");
const moneySpan = document.getElementById("money");
const scoreSpan = document.getElementById("score");
const climateSpan = document.getElementById("climate");
const impactSpan = document.getElementById("impact");

// Estado inicial do jogo
let gameState = {
    population: 50000,
    health: 80,
    happiness: 80,
    water: 70,
    food: 70,
    energy: 400,
    money: 1000,
    score: 0,
    climate: "Sol",
    turn: 1
};

// Eventos para navegação entre telas
voltarButton.addEventListener("click", () => showScreen(menu));
aboutButton.addEventListener("click", () => showScreen(about));
rulesButton.addEventListener("click", () => showScreen(rules));
rankingButton.addEventListener("click", () => showScreen(ranking));
exitButton.addEventListener("click", () => alert("Jogo encerrado!"));
backToMenuFromRules.addEventListener("click", () => showScreen(menu));
backToMenuFromRanking.addEventListener("click", () => showScreen(menu));
settingsButton.addEventListener("click", () => showScreen(settings));  // Exibe a tela de configurações
restartButton.addEventListener("click", () => {
    resetGame();
    showScreen(menu);
    limparEfeito();
});

// Função para exibir a tela correta
function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
}

// Atualizar UI com os valores do estado
function updateUI() {
    populationSpan.textContent = gameState.population.toLocaleString();;
    healthSpan.textContent = `${gameState.health}%`;
    happinessSpan.textContent = `${gameState.happiness}%`;
    waterSpan.textContent = `${gameState.water}%`;
    foodSpan.textContent = `${gameState.food}%`;
    energySpan.textContent = `${gameState.energy} kW`;
    moneySpan.textContent = `€${gameState.money}`;
    scoreSpan.textContent = gameState.score;
    climateSpan.textContent = gameState.climate;
    impactSpan.textContent = calculateClimateImpact();
}

// Calcular impacto do clima
function calculateClimateImpact() {
    const impacts = {
        "Sol": "-5 Água / -5 Comida ",
        "Chuva": "+10 Água / -5 Felicidade",
        "Tempestade": "-5 Saúde / -10 Energia",
        "Frio": "-10 Comida / +5 Saúde"
    };
    return impacts[gameState.climate] || "";
}

// Evento de mudar turno
nextTurnButton.addEventListener("click", () => {
    gameState.turn++;
    gameState.score += 10; // Incrementar pontuação por turno
    changeClimate();
  
    
    // Dinheiro ganho com base na população
    const moneyPerThousand = 5; // Valor ganho por cada 1000 habitantes
    const additionalMoney = Math.floor(gameState.population / 1000) * moneyPerThousand;
    gameState.money += additionalMoney;

    
    
    updateUI();

    // Verificar condições de game over
    if (gameState.health <= 0 || gameState.water <= 0 || gameState.food <= 0 || gameState.happiness <= 0 || gameState.energy <= 0) {
        showGameOver();
    }
});


// Aplicar impacto do clima no turno
function applyClimateImpact() {
    if (gameState.climate === "Sol") {
        gameState.water -= 5;
        gameState.food -= 5;
        limparEfeito();
    } else if (gameState.climate === "Chuva") {
        gameState.water += 10;
        gameState.happiness -= 5;
        iniciarEfeito('chuva');
    } else if (gameState.climate === "Tempestade") {
        gameState.health -= 5;
        gameState.energy -= 10;
        iniciarEfeito('tempestade');
    } else if (gameState.climate === "Frio") {
        gameState.food -= 10;
        gameState.health += 5;
        iniciarEfeito('neblina');
    }
}

// Alterar o clima aleatoriamente
function changeClimate() {
    const climates = ["Sol", "Chuva", "Tempestade", "Frio"];
    gameState.climate = climates[Math.floor(Math.random() * climates.length)];
    applyClimateImpact();
}

// Botões de ação
solarButton.addEventListener("click", () => {
    const cost = 50;
    if (gameState.money >= cost) {
        gameState.energy += 50;
        gameState.money -= cost;
    } else {
        alert("Você não tem dinheiro suficiente!");
    }
    updateUI();
});


infraButton.addEventListener("click", () => {
    const cost = 100;
    if (gameState.money >= cost) {
        gameState.health += 10;
        gameState.money -= cost;
    } else {
        alert("Você não tem dinheiro suficiente!");
    }
    updateUI();
});


prepButton.addEventListener("click", () => {
    const cost = 200;
    if (gameState.money >= cost) {
        gameState.food += 5;
        gameState.money -= cost;
    } else {
        alert("Você não tem dinheiro suficiente!");
    }
    updateUI();
});


policyButton.addEventListener("click", () => {
    const cost = 250;
    if (gameState.money >= cost) {
        gameState.happiness += 10;
        gameState.money -= cost;
    } else {
        alert("Você não tem dinheiro suficiente!");
    }
    updateUI();
});


// Reiniciar o jogo
function resetGame() {
    gameState = {
        population: 50000,
        health: 80,
        happiness: 90,
        water: 70,
        food: 70,
        energy: 400,
        money: 1000,
        score: 0,
        climate: "Sol",
        turn: 1
    };
    updateUI();
}

// Tela de Game Over
function showGameOver() {
    limparEfeito(); // Remove os efeitos do clima
    const finalScore = document.getElementById("finalScore");
    finalScore.textContent = gameState.score;
    showScreen(gameOver);
}

// Inicializar jogo
resetGame();
updateUI();
showScreen(menu);

// Menu interativo
const menuButtons = Array.from(menu.querySelectorAll("button"));
let selectedIndex = 0;

function updateMenuHighlight() {
    menuButtons.forEach((btn, index) => {
        if (index === selectedIndex) {
            btn.classList.add("selected");
            btn.textContent = `${btn.textContent.replace(/[<>]/g, '')}`; // Adicionar destaque
        } else {
            btn.classList.remove("selected");
            btn.textContent = btn.textContent.replace(/[<>]/g, ''); // Remover destaque
        }
    });
}

function handleMenuNavigation(event) {
    if (event.key === "ArrowUp") {
        selectedIndex = (selectedIndex - 1 + menuButtons.length) % menuButtons.length;
        updateMenuHighlight();
    } else if (event.key === "ArrowDown") {
        selectedIndex = (selectedIndex + 1) % menuButtons.length;
        updateMenuHighlight();
    } else if (event.key === "Enter") {
        menuButtons[selectedIndex].click();
    }
}

// Adicionar eventos de teclado ao menu
document.addEventListener("keydown", handleMenuNavigation);
updateMenuHighlight(); // Iniciar com o primeiro botão selecionado
   
// Função para exibir a tela correta com transição suave
function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
    screen.style.animation = "fadeIn 0.5s ease-in-out";
}

//teste
// Função para iniciar o efeito de clima
function iniciarEfeito(clima) {
    limparEfeito(); // Limpar efeitos anteriores

    if (clima === 'chuva') {
        iniciarChuva();
    } else if (clima === 'tempestade') {
        iniciarTempestade();
    } else if (clima === 'neblina') {
        iniciarNeblina();
    } 
}

// Função para limpar os efeitos de clima
function limparEfeito() {
    const rainContainer = document.querySelector('.rain');
    const lightningContainer = document.querySelector('.lightning');
    const fogContainer = document.querySelector('.fog');
    const snowContainer = document.querySelector('.snow');

    if (rainContainer) {
        rainContainer.remove();
    }
    if (lightningContainer) {
        lightningContainer.remove();
    }
    if (fogContainer) {
        fogContainer.remove();
    }
    if (snowContainer) {
        snowContainer.remove(); // Remove o contêiner de neve
    }
}

// Função para iniciar chuva
function iniciarChuva() {
    const rainContainer = document.createElement('div');
    rainContainer.classList.add('rain');
    document.body.appendChild(rainContainer);  // Certifique-se de que o elemento foi realmente adicionado ao DOM.

    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.classList.add('drop');
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDuration = Math.random() * 1 + 1 + 's';
        rainContainer.appendChild(drop);
    }
}

// Função para iniciar tempestade
function iniciarTempestade() {
    const lightningContainer = document.createElement('div');
    lightningContainer.classList.add('lightning');
    document.body.appendChild(lightningContainer);
    const rainContainer = document.createElement('div');
    rainContainer.classList.add('rain');
    document.body.appendChild(rainContainer);  // Certifique-se de que o elemento foi realmente adicionado ao DOM.

    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.classList.add('drop');
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDuration = Math.random() * 1 + 1 + 's';
        rainContainer.appendChild(drop);
    }
    setInterval(() => {
        lightningContainer.style.left = Math.random() * 100 + 'vw';
        lightningContainer.style.animationDuration = Math.random() * 0.5 + 0.2 + 's';
        lightningContainer.style.animationName = 'flash';
    }, 1000);
}

// Função para iniciar neblina
function iniciarNeblina() {
    const fogContainer = document.createElement('div');
    fogContainer.classList.add('fog');
    document.body.appendChild(fogContainer); // Adiciona a neblina ao DOM.

    const snowContainer = document.createElement('div');
    snowContainer.classList.add('snow');
    document.body.appendChild(snowContainer); // Adiciona o container de neve ao DOM.

    for (let i = 0; i < 100; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.left = Math.random() * 100 + 'vw'; // Posiciona aleatoriamente na largura.
        snowflake.style.animationDuration = Math.random() * 3 + 2 + 's'; // Tempo de queda aleatório (mais lento).
        snowflake.style.animationDelay = Math.random() * 5 + 's'; // Começa em momentos diferentes.
        snowContainer.appendChild(snowflake);
    }
}


function updateClimateEffect() {
    const impact = calculateClimateImpact();
    impactSpan.textContent = impact; // Atualiza o impacto do clima na UI
    iniciarEfeito(gameState.climate); // Dispara o efeito de clima
}



// Seleciona os elementos do DOM
const volumeControl = document.getElementById('volumeControl');
const volumeValue = document.getElementById('volumeValue');
const backgroundMusic = document.getElementById('backgroundMusic');

// Define o volume inicial do áudio (50%)
backgroundMusic.volume = 0.5;

// Atualiza o volume conforme o controle deslizante é ajustado
volumeControl.addEventListener('input', () => {
    const volume = volumeControl.value / 100; // Converte de 0-100 para 0.0-1.0
    backgroundMusic.volume = volume; // Atualiza o volume do áudio
    volumeValue.textContent = `${volumeControl.value}%`; // Exibe o valor atual
});

// Inicia a reprodução da música ao carregar a página
window.addEventListener('load', () => {
    // Tenta reproduzir a música automaticamente
    backgroundMusic.play().catch((error) => {
        console.warn(
            'A reprodução automática pode ter sido bloqueada pelo navegador.',
            error
        );
    });
});

// Adiciona suporte caso a música precise ser iniciada manualmente
document.body.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch((error) => {
            console.error('Erro ao iniciar a reprodução da música:', error);
        });
    }
});



// Seletores para o Game Over e Ranking
const saveScoreButton = document.getElementById("saveScoreButton");
const playerNameInput = document.getElementById("playerName");
const rankingList = document.getElementById("rankingList");

// Função para salvar a pontuação
saveScoreButton.addEventListener("click", () => {
    const playerName = playerNameInput.value.trim();
    if (playerName === "") {
        alert("Por favor, insira um nome!");
        return;
    }

    const playerScore = gameState.score;

    // Obter pontuações existentes ou iniciar um array vazio
    let scores = JSON.parse(localStorage.getItem("ranking")) || [];

    // Verificar se o nome já existe no ranking
    const existingPlayer = scores.find(entry => entry.name === playerName);

    if (existingPlayer) {
        // Se o nome já existe, verificar se a nova pontuação é maior
        if (playerScore > existingPlayer.score) {
            const update = confirm("Você já tem uma pontuação registrada. Deseja atualizar sua pontuação?");
            if (update) {
                existingPlayer.score = playerScore; // Atualizar a pontuação
                alert("Pontuação atualizada!");
            } else {
                alert("Pontuação não atualizada.");
            }
        } else {
            alert("Sua pontuação não é maior do que a atual. Por favor, insira outro nome.");
            playerNameInput.value = ""; // Limpar o campo de nome
            return;
        }
    } else {
        // Se o nome não existe, adicionar nova entrada
        scores.push({ name: playerName, score: playerScore });
    }

    // Limitar o ranking a 10 pessoas
    scores.sort((a, b) => b.score - a.score); // Ordenar por pontuação decrescente
    if (scores.length > 10) {
        scores = scores.slice(0, 10); // Manter apenas as 10 melhores pontuações
    }

    // Salvar novamente no localStorage
    localStorage.setItem("ranking", JSON.stringify(scores));

    // Limpar o formulário e voltar ao menu
    playerNameInput.value = "";
    showScreen(menu);
});

// Atualizar ranking na interface
function updateRankingUI() {
    // Obter pontuações do localStorage
    const scores = JSON.parse(localStorage.getItem("ranking")) || [];

    // Limpar lista atual
    rankingList.innerHTML = "";

    // Adicionar cada pontuação à lista
    scores.forEach((entry, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${index + 1}. ${entry.name} - ${entry.score}`;
        rankingList.appendChild(listItem);
    });
}

// Atualizar a interface de Ranking ao exibir a tela
rankingButton.addEventListener("click", () => {
    updateRankingUI();
    showScreen(ranking);
});


//Teste flicidade
function updatePopulationByHealth() {
    if (gameState.health > 60) {
        gameState.population += Math.floor(gameState.population * 0.02); // Aumento de 2%
    } else if (gameState.health < 50) {
        gameState.population -= Math.floor(gameState.population * 0.03); // Redução de 3%
    }
}
function updatePopulationByHappiness() {
    if (gameState.happiness > 80) {
        gameState.population += Math.floor(gameState.population * 0.015); // Aumento de 1.5%
    } else if (gameState.happiness < 40) {
        gameState.population -= Math.floor(gameState.population * 0.02); // Redução de 2%
    }
}


nextTurnButton.addEventListener("click", () => {
    gameState.turn++;
    gameState.score += 10; // Incrementar pontuação por turno
    changeClimate();
    updatePopulationByHealth();
    updatePopulationByHappiness();
    updateUI();

    // Verificar condições de game over
    if (gameState.health <= 0 || gameState.water <= 0 || gameState.food <= 0 || gameState.happiness <= 0 || gameState.energy <= 0) {
        showGameOver();
    }
});
