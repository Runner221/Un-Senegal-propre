// Variables globales du jeu
let currentDifficulty = 'facile';
let score = 0;
let timeLeft = 60;
let gameTimer;
let currentTrashItems = [];
let totalItems = 0;
let correctItems = 0;
let highScores = JSON.parse(localStorage.getItem('senegalPropreHighScores')) || {};
let currentStreak = 0;
let maxStreak = 0;
let powerUps = {
  freezeTime: 0,
  doublePoints: 0,
  hint: 3
};
let isSurvivalMode = false;
let survivalLevel = 1;
let gameStats = JSON.parse(localStorage.getItem('senegalPropreStats')) || {
  gamesPlayed: 0,
  totalScore: 0,
  totalTimePlayed: 0,
  perfectGames: 0,
  totalCorrect: 0,
  totalIncorrect: 0
};

// Configuration des niveaux de difficulté
const difficultyConfig = {
  facile: {
    time: 90,
    items: 8,
    points: 10,
    color: '#4CAF50'
  },
  moyen: {
    time: 60,
    items: 12,
    points: 15,
    color: '#FF9800'
  },
  difficile: {
    time: 45,
    items: 16,
    points: 20,
    color: '#f44336'
  },
  survie: {
    time: 30,
    items: 6,
    points: 25,
    color: '#9C27B0'
  }
};

// Base de données des déchets avec emojis
const trashDatabase = {
  plastique: [
    { emoji: "🥤", name: "Bouteille plastique" },
    { emoji: "🛍️", name: "Sachet plastique" },
    { emoji: "🧴", name: "Bouteille de shampoing" },
    { emoji: "📦", name: "Emballage plastique" },
    { emoji: "🥤", name: "Canette" },
    { emoji: "🧴", name: "Bouteille d'huile" }
  ],
  papier: [
    { emoji: "📰", name: "Papier journal" },
    { emoji: "📄", name: "Papier blanc" },
    { emoji: "📚", name: "Livre" },
    { emoji: "📧", name: "Enveloppe" },
    { emoji: "📰", name: "Magazine" },
    { emoji: "📄", name: "Carton" }
  ],
  verre: [
    { emoji: "🍾", name: "Bouteille en verre" },
    { emoji: "🥫", name: "Pot de confiture" },
    { emoji: "🧂", name: "Bocal" },
    { emoji: "🍷", name: "Bouteille de vin" },
    { emoji: "🍾", name: "Bouteille de champagne" },
    { emoji: "🧂", name: "Bouteille d'huile" }
  ],
  organique: [
    { emoji: "🍎", name: "Épluchures de pomme" },
    { emoji: "🥕", name: "Restes de carottes" },
    { emoji: "☕", name: "Marc de café" },
    { emoji: "🥚", name: "Coquilles d'œufs" },
    { emoji: "🍌", name: "Peau de banane" },
    { emoji: "🥬", name: "Feuilles de salade" }
  ]
};

// Effets sonores (utiliser l'API Web Audio)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'sine') {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

// Fonction pour démarrer le jeu
function startGame(difficulty) {
  currentDifficulty = difficulty;
  isSurvivalMode = difficulty === 'survie';
  score = 0;
  correctItems = 0;
  currentStreak = 0;
  maxStreak = 0;
  survivalLevel = 1;
  
  // Reset power-ups
  powerUps = {
    freezeTime: 0,
    doublePoints: 0,
    hint: 3
  };
  
  const config = difficultyConfig[difficulty];
  timeLeft = config.time;
  totalItems = config.items;
  
  // Mettre à jour l'interface
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  document.getElementById('gameOver').classList.add('hidden');
  
  updateUI();
  generateTrashItems();
  startTimer();
  setupDragAndDrop();
  
  // Effet sonore de début
  playSound(440, 0.2);
  playSound(554, 0.2);
  playSound(659, 0.3);
}

