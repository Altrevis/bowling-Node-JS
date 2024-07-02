// Import the readline module to read user input from the console
const readline = require('readline');

// Create a readline interface for standard input and output
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Class representing a 'joueur' in the bowling game
class Player {
    constructor(name) {
        this.name = name; // 'Nom' of the 'joueur'
        this.frames = Array.from({ length: 10 }, () => new Frame()); // Initialize 10 'frames' for each 'joueur'
        this.totalScore = 0; // 'Score total' of the 'joueur'
        this.currentFrameIndex = 0; // Index of the current 'frame'
    }

    // Adds a 'lancer' (number of 'quilles' knocked down) to the current 'frame'
    addThrow(pins) {
        this.frames[this.currentFrameIndex].addThrow(pins);
    }

    // Calculates the 'score total' of the 'joueur', considering bonuses for 'strikes' and 'spares'
    calculateScore() {
        let score = 0;
        for (let i = 0; i <= this.currentFrameIndex; i++) {
            const frame = this.frames[i];
            if (frame.isStrike()) {
                score += 10 + this.strikeBonus(i); // Add 10 plus the 'bonus strike'
            } else if (frame.isSpare()) {
                score += 10 + this.spareBonus(i); // Add 10 plus the 'bonus spare'
            } else {
                score += frame.getFirstThrow() + frame.getSecondThrow(); // Add points of the two 'lancers' in the 'frame'
            }
        }
        this.totalScore = score; // Update the 'score total'
    }

    // Calculates the 'bonus' for a 'strike'
    strikeBonus(frameIndex) {
        const nextFrame = this.frames[frameIndex + 1];
        if (nextFrame) {
            return nextFrame.getFirstThrow() + nextFrame.getSecondThrow(); // 'Bonus' = next two 'lancers'
        }
        return 0;
    }

    // Calculates the 'bonus' for a 'spare'
    spareBonus(frameIndex) {
        const nextFrame = this.frames[frameIndex + 1];
        if (nextFrame) {
            return nextFrame.getFirstThrow(); // 'Bonus' = next first 'lancer'
        }
        return 0;
    }
}

// Class representing a 'frame' in the bowling game
class Frame {
    constructor() {
        this.throws = []; // 'Lancers' in this 'frame'
    }

    // Adds a 'lancer' to the 'frame'
    addThrow(pins) {
        this.throws.push(pins);
    }

    // Gets the first 'lancer'
    getFirstThrow() {
        return this.throws[0] || 0;
    }

    // Gets the second 'lancer'
    getSecondThrow() {
        return this.throws[1] || 0;
    }

    // Checks if the 'frame' is a 'strike'
    isStrike() {
        return this.throws[0] === 10;
    }

    // Checks if the 'frame' is a 'spare'
    isSpare() {
        return this.throws.length === 2 && this.getFirstThrow() + this.getSecondThrow() === 10;
    }
}

// Array of 'joueurs'
let players = [];
let currentPlayerIndex = 0; // Index of the current 'joueur'

// Function to start the game
function startGame() {
    console.log('Démarrez une nouvelle partie de bowling.');

    // Ask for the number of 'joueurs'
    const askNumberOfPlayers = () => {
        rl.question('Entrez le nombre de joueurs (entre 1 et 6): ', (answer) => {
            const numPlayers = parseInt(answer);
            if (isNaN(numPlayers) || numPlayers < 1 || numPlayers > 6) {
                console.log('Nombre de joueurs invalide. Veuillez entrer un nombre entre 1 et 6.');
                askNumberOfPlayers(); // Ask again for invalid input
            } else {
                askPlayerNames(numPlayers); // Move to asking for 'noms' of 'joueurs'
            }
        });
    };

    askNumberOfPlayers(); // Start asking for the number of 'joueurs'
}

// Function to ask for 'noms' of 'joueurs'
function askPlayerNames(numPlayers) {
    if (players.length < numPlayers) {
        rl.question(`Entrez le nom du joueur ${players.length + 1}: `, (name) => {
            players.push(new Player(name)); // Add a new 'joueur' to the list
            askPlayerNames(numPlayers); // Continue asking for 'noms'
        });
    } else {
        playFrame(); // Start the game once all 'noms' of 'joueurs' are entered
    }
}

// Function to play a 'frame'
function playFrame() {
    const currentPlayer = players[currentPlayerIndex];
    const currentFrame = currentPlayer.frames[currentPlayer.currentFrameIndex];

    console.log(`Frame ${currentPlayer.currentFrameIndex + 1}, lancer 1.`);
    playThrow(currentPlayer, currentFrame, 1); // Request the first 'lancer'
}

// Function to play a 'lancer'
function playThrow(player, frame, throwNumber) {
    rl.question(`${player.name}, combien de quilles avez-vous renversé ? `, (answer) => {
        const pins = parseInt(answer);
        
        if (!isNaN(pins) && pins >= 0 && pins <= 10) {
            frame.addThrow(pins); // Add the 'lancer' to the 'frame'
            
            if (throwNumber === 1 && !frame.isStrike()) { // If not a 'strike', request the second 'lancer'
                console.log(`Frame ${player.currentFrameIndex + 1}, lancer 2.`);
                playThrow(player, frame, 2);
            } else {
                if (player.currentFrameIndex < 9 || (player.currentFrameIndex === 9 && !frame.isStrike() && !frame.isSpare())) {
                    // If not the last 'frame' or last 'frame' without 'strike' or 'spare'
                    player.calculateScore();
                    console.log(`Score après le frame ${player.currentFrameIndex + 1}:`);
                    players.forEach(p => console.log(`${p.name}: ${p.totalScore}`));
                    player.currentFrameIndex++; // Move to the next 'frame'
                    currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // Move to the next 'joueur'
                    playFrame(); // Play the next 'frame'
                } else {
                    if (frame.isStrike() || frame.isSpare()) {
                        // If a 'strike' or 'spare' in the last 'frame', request an additional 'lancer'
                        console.log(`Frame ${player.currentFrameIndex + 1}, lancer 2.`);
                        playThrow(player, frame, 2);
                    } else {
                        endGame(); // End the game
                    }
                }
            }
        } else {
            console.log('Nombre de quilles invalide. Veuillez entrer un nombre entre 0 et 10.');
            playThrow(player, frame, throwNumber); // Ask again for invalid input
        }
    });
}

// Function to end the game and display final scores
function endGame() {
    players.forEach(player => player.calculateScore()); // Recalculate scores
    console.log('Score final:');
    players.forEach(player => console.log(`${player.name}: ${player.totalScore}`));

    let maxScore = Math.max(...players.map(player => player.totalScore));
    let winners = players.filter(player => player.totalScore === maxScore).map(player => player.name);
    if (winners.length === 1) {
        console.log(`${winners[0]} est le/la gagnant(e) !`);
    } else {
        console.log(`Il y a une égalité entre les joueurs suivants : ${winners.join(', ')}`);
    }

    rl.close(); // Close the readline interface
}

// Start the game
startGame();
