let wallet = { coins: 0.5 };
function feedPet() {
  wallet.coins += 0.01;
  document.getElementById('balance').innerText = wallet.coins.toFixed(2);
  alert('Pet fed! Earned 0.01 coins!');
}