// Fonction pour mettre à jour l'interface
function updateUI() {
  document.getElementById('score').textContent = score;
  document.getElementById('level').textContent = isSurvivalMode ? `Survie Niveau ${survivalLevel}` : currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
  document.getElementById('timer').textContent = timeLeft;
  document.getElementById('progress').textContent = correctItems;
  document.getElementById('total').textContent = totalItems;
  
  // Mettre à jour les power-ups
  updatePowerUpsUI();
  
  // Mettre à jour le streak
  const streakElement = document.getElementById('streak');
  if (streakElement) {
    streakElement.textContent = currentStreak;
    streakElement.style.color = currentStreak > 5 ? '#FFD700' : '#fff';
  }
}

// Fonction pour mettre à jour l'interface des power-ups
function updatePowerUpsUI() {
  const powerUpsContainer = document.getElementById('power-ups');
  if (!powerUpsContainer) return;
  
  powerUpsContainer.innerHTML = `
    <div class="power-up ${powerUps.freezeTime > 0 ? 'active' : ''}" title="Geler le temps">
      ⏸️ ${powerUps.freezeTime > 0 ? powerUps.freezeTime : ''}
    </div>
    <div class="power-up ${powerUps.doublePoints > 0 ? 'active' : ''}" title="Points doubles">
      ⭐ ${powerUps.doublePoints > 0 ? powerUps.doublePoints : ''}
    </div>
    <div class="power-up" onclick="useHint()" title="Indice (${powerUps.hint} restants)">
      💡 ${powerUps.hint}
    </div>
  `;
}

// Fonction pour utiliser un indice
function useHint() {
  if (powerUps.hint > 0) {
    powerUps.hint--;
    
    // Trouver un déchet non trié et le mettre en surbrillance
    const trashItems = document.querySelectorAll('#trash-items .trash-item');
    const untriaged = Array.from(trashItems).filter(item => !item.classList.contains('hinted'));
    
    if (untriaged.length > 0) {
      const randomItem = untriaged[Math.floor(Math.random() * untriaged.length)];
      const correctBin = document.querySelector(`[data-type="${randomItem.dataset.category}"]`);
      
      // Animation d'indice
      randomItem.classList.add('hint-flash');
      correctBin.classList.add('hint-glow');
      
      setTimeout(() => {
        randomItem.classList.remove('hint-flash');
        correctBin.classList.remove('hint-glow');
      }, 2000);
      
      playSound(800, 0.5, 'square');
    }
    
    updatePowerUpsUI();
  }
}

// Fonction pour générer les déchets aléatoirement
function generateTrashItems() {
  const trashContainer = document.getElementById('trash-items');
  trashContainer.innerHTML = '';
  currentTrashItems = [];
  
  const categories = Object.keys(trashDatabase);
  const config = difficultyConfig[currentDifficulty];
  const itemsToGenerate = isSurvivalMode ? config.items + Math.floor(survivalLevel / 2) : config.items;
  
  console.log(`Génération de ${itemsToGenerate} déchets pour le niveau ${survivalLevel || 1}`);
  
  for (let i = 0; i < itemsToGenerate; i++) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryItems = trashDatabase[randomCategory];
    const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
    
    const div = document.createElement('div');
    div.className = 'trash-item';
    div.innerHTML = `<span class="trash-emoji">${randomItem.emoji}</span>`;
    div.draggable = true;
    div.dataset.category = randomCategory;
    div.dataset.name = randomItem.name;
    div.dataset.emoji = randomItem.emoji;
    
    // Animation d'apparition
    div.style.opacity = '0';
    div.style.transform = 'scale(0) rotate(180deg)';
    
    trashContainer.appendChild(div);
    
    // Animation d'entrée
    setTimeout(() => {
      div.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      div.style.opacity = '1';
      div.style.transform = 'scale(1) rotate(0deg)';
    }, i * 100);
    
    currentTrashItems.push({
      element: div,
      category: randomCategory,
      name: randomItem.name,
      emoji: randomItem.emoji
    });
  }
  
  totalItems = itemsToGenerate;
  updateUI();
  
  // Vérifier que tous les éléments sont bien configurés
  setTimeout(() => {
    const allTrashItems = document.querySelectorAll('#trash-items .trash-item');
    console.log(`Éléments générés: ${allTrashItems.length}, draggable: ${Array.from(allTrashItems).filter(el => el.draggable).length}`);
  }, 100);
}

