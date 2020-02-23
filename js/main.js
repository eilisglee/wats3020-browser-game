/* WATS 3020 Browser Game project */
/* Build a tic tac toe game for two players. */

// Global variable named 'game` to reference the instance of the current game
let game;

// `Player` class with `constructr()` parameter `token`. `this.token` set as a property of
// the class.
class Player {
    constructor(token) {
        this.token = token;
    }
}

// Tic Tac Toe Game Class
class TicTacToe {
    constructor() {
        // `this.player1` and `this.player2` properties for new Player class instances.
        // "token" set to correspond to an Icon
        // icon name ('heart', 'star', 'remove-sign', 'unchecked', 'bell',
        // 'certificate', etc.)
        this.player1 = new Player('times');
        this.player2 = new Player('circle');

        // Initialize properties to track game progress.
        this.currentPlayer = null;
        this.gameStatus = null;
        this.winner = null;
        this.moveCount = 0;

        // DOM elements used in game as Class properties
        this.startPrompt = document.querySelector('#start-prompt');
        this.movePromt = document.querySelector('#move-prompt');
        this.currentPlayerToken = document.querySelector('#player-token');
        this.gameboard = document.querySelector('#gameboard');
        this.winScreen = document.querySelector('#win-screen');
        this.winnerToken = document.querySelector('#winner-token');
        this.drawScreen = document.querySelector('#draw-screen');

        // Initialize Array to represent starting state of game board.
        // We can access the spaces on the board using
        // (X, Y) coordinates as `this.gameState[x][y]`, which is how the game
        // will check to see if the winner is known.
        this.gameState = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        // Array of Win States
        // Each of these arrays represents the ways
        // a player can win Tic Tac Toe. Each item in the array is another
        // array. Each of those arrays contains a set of (X, Y) coordinates.
        // If a player has claimed the tile at each of the coordinates listed in
        // one of the win states, then they have won the game.
        this.winStates = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];
    }

    // This `checkForWinner()` method is provided for you, but you must fill in
    // the event dispatch lines that cause the end game screens to show.
    checkForWinner() {
        for (let condition of this.winStates) {
            let winningCondition = true;
            for (let position of condition) {
                if (this.gameState[position[0]][position[1]] != this.currentPlayer.token) {
                    winningCondition = false;
                }
            }
            if (winningCondition) {
                console.log('We have a winner!');
                console.log(`Condition is: ${condition}`);
                this.gameStatus = 'won';
                this.winner = this.currentPlayer;

                // If we've gotten here, then we need to createa  `win` event and
                // dispatch it.


                // Event called `winEvent` that will dispatch the signal "win".
                let winEvent = new Event('win');

                // Dispatch the winEvent using the `document.dispatchEvent()` method.
                document.dispatchEvent(winEvent);

                return true; // Return a value to stop processing the additional move count check.
            }
        }
        this.moveCount++;
        console.log(`Reviewed move ${this.moveCount}.`)
        if (this.moveCount >= 9) {
            console.log(`This game is a draw at ${this.moveCount} moves.`);
            this.gameStatus = 'draw';

            // Event called `drawEvent` that dispatches the signal "draw".
            let drawEvent = new Event('draw');

            // Dispatch the `drawEvent` event.
            document.dispatchEvent(drawEvent);
        }
    }

    recordMove(event) {
        // This method handles recording a move in the `this.gameState` property.
        // To record a move, we must accmoplish the following:

        // 1. Find the X, Y coordinates of the tile that was just selected
        // 2. Claim that tile in the `this.gameState` array
        // 3. Set the class attribute of the tile to reflect which player has claimed it

        // Defines a variable called `tile_x` that equals the `data-x` attribute on the `event.target`.
        let tile_x = event.target.dataset.x;

        // Defines a variable called `tile_y` that equals the `data-y` attribute on the `event.target`.
        let tile_y = event.target.dataset.y;

        // Claims spot in the `this.gameState` array for the player.
        if (!this.gameState[tile_x][tile_y]) {
            this.gameState[tile_x][tile_y] = this.currentPlayer.token;
            // Sets the class on the `event.target` to show the player's token. The class
            // should be: `tile played fas fa-${this.currentPlayer.token}`.
            event.target.setAttribute('class', `tile played fas fa-${this.currentPlayer.token}`);
        } else {
            return false;
        }
    }
    switchPlayer() {
        // This method handles switching between players after each move.
        // It must determine who the current player is, and then switch to the
        // other player. After that, it must set the class on the
        // `this.currentPlayerToken` property to show the proper class.

        // Conditional that checks to see if `this.currentPlayer`
        // is equal to `this.player1` If so, set `this.currentPlayer` to
        // `this.player2`. If not, set `this.currentPlayer` equal to
        // `this.player1`. (You will use an if/else statement to do this.)
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }

        // `class` attribute on `this.currentPlayerToken` to
        // reflect the current player's token. (Note: You need to use the
        // proper Icon classes combined with the `this.currentPlayer.token`
        // value.)
        this.currentPlayerToken.setAttribute('class', `fas fa-${this.currentPlayer.token}`);
    }
    setUpTileListeners() {
        // This method sets up event listeners for tiles. It is called when we
        // start a new game. It must find all the tiles and apply event listeners
        // to them.

        // Selects `.tile` elements into a variable called `tileElements`.
        let tileElements = document.querySelectorAll('.tile');

        // Loop to add a "click" event listener to each tile that calls the 
        // `handleMove` function whenever a tile is clicked.
        for (const tile of tileElements) {
            tile.addEventListener('click', handleMove);
        }
    }
    showWinScreen() {
        // This method displays the end game screen for a Win.

        // Changes `class` attribute on the `this.winScreen` property to "show".
        this.winScreen.setAttribute('class', 'show');
        // Changes the `class` attribute on the `this.winnerToken` property
        // to show the proper winner's token.
        this.winnerToken.setAttribute('class', `fas fa-${this.currentPlayer.token}`);
    }
    showDrawScreen() {
        // This method displays the end game screen for a Draw.

        // Sets `class` attribute on the `this.drawScreen` property
        // to "show".
        this.drawScreen.setAttribute('class', 'show');
    }
    setUpBoard() {
        // Clears all content from the existing `this.gameboard` element.
        this.gameboard.innerHTML = '';

        // We must draw the game board by using a loop to create rows with
        // tiles in them. We want to create the same structure as we see in the
        // index.html file.

        // `for` loop that will loop three times. 
        for (let i = 0; i < 3; i++) {

            // div element called `newRow
            let newRow = document.createElement('div');

            // Sets the `class` attribute on `newRow` to "row".
            newRow.setAttribute('class', 'row');

            // `for` loop to make the colums to contain the
            // tiles. This `for` loop should also loop 3 times. The counter
            // variable in this loop should be called `j`.
            for (let j = 0; j < 3; j++) {

                // Create a new `div` element called `newCol`.
                let newCol = document.createElement('div');

                // Set the `class` attribute on `newCol` to "col-xs-3".
                newCol.setAttribute('class', 'col-xs-3');

                // Create a new `span` element called `newTile`.
                let newTile = document.createElement('span');

                // Set the `class` attribute on `newTile` to equal the
                // placeholder styles ("tile fas fa-question-sign").
                newTile.setAttribute('class', 'fas fa-question tile');

                // Set the `data-x` attribute on the `newTile` element
                // equal to `i`.
                newTile.setAttribute('data-x', i);

                // Set the `data-y` attribute on the `newTile` element
                // equal to `j`.
                newTile.setAttribute('data-y', j);

                // Append `newTile` as a child to `newCol`.
                newCol.appendChild(newTile);

                // Append `newCol` as a child to `newRow`.
                newRow.appendChild(newCol);

                // NOTE: Your second `for` loop should end here.
            }

            // Append the `newRow` element to `this.gameboard` as a child element.
            this.gameboard.appendChild(newRow);

            // NOTE: Your first `for` loop should end here.
        }

        // Calls `this.setUpTileListeners()` to add event listeners to the
        // `.tile` elements.
        this.setUpTileListeners();

    }
    initializeMovePrompt() {
        // This method initializes the `this.movePrompt` element.

        // Hides the `this.startPrompt` element by setting the `class`
        // attribute to "hidden".
        this.startPrompt.setAttribute('class', 'hidden');

        // Removes the "hidden" class from the `this.movePrompt` element.
        this.movePromt.setAttribute('class', '');
        // Sets `this.currentPlayer` equal to `this.player1`.
        this.currentPlayer = this.player1;

        // Sets `this.currentPlayerToken` class equal to `fas fa-${this.currentPlayer.token}`
        this.currentPlayerToken.setAttribute('class', `fas fa-${this.currentPlayer.token}`);
    }
    start() {
        console.log('start game');
        // This method handles the logic to create a new game. It primarily has
        // two duties in the basic version of the game:

        // Creates a new gameboard by calling `this.setUpBoard`
        this.setUpBoard();
        console.log('set up board');
        // Initializes the move prompt by calling `this.initializeMovePrompt`.
        this.initializeMovePrompt();
        console.log('init move prompt');
    }
} // End of the Tic Tac Toe Class definition.

