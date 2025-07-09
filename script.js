window.wallet = { coins: 0.5 };

function updateCoinDisplay() {
  const coinDisplays = document.querySelectorAll('#coin-balance');
  coinDisplays.forEach(display => {
    if (display) display.textContent = window.wallet.coins.toFixed(2);
  });
}

function showPopup() {
  const popup = document.getElementById('age-popup');
  if (popup) popup.style.display = 'block';
}

function closePopup() {
  const popup = document.getElementById('age-popup');
  if (popup) popup.style.display = 'none';
}

function signUp() {
  const email = document.getElementById('parent-email').value;
  const age = document.getElementById('child-age').value;
  const nickname = document.getElementById('child-nickname').value;
  if (!nickname) {
    alert('Please enter a child nickname!');
    return;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email or leave it blank!');
    return;
  }
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[nickname]) {
    alert('Nickname already taken! Choose another.');
    return;
  }
  const pin = Math.floor(1000 + Math.random() * 9000); // Random 4-digit PIN
  users[nickname] = { pin, email, age, coins: 0.5 };
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', nickname);
  alert(`Your child’s secret dragon key is ${pin}. Save it for login!`);
  window.location.href = 'index.html';
}

function feedPet() {
  window.wallet.coins += 0.01;
  updateCoinDisplay();
  alert('Pet fed! Earned 0.01 coins!');
}

function flipCard(card, cards, pairs, storyElement) {
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  const flippedCards = cards.filter(c => c.classList.contains('flipped') && !c.classList.contains('matched'));
  if (flippedCards.length === 2) {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      window.wallet.coins += 0.05;
      updateCoinDisplay();
      storyElement.textContent = 'Your dragon found a matching treasure! Earned 0.05 coins!';
      if (cards.every(c => c.classList.contains('matched'))) {
        storyElement.textContent = 'All treasures matched! Your dragon is a blockchain hero!';
      }
    } else {
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
      }, 1000);
    }
  }
}

function sendTreasure() {
  const amount = parseFloat(document.getElementById('amount').value);
  const recipient = document.getElementById('recipient').value;
  if (isNaN(amount) || amount <= 0 || amount > window.wallet.coins) {
    alert('Invalid amount!');
    return;
  }
  window.wallet.coins -= amount;
  updateCoinDisplay();
  document.getElementById('story').textContent = `Sent ${amount} coins to ${recipient}! Your dragon shared treasure on the blockchain!`;
  document.getElementById('amount').value = '';
  document.getElementById('recipient').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
  updateCoinDisplay();
  const cards = Array.from(document.querySelectorAll('.card'));
  const storyElement = document.getElementById('story');
  if (cards.length > 0 && storyElement) {
    cards.forEach(card => card.addEventListener('click', () => flipCard(card, cards, ['Coin', 'Wallet', 'Send'], storyElement)));
  }
  const wallet = document.getElementById('wallet');
  const coins = document.querySelectorAll('.coin');
  if (wallet && coins.length > 0) {
    wallet.addEventListener('dragover', e => e.preventDefault());
    wallet.addEventListener('drop', () => {
      const draggedCoin = document.querySelector('.coin[draggable="true"]');
      if (draggedCoin) {
        draggedCoin.remove();
        window.wallet.coins += 0.02;
        updateCoinDisplay();
        document.getElementById('story').textContent = 'Your dragon stored the coin safely in its blockchain wallet!';
        if (document.querySelectorAll('.coin').length === 0) {
          document.getElementById('story').textContent = 'All coins stored! Your dragon is a wallet master!';
        }
      }
    });
    coins.forEach(coin => {
      coin.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', 'coin'));
    });
  }
});
