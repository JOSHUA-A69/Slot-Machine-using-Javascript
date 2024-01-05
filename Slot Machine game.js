const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  "A": 2,
  "B": 4,
  "C": 6,
  "D": 8
}

const SYMBOLS_VALUES = {
  "A": 5,
  "B": 4,
  "C": 3,
  "D": 2
}

// Define the balance variable outside the game loop
let balance = 0;

// 1. Deposit some Money
function deposit() {
  let valid = false;
  let numberDepositAmount;

  while (!valid) {
    const depositAmount = prompt("Enter a deposit amount in PHP: ");
    numberDepositAmount = parseFloat(depositAmount);

    if (!isNaN(numberDepositAmount) && numberDepositAmount > 0) {
      valid = true;
    } else {
      console.log("Invalid deposit amount, please try again.");
    }
  }

  console.log(`You have successfully deposited PHP ${numberDepositAmount.toFixed(2)}.`);
  return numberDepositAmount;
}

// 2. Determine the number of lines to bet on
const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberOfLines = parseInt(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("Invalid number of lines, please try again.");
    } else {
      return numberOfLines;
    }
  }
}

// 3. Collect a bet amount per line
const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt(`Enter the bet per line in PHP (Maximum bet: PHP ${balance.toFixed(2)}): `);
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("Invalid bet, please try again.");
    } else {
      return numberBet;
    }
  }
}

// 4. Spin the slot machine
const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [[], [], []];
  for (let i = 0; i < COLS; i++) {
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
}

// 5. Check if the user won
const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol !== symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winnings += bet * SYMBOLS_VALUES[symbols[0]];
    }
  }
  return winnings;
}

// 6. Give the user their winnings
const game = () => {
  balance = deposit(); // Update the balance variable

  while (true) {
    console.log('You have a balance of PHP ' + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines; // Corrected the subtraction

    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log(`You won PHP ${winnings.toFixed(2)}.`);

    if (balance <= 0) {
      console.log("You ran out of money!");
      break;
    }

    // 7. Play again
    const playAgain = prompt("Do you want to play again (y/n)? ");
    if (playAgain !== "y") // Corrected the variable name
      break;
  }
}

// Additional functions
function transpose(reels) {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
}

function printRows(rows) {
  for (const row of rows) {
    console.log(row.join(" | "));
  }
}

// Start the game
game();