// Fonction pour configurer le drag and drop
function setupDragAndDrop() {
  const trashItems = document.querySelectorAll('#trash-items .trash-item');
  console.log(`Configuration du drag & drop pour ${trashItems.length} éléments`);
  
  trashItems.forEach((item, index) => {
    // Supprimer les anciens event listeners pour éviter les doublons
    item.removeEventListener('dragstart', handleDragStart);
    
    // Ajouter le nouvel event listener
    item.addEventListener('dragstart', handleDragStart);
    
    // Vérifier que l'élément est bien configuré
    if (!item.draggable) {
      console.warn(`Élément ${index} n'est pas draggable`);
      item.draggable = true;
    }
  });
  
  console.log(`Drag & drop configuré pour ${trashItems.length} éléments`);
}

// Gestionnaire de début de drag
function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.category);
  e.dataTransfer.setData('name', e.target.dataset.name);
  e.dataTransfer.setData('emoji', e.target.dataset.emoji);
  
  // Animation de drag
  e.target.style.transform = 'scale(1.1) rotate(5deg)';
  e.target.style.zIndex = '1000';
}

// Autoriser le drop
function allowDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

// Gestionnaire de drop
function drop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  
  const bin = e.currentTarget;
  const binType = bin.dataset.type;
  const droppedCategory = e.dataTransfer.getData('text/plain');
  const droppedName = e.dataTransfer.getData('name');
  const droppedEmoji = e.dataTransfer.getData('emoji');
  
  // Vérifier si le tri est correct
  if (binType === droppedCategory) {
    // Tri correct
    const basePoints = difficultyConfig[currentDifficulty].points;
    const multiplier = powerUps.doublePoints > 0 ? 2 : 1;
    const streakBonus = Math.floor(currentStreak / 3) * 5;
    const pointsEarned = (basePoints + streakBonus) * multiplier;
    
    score += pointsEarned;
    correctItems++;
    currentStreak++;
    maxStreak = Math.max(maxStreak, currentStreak);
    
    // Animation de succès
    bin.classList.add('correct');
    playSound(659, 0.2);
    playSound(784, 0.2);
    playSound(1047, 0.3);
    
    // Effet de particules
    createParticles(bin, '#4CAF50');
    
    setTimeout(() => bin.classList.remove('correct'), 500);
    
    // Ajouter l'emoji dans la poubelle
    const binContent = bin.querySelector('.bin-content');
    const span = document.createElement('span');
    span.className = 'bin-emoji';
    span.textContent = droppedEmoji;
    span.title = droppedName;
    span.style.animation = 'bounceIn 0.6s ease';
    binContent.appendChild(span);
    
    // Supprimer l'élément de la zone de déchets
    const trashItems = document.querySelectorAll('#trash-items .trash-item');
    for (let item of trashItems) {
      if (item.dataset.category === droppedCategory && item.dataset.name === droppedName) {
        item.style.transition = 'all 0.3s ease';
        item.style.transform = 'scale(0) rotate(360deg)';
        item.style.opacity = '0';
        setTimeout(() => item.remove(), 300);
        break;
      }
    }
    
    // Chance d'obtenir un power-up
    if (Math.random() < 0.1) {
      const powerUpTypes = ['freezeTime', 'doublePoints'];
      const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
      powerUps[randomPowerUp] += 3;
      showPowerUpNotification(randomPowerUp);
    }
    
    updateUI();
    
    // Vérifier si le jeu est terminé
    if (correctItems >= totalItems) {
      if (isSurvivalMode) {
        nextSurvivalLevel();
      } else {
        endGame(true);
      }
    }
  } else {
    // Tri incorrect
    score = Math.max(0, score - 5);
    currentStreak = 0;
    gameStats.totalIncorrect++;
    
    // Animation d'erreur
    bin.classList.add('incorrect');
    playSound(200, 0.3, 'sawtooth');
    
    // Effet de particules rouges
    createParticles(bin, '#f44336');
    
    setTimeout(() => bin.classList.remove('incorrect'), 500);
    updateUI();
  }
}

