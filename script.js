// Simulated wallet for demo; replace with Sepolia testnet via Tatum/Moralis for real wallets
window.wallet = window.wallet || { coins: 0.5 };

// Feed Pet function for index.html
function feedPet() {
  if (document.getElementById("balance")) {
    window.wallet.coins += 0.01;
    document.getElementById("balance").innerText =
      window.wallet.coins.toFixed(2);
    alert("Pet fed! Earned 0.01 coins!");
  }
}

// Initialize game for game.html
function initGame() {
  if (document.getElementById("gameBoard")) {
    // Update balance display
    document.getElementById("balance").innerText =
      window.wallet.coins.toFixed(2);

    // Card data
    const cards = [
      { id: 1, value: "Coin", matched: false },
      { id: 2, value: "Coin", matched: false },
      { id: 3, value: "Wallet", matched: false },
      { id: 4, value: "Wallet", matched: false },
      { id: 5, value: "Send", matched: false },
      { id: 6, value: "Send", matched: false },
    ];
    let flippedCards = [];
    let matchesFound = 0;

    // Shuffle cards
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    shuffle(cards);

    // Create game board
    const gameBoard = document.getElementById("gameBoard");
    cards.forEach((card) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.dataset.value = card.value;
      cardElement.dataset.id = card.id;
      cardElement.addEventListener("click", () => flipCard(cardElement, card));
      gameBoard.appendChild(cardElement);
    });

    // Flip card logic
    function flipCard(cardElement, card) {
      if (
        flippedCards.length < 2 &&
        !card.matched &&
        !flippedCards.includes(cardElement)
      ) {
        cardElement.classList.add("flipped");
        cardElement.textContent = card.value;
        flippedCards.push(cardElement);
        if (flippedCards.length === 2) {
          setTimeout(checkMatch, 1000);
        }
      }
    }

    // Check for match
    function checkMatch() {
      const [card1, card2] = flippedCards;
      if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        cards.find((c) => c.id == card1.dataset.id).matched = true;
        cards.find((c) => c.id == card2.dataset.id).matched = true;
        matchesFound++;
        if (matchesFound === 3) {
          window.wallet.coins += 0.05;
          document.getElementById("balance").innerText =
            window.wallet.coins.toFixed(2);
          alert("You won! Earned 0.05 coins!");
        }
      } else {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1.textContent = "";
        card2.textContent = "";
      }
      flippedCards = [];
    }
  }
}

// Initialize appropriate function based on page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("gameBoard")) {
    initGame();
  } else if (document.getElementById("balance")) {
    document.getElementById("balance").innerText =
      window.wallet.coins.toFixed(2);
  }
});
