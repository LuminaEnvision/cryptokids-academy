let wallet = { coins: 0.5 };
function feedPet() {
  wallet.coins += 0.01;
  document.getElementById('balance').innerText = wallet.coins.toFixed(2);
  alert('Pet fed! Earned 0.01 coins!');
}
// Simulated wallet for demo; replace with Sepolia testnet via Tatum/Moralis for real wallets
window.wallet = window.wallet || { coins: 0.5 };
function feedPet() {
  window.wallet.coins += 0.01;
  document.getElementById('balance').innerText = window.wallet.coins.toFixed(2);
  alert('Pet fed! Earned 0.01 coins!');
}