// Outside of the Class definitions, we need a few items to control the game
// so our players can successfull play.

// Event listener to the `document` object that will watch for the
// "DOMContentLoaded" event signal. This listener should execute an anonymous
// function to handle the "DOMContentLoaded" event.
document.addEventListener('DOMContentLoaded', (event) => {

    // Inside the "DOMContentLoaded" event handler:

    // Selects the `#start-button` element from the DOM and saves it as a
    // variable called `startButton`.
    let startButton = document.querySelector(
        '#start-button');

    // Event listener on the `startButton` element that listens for
    // a "click" event and executes an anonymous function to start the game.

    startButton.addEventListener('click', (event) => {
        // Inside the `startButton` event listener, instantiates a new
        // instance of the `TicTacToe` class and save it as a variable called
        // `game`.
        game = new TicTacToe();
        // Calls the `start()` method of the `game` object you just created.
        game.start();
    });
    // NOTE: End of the `startButton` event listener here.

});
// NOTE: End of the "DOMContentLoaded" event listener here.

// Adds an event listener on the `document` object that listens for the
// "win" event signal.
document.addEventListener('win', (event) => {
    // In the handler for the "win" event, calls the `game.showWinScreen()`
    // method to display the winning screen.
    console.log('win event fired');
    game.showWinScreen();
})

// NOTE: End of the "win" event listener.

// Adds an event listener on the `document` object that listens for the
// "draw" event signal.
document.addEventListener('draw', (event) => {
    console.log('draw event fired');
    game.showDrawScreen();
})

// In the handler for the "draw" event, calls the `game.showDrawScreen()`
// method to display the tie game screen.

// NOTE: End of the "draw" event listener.

// External function for event listeners.
function handleMove(event) {
    // Records the move for the current player.
    game.recordMove(event);

    // Checks to see if the last move was a winning move.
    game.checkForWinner();

    // Rotates players.
    game.switchPlayer();
}
