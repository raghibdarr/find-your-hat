const prompt = require('prompt-sync')({
    sigint: true
});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this.field = field;
        this.tempField = field;
        this.yPos = 0;
        this.xPos = 0;
        this.gameOver = false;
    }

    findStartingPos() {
        for (let i=0; i<this.field.length; i++) {
            for (let j=0; j<this.field.length; j++) {
                if (this.field[i][j] == "*") {
                    this.yPos = i;
                    this.xPos = j;
                }
            }
        }
    }

    askUser() {
        this.findStartingPos();
        while (this.gameOver == false) {
            this.print();
            console.log("Which way? (Press 'd' for down, 'u' for up, 'r' for right, 'l' for left)");
            const userInput = prompt("> ");
            switch (userInput.toLowerCase()) {
                case "u":
                    this.moveUp();
                    break;
                case "d":
                    this.moveDown();
                    break;
                case "r":
                    this.moveRight();
                    break;
                case "l":
                    this.moveLeft();
                    break;
                default:
                    break;
            }
        }
    }

    print() {
        for (let i = 0; i < this.tempField.length; i++) {
            console.log(this.tempField[i].join(''));
        }
    }

    static generateField(height, width, percentageCoveredByHoles) {
        let startY = 0;
        let startX = 0;
        let hatY = 0;
        let hatX = 0;
        let holeY = 0;
        let holeX = 0;

        // generate field full of grass
        let field = [];
        for (let i = 0; i < height; i++) {
            field[i] = [];
            for (let j = 0; j < width; j++) {
                field[i][j] = "░";
            }
        }
        
        // generate starting pos
        startY = Math.floor(Math.random() * height);
        startX = Math.floor(Math.random() * width);
        field[startY][startX] = "*";

        // generate hat
        do {
            hatY = Math.floor(Math.random() * height);
            hatX = Math.floor(Math.random() * width);
        } while (field[hatY][hatX] == "*");
        field[hatY][hatX] = "^";

        // generate holes
        let holeCount = (percentageCoveredByHoles / 100) * height * width;
        for (let i = 0; i < holeCount; i++) {
            do {
                holeY = Math.floor(Math.random() * height);
                holeX = Math.floor(Math.random() * width);
            } while (field[holeY][holeX] == "*" || field[holeY][holeX] == "^");
            field[holeY][holeX] = "O";
        }

        this.field = field;
        this.tempField = field;
        this.yPos = startY;
        this.xPos = startX;
        return field ;
    }

    moveUp() {
        this.yPos -= 1;
        this.checkMove(this.yPos, this.xPos);
    }

    moveDown() {
        this.yPos += 1;
        this.checkMove(this.yPos, this.xPos);
    }

    moveLeft() {
        this.xPos -= 1;
        this.checkMove(this.yPos, this.xPos);

    }

    moveRight() {
        this.xPos += 1;
        this.checkMove(this.yPos, this.xPos);
    }

    checkMove(yPos, xPos) {
        if (yPos < 0 || yPos > this.tempField.length - 1) {
            console.log("Out of Y bounds instruction. Start over.");
            this.endGame();
        } else if (xPos < 0 || xPos > this.tempField[0].length - 1) {
            console.log("Out of X bounds instruction. Start over.");
            this.endGame();
        } else if (this.tempField[yPos][xPos] == 'O') {
            console.log("Sorry, you fell down a hole.")
            this.endGame();
        } else if (this.tempField[yPos][xPos] == '^') {
            console.log("Congrats, you found the hat!")
            this.endGame();
        } else {
            this.tempField[yPos][xPos] = '*';
        }
    }

    endGame() {
        this.gameOver = true;
        this.yPos = 0;
        this.xPos = 0;
        this.tempField = this.field;
    }
}


const playGame = () => {
    const myField = new Field(Field.generateField(10,10,40));

    while (myField.gameOver == false) {
        myField.askUser();
    }
}

playGame();


