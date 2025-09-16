const API_URL = "https://api.exchangerate.host/latest?base=USD&symbols=VES,COP";
let rates = {};

async function fetchRates() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    rates = data.rates;
    console.log("Tasas cargadas:", rates);
  } catch (err) {
    console.error("Error cargando tasas:", err);
  }
}

function getBonus(usdValue) {
  if (usdValue >= 500) return 5000;
  if (usdValue >= 450) return 4500;
  if (usdValue >= 400) return 4000;
  if (usdValue >= 350) return 3500;
  if (usdValue >= 300) return 3000;
  if (usdValue >= 250) return 2500;
  if (usdValue >= 200) return 2000;
  if (usdValue >= 150) return 1500;
  if (usdValue >= 100) return 1000;
  if (usdValue >= 50) return 500;
  if (usdValue >= 25) return 500;
  if (usdValue >= 10) return 200;
  return 0;
}

function calculate() {
  let amount = parseFloat(document.getElementById('amount').value);
  let currencyFrom = document.getElementById('currencyFrom').value;

  if (isNaN(amount) || amount <= 0) {
    document.getElementById('result').innerHTML = "⚠️ Ingrese un monto válido";
    return;
  }

  let usdValue = (currencyFrom === "COP") ? (amount / rates["COP"]) : amount;
  let bolivares = usdValue * rates["VES"];
  let bono = getBonus(usdValue);
  let total = bolivares + bono;

  let output = `
    Monto ingresado: ${amount.toFixed(2)} ${currencyFrom}<br>
    Equivalente en USD: ${usdValue.toFixed(2)} USD<br>
    Equivalente en Bs (BCV): ${bolivares.toFixed(2)} Bs<br>
    Bono aplicado: ${bono.toFixed(2)} Bs<br>
    👉 Total a recibir: ${total.toFixed(2)} Bs
  `;

  document.getElementById('result').innerHTML = output;
}

function shareSocial() {
  let text = document.getElementById('result').innerText;
  let url = encodeURIComponent("https://ajmexchanges.com");
  let shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(text)}`;
  window.open(shareUrl, '_blank');
}

function shareWhatsApp() {
  let text = document.getElementById('result').innerText;
  let url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function copyResult() {
  let text = document.getElementById('result').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("✅ Resultado copiado al portapapeles");
  });
}

fetchRates();
