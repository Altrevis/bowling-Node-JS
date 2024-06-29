const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Player {
    constructor(name) {
        this.name = name;
        this.frames = Array.from({ length: 10 }, () => new Frame());
        this.totalScore = 0;
        this.currentFrameIndex = 0;
    }

    addThrow(pins) {
        this.frames[this.currentFrameIndex].addThrow(pins);
    }

    calculateScore() {
        let score = 0;
        for (let i = 0; i <= this.currentFrameIndex; i++) {
            const frame = this.frames[i];
            if (frame.isStrike()) {
                score += 10 + this.strikeBonus(i);
            } else if (frame.isSpare()) {
                score += 10 + this.spareBonus(i);
            } else {
                score += frame.getFirstThrow() + frame.getSecondThrow();
            }
        }
        this.totalScore = score;
    }

    strikeBonus(frameIndex) {
        const nextFrame = this.frames[frameIndex + 1];
        if (nextFrame) {
            return nextFrame.getFirstThrow() + nextFrame.getSecondThrow();
        }
        return 0;
    }

    spareBonus(frameIndex) {
        const nextFrame = this.frames[frameIndex + 1];
        if (nextFrame) {
            return nextFrame.getFirstThrow();
        }
        return 0;
    }
}

class Frame {
    constructor() {
        this.throws = [];
    }

    addThrow(pins) {
        this.throws.push(pins);
    }

    getFirstThrow() {
        return this.throws[0] || 0;
    }

    getSecondThrow() {
        return this.throws[1] || 0;
    }

    isStrike() {
        return this.throws[0] === 10;
    }

    isSpare() {
        return this.throws.length === 2 && this.getFirstThrow() + this.getSecondThrow() === 10;
    }
}

let players = [];
let currentPlayerIndex = 0;

function startGame() {
    console.log('Démarrez une nouvelle partie de bowling.');

    const askNumberOfPlayers = () => {
        rl.question('Entrez le nombre de joueurs (entre 1 et 6): ', (answer) => {
            const numPlayers = parseInt(answer);
            if (isNaN(numPlayers) || numPlayers < 1 || numPlayers > 6) {
                console.log('Nombre de joueurs invalide. Veuillez entrer un nombre entre 1 et 6.');
                askNumberOfPlayers();
            } else {
                askPlayerNames(numPlayers);
            }
        });
    };

    askNumberOfPlayers();
}

function askPlayerNames(numPlayers) {
    if (players.length < numPlayers) {
        rl.question(`Entrez le nom du joueur ${players.length + 1}: `, (name) => {
            players.push(new Player(name));
            askPlayerNames(numPlayers);
        });
    } else {
        playFrame();
    }
}

function playFrame() {
    const currentPlayer = players[currentPlayerIndex];
    const currentFrame = currentPlayer.frames[currentPlayer.currentFrameIndex];

    console.log(`Frame ${currentPlayer.currentFrameIndex + 1}, lancer 1.`);
    playThrow(currentPlayer, currentFrame, 1);
}

function playThrow(player, frame, throwNumber) {
    rl.question(`${player.name}, combien de quilles avez-vous renversé ? `, (answer) => {
        const pins = parseInt(answer);
        
        if (!isNaN(pins) && pins >= 0 && pins <= 10) {
            frame.addThrow(pins);
            
            if (throwNumber === 1 && !frame.isStrike()) {
                console.log(`Frame ${player.currentFrameIndex + 1}, lancer 2.`);
                playThrow(player, frame, 2);
            } else {
                if (player.currentFrameIndex < 9 || (player.currentFrameIndex === 9 && !frame.isStrike() && !frame.isSpare())) {
                    player.calculateScore();
                    console.log(`Score après le frame ${player.currentFrameIndex + 1}:`);
                    players.forEach(p => console.log(`${p.name}: ${p.totalScore}`));
                    player.currentFrameIndex++;
                    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
                    playFrame();
                } else {
                    if (frame.isStrike() || frame.isSpare()) {
                        console.log(`Frame ${player.currentFrameIndex + 1}, lancer 2.`);
                        playThrow(player, frame, 2);
                    } else {
                        endGame();
                    }
                }
            }
        } else {
            console.log('Nombre de quilles invalide. Veuillez entrer un nombre entre 0 et 10.');
            playThrow(player, frame, throwNumber);
        }
    });
}