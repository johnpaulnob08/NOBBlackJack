let playerCards = [];
let dealerCards = [];
let playerSum = 0;
let dealerSum = 0;
let money = 1000;
let bet = 0;
let wins = 0;
let losses = 0;
let isAlive = false;

const playerEl = document.getElementById("player-cards");
const dealerEl = document.getElementById("dealer-cards");
const messageEl = document.getElementById("message");
const moneyEl = document.getElementById("money");
const chips = document.querySelectorAll(".chip");
const winsEl = document.getElementById("wins");
const lossesEl = document.getElementById("losses");

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    const value = parseInt(chip.getAttribute("data-value"));

    chip.classList.add("spin");
    setTimeout(() => chip.classList.remove("spin"), 500);

    if (money >= value) {
      bet = value;
      messageEl.textContent = `Bet placed: $${bet}`;
    } else {
      messageEl.textContent = "Not enough money to bet!";
    }
  });
});


function getCard() {
  const suits = ["♠️", "♥️", "♣️", "♦️"];
  let value = Math.floor(Math.random() * 13) + 1;
  let suit = suits[Math.floor(Math.random() * suits.length)];
  let card = value > 10 ? 10 : value === 1 ? 11 : value;
  return { card, display: `${value}${suit}` };
}

function updateMoney() {
  moneyEl.textContent = money;
}

function startGame() {
  if (bet <= 0) {
    messageEl.textContent = "Place a bet to start!";
    return;
  }
  playerCards = [];
  dealerCards = [];
  playerSum = 0;
  dealerSum = 0;
  isAlive = true;

  money -= bet;

  let first = getCard();
  let second = getCard();
  playerCards.push(first, second);
  playerSum = first.card + second.card;

  dealerCards.push(getCard());
  dealerSum = dealerCards[0].card;

  render();
  updateScore();
}

function render() {
  playerEl.textContent = `${playerCards.map(c => c.display).join(" ")} (${playerSum})`;
  dealerEl.textContent = `${dealerCards.map(c => c.display).join(" ")} (${dealerSum})`;
  updateMoney();
}

function deal() {
  if (!isAlive) return;
  hit();
  stay();
}

function hit() {
  if (!isAlive) return;
  let card = getCard();
  playerCards.push(card);
  playerSum += card.card;

  if (playerSum > 21) {
    messageEl.textContent = "Bust! Dealer wins.";
    losses++;
    isAlive = false;
  }
  render();
  updateScore();
}

function stay() {
  if (!isAlive) return;
  while (dealerSum < 17) {
    let card = getCard();
    dealerCards.push(card);
    dealerSum += card.card;
  }

  if (dealerSum > 21 || playerSum > dealerSum) {
    messageEl.textContent = "You win! 🥳";
    wins++;
    money += bet * 2;
  } else if (playerSum === dealerSum) {
    messageEl.textContent = "Push. Bet returned.";
    money += bet;
  } else {
    messageEl.textContent = "Dealer wins! 😞";
    losses++;
  }

  isAlive = false;
  render();
  updateScore();
}

function doubleDown() {
  if (!isAlive || money < bet) return;
  money -= bet;
  bet *= 2;
  hit();
  if (isAlive) stay();
}

function insurance() {
  messageEl.textContent = "Insurance not implemented yet.";
}

function updateScore() {
  winsEl.textContent = wins;
  lossesEl.textContent = losses;
  updateMoney();
}

function resetGame() {
  money = 1000;
  wins = 0;
  losses = 0;
  bet = 0;
  updateScore();
  messageEl.textContent = "Game reset. Place your bets!";
}
