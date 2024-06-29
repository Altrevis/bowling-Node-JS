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

