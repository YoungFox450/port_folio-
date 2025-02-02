const wordContainer = document.getElementById('word-container'); // Conteneur des mots
const words = ["arbre", "maison", "chat", "chien", "voiture", "ordinateur", "plage", "montagne", "fleur", "soleil"]; // Liste de mots prédéfinis
let currentWord = ''; // Mot actuellement affiché
let currentWordElement = null; // Élément du mot actuellement affiché
let userInput = ''; // Saisie de l'utilisateur
let displayedWords = []; // Tableau pour stocker les mots déjà affichés

// Fonction pour créer et faire défiler un mot
function createWord(word) {
    currentWord = word; // Met à jour le mot actuel
    const wordElement = document.createElement('div');
    wordElement.textContent = word; // Définit le texte du mot
    wordElement.className = 'word'; // Assigne la classe CSS
    currentWordElement = wordElement; // Stocke l'élément du mot courant

    // Positionne le mot aléatoirement sur l'axe horizontal
    wordElement.style.left = Math.random() * (window.innerWidth - 200) + 'px'; // Limite à la largeur de l'écran
    wordElement.style.top = '0px'; // Positionne le mot en haut de l'écran

    wordContainer.appendChild(wordElement); // Ajoute le mot au conteneur

    let position = 0; // Position verticale initiale (en haut de l'écran)
    const fallSpeed = Math.random() * 2 + 1; // Vitesse de chute aléatoire

    const fallInterval = setInterval(() => {
        if (position < window.innerHeight) {
            position += fallSpeed; // Augmente la position du mot selon la vitesse de chute
            wordElement.style.top = position + 'px'; // Met à jour la position verticale du mot
        } else {
            clearInterval(fallInterval); // Arrête l'intervalle si le mot atteint le bas
            wordContainer.removeChild(wordElement); // Supprime le mot du DOM
            resetCurrentWord(); // Réinitialise le mot actuel
        }
    }, 50); // Intervalle de mise à jour tous les 50 ms
}

// Fonction pour créer un mot à intervalles aléatoires
function startWordGeneration() {
    setInterval(() => {
        if (displayedWords.length === words.length) {
            // Si tous les mots ont été affichés, réinitialise le tableau
            displayedWords = [];
        }

        let randomWord;
        do {
            randomWord = words[Math.floor(Math.random() * words.length)]; // Sélectionne un mot aléatoire
        } while (displayedWords.includes(randomWord)); // Vérifie que le mot n'a pas déjà été affiché

        displayedWords.push(randomWord); // Ajoute le mot au tableau des mots affichés
        createWord(randomWord);
    }, Math.random() * 3000 + 1000); // Intervalle entre 1 et 4 secondes
}

// Écouteur d'événements pour les frappes de clavier
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // Compare l'input de l'utilisateur avec le mot actuel
        checkForMatch();
        userInput = ''; // Réinitialise l'input de l'utilisateur après validation
    } else {
        userInput += event.key; // Ajoute la touche pressée à l'input
    }
});

// Fonction pour vérifier si l'input correspond à un mot affiché
function checkForMatch() {
    if (currentWord && userInput === currentWord) {
        // Supprime le mot de l'écran immédiatement
        if (currentWordElement) {
            wordContainer.removeChild(currentWordElement); // Supprime le mot du DOM
            resetCurrentWord(); // Réinitialise le mot actuel
        }
    }
}

// Fonction pour réinitialiser le mot actuel
function resetCurrentWord() {
    currentWord = ''; // Réinitialise le mot actuel
    currentWordElement = null; // Réinitialise l'élément du mot actuel
}

// Démarre la génération de mots
startWordGeneration();