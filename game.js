// Game state
const gameState = {
    gemstones: 0,
    pickaxes: {
        wooden: 1,
        stone: 0,
        iron: 0
    },
    currentPickaxe: 'wooden',
    pickaxeHealth: 5,
    biome: 'plain',
    biomeHealth: 10,
    crackCount: 0
};

// DOM elements
const biomeElement = document.getElementById('biome');
const pickaxeCursor = document.getElementById('pickaxe-cursor');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit-btn');
const gemstoneCount = document.getElementById('gemstone-count');
const pickaxeCount = document.getElementById('pickaxe-count');
const gameOverModal = document.getElementById('game-over');
const restartButton = document.getElementById('restart-btn');
const buyButtons = document.querySelectorAll('.buy-btn');

// Current math problem
let currentProblem = {
    num1: 0,
    num2: 0,
    operator: '+',
    answer: 0
};

// Initialize the game
function initGame() {
    // Reset game state
    gameState.gemstones = 0;
    gameState.pickaxes = { wooden: 1, stone: 0, iron: 0 };
    gameState.currentPickaxe = 'wooden';
    gameState.pickaxeHealth = 5;
    gameState.biome = 'plain';
    gameState.biomeHealth = 10;
    gameState.crackCount = 0;

    // Update UI
    updateUI();

    // Generate first math problem
    generateMathProblem();

    // Hide game over modal if visible
    gameOverModal.classList.remove('show');

    // Clear any existing cracks and gemstones
    clearBiome();
}

// Generate a math problem based on difficulty
function generateMathProblem() {
    // For now, simple addition and subtraction within 20
    const operation = Math.random() > 0.5 ? '+' : '-';

    let num1, num2;

    if (operation === '+') {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
    } else {
        num1 = Math.floor(Math.random() * 10) + 10; // Ensure larger number first
        num2 = Math.floor(Math.random() * num1) + 1;
    }

    currentProblem = {
        num1,
        num2,
        operator: operation,
        answer: operation === '+' ? num1 + num2 : num1 - num2
    };

    questionElement.textContent = `${num1} ${operation} ${num2} = ?`;
    answerInput.value = '';
    answerInput.focus();
}

// Check the user's answer
function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);

    if (isNaN(userAnswer)) {
        return; // Invalid input
    }

    if (userAnswer === currentProblem.answer) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }

    // Generate new problem
    generateMathProblem();
}

// Handle correct answer
function handleCorrectAnswer() {
    // Add crack to biome
    addCrackToBiome();

    // Check if biome is completely cracked
    gameState.crackCount++;
    if (gameState.crackCount >= gameState.biomeHealth) {
        revealGemstone();
        gameState.crackCount = 0;
    }

    // Play animation
    animatePickaxeSwing();
}

// Handle wrong answer
function handleWrongAnswer() {
    // Reduce pickaxe health
    gameState.pickaxeHealth--;

    // Check if pickaxe is broken
    if (gameState.pickaxeHealth <= 0) {
        breakPickaxe();
    }

    // Show animation
    animatePickaxeSwing();
}

// Add a crack to the biome
function addCrackToBiome() {
    const crack = document.createElement('div');
    crack.className = 'crack';

    // Position the crack at a random spot in the biome
    const x = Math.floor(Math.random() * (biomeElement.offsetWidth - 40));
    const y = Math.floor(Math.random() * (biomeElement.offsetHeight - 40));

    crack.style.left = `${x}px`;
    crack.style.top = `${y}px`;

    biomeElement.appendChild(crack);
}

// Reveal a gemstone
function revealGemstone() {
    // Create gemstone element
    const gemstone = document.createElement('div');
    gemstone.className = 'gemstone';

    // Position the gemstone at a random spot in the biome
    const x = Math.floor(Math.random() * (biomeElement.offsetWidth - 50));
    const y = Math.floor(Math.random() * (biomeElement.offsetHeight - 50));

    gemstone.style.left = `${x}px`;
    gemstone.style.top = `${y}px`;

    biomeElement.appendChild(gemstone);

    // Add click event to collect the gemstone
    gemstone.addEventListener('click', () => {
        collectGemstone(gemstone);
    });

    // Clear all cracks
    clearCracks();
}