// Fonction pour créer des particules
function createParticles(element, color) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      width: 8px;
      height: 8px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
    `;
    
    document.body.appendChild(particle);
    
    const angle = (i / 8) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance;
    
    particle.animate([
      { transform: 'scale(0)', opacity: 1 },
      { transform: 'scale(1)', opacity: 1, offset: 0.1 },
      { transform: 'scale(0)', opacity: 0, left: endX + 'px', top: endY + 'px' }
    ], {
      duration: 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => particle.remove();
  }
}

// Fonction pour passer au niveau suivant en mode survie
function nextSurvivalLevel() {
  survivalLevel++;
  correctItems = 0;
  timeLeft = difficultyConfig.survie.time + Math.floor(survivalLevel / 2) * 5;
  
  // Animation de transition
  const gameArea = document.querySelector('.game-area');
  gameArea.style.animation = 'levelTransition 0.5s ease';
  
  setTimeout(() => {
    gameArea.style.animation = '';
    generateTrashItems();
    setupDragAndDrop(); // Réconfigurer le drag & drop pour les nouveaux éléments
    updateUI();
  }, 500);
  
  // Notification de niveau
  showNotification(`Niveau ${survivalLevel} !`, '#9C27B0');
}

// Fonction pour afficher une notification
function showNotification(message, color = '#4CAF50') {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${color};
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Fonction pour afficher une notification de power-up
function showPowerUpNotification(type) {
  const messages = {
    freezeTime: '⏸️ Temps gelé !',
    doublePoints: '⭐ Points doubles !'
  };
  showNotification(messages[type], '#FFD700');
}

// Fonction pour démarrer le timer
function startTimer() {
  gameTimer = setInterval(() => {
    if (powerUps.freezeTime > 0) {
      powerUps.freezeTime--;
      updatePowerUpsUI();
    } else {
      timeLeft--;
      document.getElementById('timer').textContent = timeLeft;
      
      // Animation du timer quand il reste peu de temps
      if (timeLeft <= 10) {
        document.getElementById('timer').style.animation = 'pulse 1s infinite';
        if (timeLeft <= 5) {
          playSound(400, 0.1, 'square');
        }
      }
      
      if (timeLeft <= 0) {
        endGame(false);
      }
    }
    
    // Mettre à jour les power-ups
    if (powerUps.doublePoints > 0) {
      powerUps.doublePoints--;
      updatePowerUpsUI();
    }
  }, 1000);
}

// Fonction pour terminer le jeu
function endGame(won) {
  clearInterval(gameTimer);
  
  // Mettre à jour les statistiques
  gameStats.gamesPlayed++;
  gameStats.totalScore += score;
  gameStats.totalTimePlayed += difficultyConfig[currentDifficulty].time - timeLeft;
  gameStats.totalCorrect += correctItems;
  
  if (won && correctItems === totalItems) {
    gameStats.perfectGames++;
  }
  
  // Sauvegarder les statistiques
  localStorage.setItem('senegalPropreStats', JSON.stringify(gameStats));
  
  // Mettre à jour les high scores
  if (!highScores[currentDifficulty]) {
    highScores[currentDifficulty] = [];
  }
  
  const newScore = {
    score: score,
    date: new Date().toLocaleDateString(),
    streak: maxStreak,
    perfect: correctItems === totalItems
  };
  
  highScores[currentDifficulty].push(newScore);
  highScores[currentDifficulty].sort((a, b) => b.score - a.score);
  highScores[currentDifficulty] = highScores[currentDifficulty].slice(0, 5);
  
  localStorage.setItem('senegalPropreHighScores', JSON.stringify(highScores));
  
  document.getElementById('game').classList.add('hidden');
  document.getElementById('gameOver').classList.remove('hidden');
  
  document.getElementById('finalScore').textContent = score;
  document.getElementById('finalLevel').textContent = isSurvivalMode ? `Survie Niveau ${survivalLevel}` : currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
  
  // Afficher les statistiques détaillées
  showDetailedStats();
  
  // Message de félicitations si gagné
  const gameOverTitle = document.querySelector('#gameOver h2');
  if (won) {
    gameOverTitle.textContent = '🎉 Félicitations! Vous avez gagné! 🎉';
    playSound(523, 0.2);
    playSound(659, 0.2);
    playSound(784, 0.2);
    playSound(1047, 0.3);
  } else {
    gameOverTitle.textContent = '⏰ Temps écoulé!';
    playSound(200, 0.5, 'sawtooth');
  }
}

// Fonction pour afficher les statistiques détaillées
function showDetailedStats() {
  const statsContainer = document.getElementById('detailedStats');
  if (!statsContainer) return;
  
  const accuracy = gameStats.totalCorrect + gameStats.totalIncorrect > 0 
    ? Math.round((gameStats.totalCorrect / (gameStats.totalCorrect + gameStats.totalIncorrect)) * 100)
    : 0;
  
  statsContainer.innerHTML = `
    <div class="stat-item">
      <span class="stat-label">Précision:</span>
      <span class="stat-value">${accuracy}%</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Série max:</span>
      <span class="stat-value">${maxStreak}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Parties jouées:</span>
      <span class="stat-value">${gameStats.gamesPlayed}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Score total:</span>
      <span class="stat-value">${gameStats.totalScore}</span>
    </div>
  `;
}

// Fonction pour retourner au menu
function backToMenu() {
  clearInterval(gameTimer);
  
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('game').classList.add('hidden');
  document.getElementById('gameOver').classList.add('hidden');
  
  // Nettoyer les poubelles
  document.querySelectorAll('.bin-content').forEach(content => {
    content.innerHTML = '';
  });
  
  // Reset des animations
  document.getElementById('timer').style.animation = '';
}

// Fonction pour recommencer le jeu
function restartGame() {
  // Nettoyer complètement les poubelles
  document.querySelectorAll('.bin-content').forEach(content => {
    content.innerHTML = '';
  });
  
  // Redémarrer le jeu avec le même niveau
  startGame(currentDifficulty);
}

// Fonction pour afficher les high scores
function showHighScores() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>🏆 Meilleurs Scores</h2>
      <div class="high-scores">
        ${Object.entries(highScores).map(([difficulty, scores]) => `
          <div class="difficulty-scores">
            <h3>${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h3>
            ${scores.map((score, index) => `
              <div class="score-item ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">
                <span class="rank">${index + 1}</span>
                <span class="score">${score.score}</span>
                <span class="date">${score.date}</span>
                ${score.perfect ? '<span class="perfect">⭐</span>' : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="btn-close">Fermer</button>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  // Afficher le menu principal
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('game').classList.add('hidden');
  document.getElementById('gameOver').classList.add('hidden');
  
  // Ajouter les boutons manquants au menu
  const menu = document.querySelector('.menu');
  if (menu && !document.querySelector('.btn-survie')) {
    const difficultyButtons = menu.querySelector('.difficulty-buttons');
    difficultyButtons.innerHTML += '<button onclick="startGame(\'survie\')" class="btn-survie">Mode Survie</button>';
    difficultyButtons.innerHTML += '<button onclick="showHighScores()" class="btn-scores">🏆 Scores</button>';
  }
});