const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const pauseScreen = document.getElementById('pause-screen');
const gameInterface = document.getElementById('game-interface');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const returnButton = document.getElementById('return-button');
const returnHomeButton = document.getElementById('return-home-button');
const resumeButton = document.getElementById('resume-button');
const quitButton = document.getElementById('quit-button');
const finalScoreDisplay = document.getElementById('final-score');

const wordContainer = document.getElementById('word-container');
const userInput = document.getElementById('user-input');
const scoreDisplay = document.getElementById('score-display');
const heartsContainer = document.getElementById('hearts-container');
let score = 0;
let hearts = 4;
let isPaused = false;
let wordGenerationInterval;

// Cotes des lettres en fonction de leur fréquence en français
const letterScores = {
    'e': 1, 'a': 2, 's': 2, 'i': 2, 'n': 2,
    't': 3, 'r': 3, 'u': 3, 'l': 3, 'o': 3,
    'd': 4, 'c': 4, 'm': 4, 'p': 4,
    'g': 5, 'b': 5, 'v': 5, 'h': 5, 'f': 5,
    'q': 6, 'y': 6,
    'x': 7, 'j': 7, 'k': 7, 'w': 7, 'z': 7
};

// Liste de mots enrichie avec des verbes, adjectifs, noms, etc.
const words = [
    // Noms communs
    "arbre", "maison", "chat", "chien", "voiture", "ordinateur", "plage", "montagne", "fleur", "soleil",
    "livre", "école", "travail", "musique", "film", "restaurant", "ville", "pays", "rivière", "forêt",
    "avion", "train", "vélo", "pont", "étoile", "lune", "nuage", "pluie", "neige", "vent",
    "ordinateur", "téléphone", "internet", "réseau", "programme", "application", "écran", "clavier", "souris", "imprimante",
    "amour", "joie", "tristesse", "colère", "peur", "surprise", "bonheur", "souvenir", "rêve", "espoir",
    "café", "thé", "eau", "jus", "lait", "vin", "bière", "pain", "fromage", "fruits",
    "sport", "football", "basketball", "tennis", "natation", "course", "vélo", "yoga", "danse", "musculation",
    "histoire", "géographie", "mathématiques", "science", "physique", "chimie", "biologie", "littérature", "philosophie", "art",

    // Verbes
    "manger", "boire", "dormir", "lire", "écrire", "parler", "marcher", "courir", "nager", "jouer",
    "apprendre", "enseigner", "travailler", "voyager", "écouter", "regarder", "acheter", "vendre", "donner", "recevoir",
    "aimer", "détester", "penser", "réfléchir", "comprendre", "expliquer", "demander", "répondre", "chercher", "trouver",

    // Adjectifs
    "grand", "petit", "rapide", "lent", "heureux", "triste", "intelligent", "stupide", "beau", "laid",
    "fort", "faible", "chaud", "froid", "nouveau", "ancien", "jeune", "vieux", "facile", "difficile",
    "clair", "sombre", "propre", "sale", "calme", "bruyant", "pauvre", "riche", "vide", "plein"
];

// Variables pour gérer les mots récemment utilisés
const recentlyUsedWords = [];
const minWordsBeforeRepeat = 13;
const maxWordsBeforeRepeat = 20;

// Fonction pour obtenir un mot aléatoire qui n'est pas dans la file d'attente
function getRandomWord() {
    let availableWords = words.filter(word => !recentlyUsedWords.includes(word));
    if (availableWords.length === 0) {
        recentlyUsedWords.length = 0;
        availableWords = [...words];
    }
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    return randomWord;
}

// Fonction pour calculer la valeur d'un mot
function calculateWordValue(word) {
    let total = 0;
    for (const letter of word.toLowerCase()) {
        total += letterScores[letter] || 0; // Ajoute la cote de chaque lettre
    }
    return Math.round(total / 3); // Divise par 3 et arrondit
}

// Fonction pour obtenir une couleur en fonction de l'indice pondéral
function getColorForWord(wordValue) {
    // Normaliser l'indice pondéral entre 0 et 1
    const normalizedValue = (wordValue - 1) / 6; // Les valeurs vont de 1 à 7

    // Définir les palettes de couleurs
    if (normalizedValue > 0.66) {
        // Palette rouge (scores élevés)
        const red = Math.round(255 * (normalizedValue - 0.66) / 0.34);
        return `rgb(255, ${100 - red}, ${100 - red})`;
    } else if (normalizedValue > 0.33) {
        // Palette bleue (scores moyens)
        const blue = Math.round(255 * (normalizedValue - 0.33) / 0.33);
        return `rgb(${100 - blue}, ${100 - blue}, 255)`;
    } else {
        // Palette verte (scores faibles)
        const green = Math.round(255 * normalizedValue / 0.33);
        return `rgb(${100 - green}, 255, ${100 - green})`;
    }
}