// Collect a gemstone
function collectGemstone(gemstone) {
    // Remove the gemstone element
    gemstone.remove();

    // Increment gemstone count
    gameState.gemstones++;

    // Update UI
    updateUI();
}

// Break the current pickaxe
function breakPickaxe() {
    // Reduce pickaxe count
    gameState.pickaxes[gameState.currentPickaxe]--;

    // Check if there are any pickaxes left
    const totalPickaxes = Object.values(gameState.pickaxes).reduce((sum, count) => sum + count, 0);

    if (totalPickaxes === 0) {
        // Game over
        gameOver();
    } else {
        // Find the next available pickaxe
        for (const type in gameState.pickaxes) {
            if (gameState.pickaxes[type] > 0) {
                gameState.currentPickaxe = type;
                break;
            }
        }

        // Reset pickaxe health based on type
        if (gameState.currentPickaxe === 'wooden') {
            gameState.pickaxeHealth = 5;
        } else if (gameState.currentPickaxe === 'stone') {
            gameState.pickaxeHealth = 10;
        } else if (gameState.currentPickaxe === 'iron') {
            gameState.pickaxeHealth = 15;
        }
    }

    // Update UI
    updateUI();
}

// Game over
function gameOver() {
    gameOverModal.classList.add('show');
}

// Clear all cracks
function clearCracks() {
    const cracks = document.querySelectorAll('.crack');
    cracks.forEach(crack => crack.remove());
}

// Clear biome (remove all cracks and gemstones)
function clearBiome() {
    clearCracks();
    const gemstones = document.querySelectorAll('.gemstone');
    gemstones.forEach(gemstone => gemstone.remove());
}

// Update the UI based on game state
function updateUI() {
    // Update gemstone count
    gemstoneCount.textContent = gameState.gemstones;

    // Update pickaxe count
    pickaxeCount.textContent = Object.values(gameState.pickaxes).reduce((sum, count) => sum + count, 0);

    // Update shop item availability
    updateShopItems();
}

// Update shop items based on available gemstones
function updateShopItems() {
    buyButtons.forEach(button => {
        const item = button.parentElement;
        const cost = parseInt(item.dataset.cost);

        if (gameState.gemstones >= cost) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
}

// Animate pickaxe swing
function animatePickaxeSwing() {
    const pickaxeImg = pickaxeCursor.querySelector('img');

    // Remove any existing animation
    pickaxeImg.style.animation = 'none';

    // Trigger reflow
    void pickaxeImg.offsetWidth;

    // Add animation
    pickaxeImg.style.animation = 'swing 0.3s ease-in-out';
}

// Buy an item from the shop
function buyItem(item, cost) {
    if (gameState.gemstones >= cost) {
        gameState.gemstones -= cost;

        if (item === 'stone-pickaxe') {
            gameState.pickaxes.stone++;
        } else if (item === 'iron-pickaxe') {
            gameState.pickaxes.iron++;
        } else if (item === 'desert-biome') {
            gameState.biome = 'desert';
            biomeElement.classList.add('desert');
            gameState.biomeHealth = 15; // Desert biome is harder
            clearBiome();
        }

        updateUI();
    }
}

// Event listeners
submitButton.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Restart button
restartButton.addEventListener('click', initGame);

// Buy buttons
buyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        const itemType = item.dataset.item;
        const cost = parseInt(item.dataset.cost);

        buyItem(itemType, cost);
    });
});

// Move pickaxe cursor with mouse
biomeElement.addEventListener('mousemove', (e) => {
    const rect = biomeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pickaxeCursor.style.left = `${x}px`;
    pickaxeCursor.style.top = `${y}px`;
});

// Initialize the game on load
window.addEventListener('load', initGame); 