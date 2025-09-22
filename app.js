let rates = { USD: 1, COP: 4000, VES: 36 }; // valores por defecto

// Llamada al API de rates (ejemplo Open Exchange o exchangerate.host)
async function fetchRates() {
  try {
    let res = await fetch("https://openexchangerates.org/api/latest.json?app_id=8a2620eb6e304a559a3656342ae3b77b&base=USD&symbols=COP,VES");
    let data = await res.json();
    rates["COP"] = data.rates.COP;
    rates["VES"] = data.rates.VES;
    updateBonusCards();
  } catch (err) {
    console.error("Error cargando tasas:", err);
  }
}

function updateBonusCards() {
  let cards = document.querySelectorAll(".bonus-card");
  cards.forEach(card => {
    let usd = parseFloat(card.dataset.usd);
    let bono = parseFloat(card.dataset.bono);
    let copValue = usd * rates["COP"];

    card.innerHTML = `
      <h3>${usd} USD</h3>
      <p>🇨🇴 ${copValue.toLocaleString("es-CO", {minimumFractionDigits: 0})} COP</p>
      <p class="bonus">🎁 ${bono} Bs</p>
    `;
  });

  // Mensaje dinámico general
  let minUsd = 5;
  let minCop = minUsd * rates["COP"];
  document.getElementById("bonusInfo").innerText =
    `💡 Recuerda: tus bonos aplican desde ${minUsd} USD (≈ ${minCop.toLocaleString("es-CO", {minimumFractionDigits: 0})} COP)`;
}

function calculate() {
  let amount = parseFloat(document.getElementById("amount").value);
  let currency = document.getElementById("currency").value;
  let resultDiv = document.getElementById("result");
  let bonusReminder = document.getElementById("bonusReminder");

  if (isNaN(amount) || amount <= 0) {
    resultDiv.innerHTML = "<p>Por favor, ingresa un monto válido.</p>";
    bonusReminder.innerText = "";
    return;
  }

  let usdValue = currency === "USD" ? amount : amount / rates["COP"];
  let bsValue = usdValue * rates["VES"];
  let copValue = usdValue * rates["COP"];
  let diffRates = 220 - rates["VES"];
  let bonus     = diffRates * usdValue;

  // Determinar bono
  /*let bonus = 0;
  let bonos = [5,10,15,25,50,100,150,200,250,300,350,400,450,500,1000];
  let bonosBs = [100,200,300,500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,10500];
  for (let i = bonos.length - 1; i >= 0; i--) {
    if (usdValue >= bonos[i]) {
      bonus = bonosBs[i];
      break;
    }
  }*/

  resultDiv.innerHTML = `
    <h3>Resultado</h3>
    <p>🇺🇸 ${usdValue.toFixed(2)} USD</p>
    <p>🇨🇴 ${copValue.toLocaleString("es-CO", {minimumFractionDigits:0})} COP</p>
    <p>🇻🇪 ${bsValue.toLocaleString("es-VE", {minimumFractionDigits:2})} Bs (a tasa BCV)</p>
    <p class="bonus">🎁 Bono: ${bonus} Bs</p>
  `;
  
  let totalFinal = bsValue + bonus;
  resultDiv.innerHTML += `<br>✅ Total recibido: ${totalFinal.toLocaleString("es-VE", {minimumFractionDigits:2})} Bs`;

  // Mensaje dinámico debajo del resultado
  let minUsd = 5;
  let minCop = minUsd * rates["COP"];
  if (bonus > 0) {
    bonusReminder.innerText = `🎊 ¡Felicidades! Calificas para un bono de ${bonus} Bs 🎁`;
  } else {
    bonusReminder.innerText =
      `✨ Recuerda: los bonos aplican desde ${minUsd} USD (≈ ${minCop.toLocaleString("es-CO", {minimumFractionDigits:0})} COP)`;
  }

  // Resaltar tarjeta del bono
  let cards = document.querySelectorAll(".bonus-card");
  cards.forEach(c => c.classList.remove("highlight"));
  if (bonus > 0) {
    let targetCard = Array.from(cards).find(c => parseFloat(c.dataset.bono) === bonus);
    if (targetCard) targetCard.classList.add("highlight");
  }
}

// --- Funciones para compartir ---

function shareWhatsApp() {
  const text = document.getElementById("result").innerText + "\n" + 
               document.getElementById("bonusReminder").innerText;
  const url = "https://wa.me/?text=" + encodeURIComponent(text);
  showToast("📲 Abriendo WhatsApp…");
  setTimeout(() => window.open(url, "_blank"), 800); // espera un poco antes de abrir
}

function shareFacebook() {
  const text = document.getElementById("result").innerText + "\n" + 
               document.getElementById("bonusReminder").innerText;
  const url = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(text);
  showToast("📢 Compartiendo en Facebook…");
  setTimeout(() => window.open(url, "_blank"), 800);
}

function copyToClipboard() {
  const text = document.getElementById("result").innerText + "\n" + 
               document.getElementById("bonusReminder").innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast("✅ Información copiada al portapapeles");
  });
}

// --- Toast notification ---
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.className = "show";
  setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}


// Inicializar
fetchRates();