// Fonction pour créer et faire tomber un mot
function createWord() {
    if (isPaused) return; // Ne pas créer de mots si le jeu est en pause

    const word = getRandomWord();
    const wordElement = document.createElement('div');
    wordElement.textContent = word;
    wordElement.className = 'word';

    // Calculer la valeur du mot et sa couleur
    const wordValue = calculateWordValue(word);
    const wordColor = getColorForWord(wordValue);
    wordElement.style.color = wordColor;

    wordElement.style.left = Math.random() * 80 + 'vw';
    wordElement.style.top = '0px';

    wordContainer.appendChild(wordElement);

    let position = 0;
    const fallSpeed = Math.random() * 2 + 1; // Vitesse de chute aléatoire entre 1 et 3 secondes

    const fallInterval = setInterval(() => {
        if (isPaused) return; // Ne pas faire tomber le mot si le jeu est en pause

        if (position < window.innerHeight) {
            position += fallSpeed;
            wordElement.style.top = position + 'px';
        } else {
            clearInterval(fallInterval);
            wordContainer.removeChild(wordElement);
            loseHeart(); // Perdre un cœur si le mot atteint le bas
        }
    }, 50);

    recentlyUsedWords.push(word);
    if (recentlyUsedWords.length > maxWordsBeforeRepeat) {
        recentlyUsedWords.shift();
    }
}

// Fonction pour générer des mots à intervalles aléatoires
function startWordGeneration() {
    return setInterval(() => {
        createWord();
    }, Math.random() * 3000 + 1000);
}

// Fonction pour mettre à jour le score
function updateScore(word) {
    const wordValue = calculateWordValue(word);
    score += wordValue;
    scoreDisplay.textContent = `Score: ${score}`;
}

// Fonction pour perdre un cœur
function loseHeart() {
    if (hearts > 0) {
        hearts--;
        heartsContainer.children[hearts].style.display = 'none';
        if (hearts === 0) {
            endGame();
        }
    }
}

// Fonction pour terminer le jeu
function endGame() {
    clearInterval(wordGenerationInterval); // Arrêter la génération de mots
    gameInterface.classList.add('hidden'); // Masquer l'interface du jeu
    finalScoreDisplay.textContent = score; // Afficher le score final
    endScreen.classList.remove('hidden'); // Afficher l'écran de fin
}

// Fonction pour redémarrer le jeu
function restartGame() {
    score = 0;
    hearts = 4;
    scoreDisplay.textContent = `Score: ${score}`;
    heartsContainer.innerHTML = '<span class="heart">❤️</span><span class="heart">❤️</span><span class="heart">❤️</span><span class="heart">❤️</span>';
    wordContainer.innerHTML = '';
    endScreen.classList.add('hidden');
    gameInterface.classList.remove('hidden');
    wordGenerationInterval = startWordGeneration();
    userInput.focus(); // Focus sur l'input
}

// Fonction pour retourner à la page index.html du même dossier
function returnToPage() {
    window.location.href = "index.html"; // Redirige vers index.html dans le même dossier
}

// Fonction pour mettre le jeu en pause
function pauseGame() {
    isPaused = true;
    pauseScreen.classList.remove('hidden');
}

// Fonction pour reprendre le jeu
function resumeGame() {
    isPaused = false;
    pauseScreen.classList.add('hidden');
    userInput.focus(); // Focus sur l'input
}

// Écouteurs d'événements
startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameInterface.classList.remove('hidden');
    wordGenerationInterval = startWordGeneration();
    userInput.focus(); // Focus sur l'input
});

restartButton.addEventListener('click', restartGame);
returnButton.addEventListener('click', returnToPage);
returnHomeButton.addEventListener('click', returnToPage);
resumeButton.addEventListener('click', resumeGame);
quitButton.addEventListener('click', returnToPage);

// Détection de la touche Échap pour mettre en pause
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && gameInterface.classList.contains('hidden') === false) {
        pauseGame();
    }
});

userInput.addEventListener('input', () => {
    const typedWord = userInput.value.trim();
    const wordElements = document.querySelectorAll('.word');

    wordElements.forEach(wordElement => {
        if (wordElement.textContent === typedWord) {
            wordElement.classList.add('correct');
            setTimeout(() => {
                wordContainer.removeChild(wordElement);
            }, 500);
            userInput.value = '';
            updateScore(typedWord); // Met à jour le score avec la valeur du mot
        }
    });
});

// Initialisation