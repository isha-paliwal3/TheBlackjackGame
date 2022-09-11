let blackjackGame = {
  you: { scoreSpan: "#your-result", div: ".your-container", score: 0 },
  dealer: { scoreSpan: "#dealer-result", div: ".dealer-container", score: 0 },
  cards: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
  cardsMap: {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
  },
  wins: 0,
  loss: 0,
  draws: 0,
  isStand: false,
  turnsOver: false,
};

const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];
const hitSound = new Audio("./sounds/swish.m4a");
const winSound = new Audio("./sounds/cash.mp3");
const lossSound = new Audio("./sounds/aww.mp3");

document
  .querySelector("#blackjack-hit-btn")
  .addEventListener("click", blackjackHit);
document
  .querySelector("#blackjack-stand-btn")
  .addEventListener("click", dealerlogic);
document
  .querySelector("#blackjack-deal-btn")
  .addEventListener("click", blackjackDeal);

function blackjackHit() {
  if (blackjackGame["isStand"] === false) {
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
  }
}

function randomCard() {
  var randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
}

function showCard(card, activePlayer) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `./images/${card}.svg`;
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  }
}

function blackjackDeal() {
  if (blackjackGame["turnsOver"] === true) {
    let yourImage = document
      .querySelector(".your-container")
      .querySelectorAll("img");
    let dealerImage = document
      .querySelector(".dealer-container")
      .querySelectorAll("img");
    for (i = 0; i < yourImage.length; i++) {
      yourImage[i].remove();
    }
    for (i = 0; i < dealerImage.length; i++) {
      dealerImage[i].remove();
    }
    YOU["score"] = 0;
    DEALER["score"] = 0;
    blackjackGame["isStand"] = false;
    blackjackGame["turnsOver"] = false;

    document.querySelector("#your-result").textContent = 0;
    document.querySelector("#your-result").style.color = "white";
    document.querySelector("#dealer-result").textContent = 0;
    document.querySelector("#dealer-result").style.color = "white";
    document.querySelector("#show-winner").textContent = "Let's Play";
    document.querySelector("#show-winner").style.color = "white";
  }
}

function updateScore(card, activePlayer) {
  activePlayer["score"] += blackjackGame["cardsMap"][card];
}

function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "Busted!!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerlogic() {
  blackjackGame["isStand"] = true;

  while (blackjackGame["isStand"] === true && DEALER["score"] < 16) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }

  blackjackGame["turnsOver"] = true;
  showResult(computeWinner());
}

function computeWinner() {
  let win;
  if (YOU["score"] <= 21) {
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      win = YOU;
      blackjackGame["wins"]++;
    } else if (YOU["score"] < DEALER["score"]) {
      win = DEALER;
      blackjackGame["loss"]++;
    } else if (YOU["score"] === DEALER["score"]) blackjackGame["draws"]++;
  } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
    win = DEALER;
    blackjackGame["loss"]++;
  } else blackjackGame["draws"]++;

  return win;
}

function showResult(win) {
  let winner = document.querySelector("#show-winner");
  if (blackjackGame["turnsOver"] === true) {
    if (win === YOU) {
      document.querySelector("#wins").textContent = blackjackGame["wins"];
      winner.textContent = "You Won!";
      winSound.play();
      winner.style.color = "yellow";
    } else if (win === DEALER) {
      document.querySelector("#loss").textContent = blackjackGame["loss"];
      winner.textContent = "You Lost!";
      lossSound.play();
      winner.style.color = "Red";
    } else {
      document.querySelector("#draws").textContent = blackjackGame["draws"];
      winner.textContent = "You Drew!";
      winner.style.color = "blue";
    }
  }
}
