let step = 0;
let data = {};
let mission = [];
let client = null;
let orderId = null;

const $ = (id) => document.getElementById(id);

/* ======================
   DONNÉES
====================== */

const clients = [
  { name: "Jean ROBERT", address: "26 sous les cocotiers, 97490 La Réunion" },
  { name: "Sophie MARTIN", address: "12 rue des manguiers, 26000 Valence" },
  { name: "Karim BENALI", address: "8 avenue du port, 13002 Marseille" },
  { name: "Emma LEBLANC", address: "5 rue des alizés, 75012 Paris" }
];

const products = [
  { name: "Boîte à outils", icon: "🧰" },
  { name: "Peinture murale", icon: "🎨" },
  { name: "Tournevis", icon: "🪛" },
  { name: "Chaise de jardin", icon: "🪑" },
  { name: "Gazon synthétique", icon: "🌱" },
  { name: "Perceuse", icon: "🔧" }
];

/* ======================
   GENERATE MISSION (FIX CLIENT RANDOM)
====================== */

function generateMission() {

  const index = Math.floor(Math.random() * clients.length);
  client = clients[index];

  orderId = Math.floor(Math.random() * 90000 + 10000);

  mission = [...products]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map(p => ({
      ...p,
      qty: Math.floor(Math.random() * 4) + 1
    }));
}

/* ======================
   NAVIGATION
====================== */

function show(id) {

  document.querySelectorAll(".screen")
    .forEach(s => s.classList.remove("active"));

  $(id).classList.add("active");

  // RESET DELIVERY VISUEL SI ON QUITTE
  if (id !== "delivery") resetDelivery();
}

/* ======================
   INIT
====================== */

window.onload = () => {
  generateMission();
  show("lock");
};

/* ======================
   UNLOCK
====================== */

function unlock() {
  show("home");
}

/* ======================
   OPEN MISSION (FORCE REFRESH)
====================== */

function openMission() {

  generateMission();

  step = 0;
  data = {};

  renderMission();
  show("mission");
}

/* ======================
   MISSION SCREEN
====================== */

function renderMission() {

  $("clientName").textContent = client.name;
  $("clientAddress").textContent = client.address;
  $("orderId").textContent = orderId;

  $("missionList").innerHTML = mission
    .map(m => `<li>${m.icon} ${m.name} — ${m.qty}</li>`)
    .join("");
}

/* ======================
   START PICK
====================== */

function startMission() {
  step = 0;
  data = {};
  showPick();
}

function currentItem() {
  return mission[step];
}

/* ======================
   PICK SCREEN
====================== */

function showPick() {

  const item = currentItem();

  if (!item) {
    showRecap();
    return;
  }

  $("productName").textContent = item.name;
  $("productIcon").textContent = item.icon;

  $("infoBox").innerHTML = `Quantité demandée : <b>${item.qty}</b>`;

  $("qty").value = "";
  $("warning").textContent = "";

  $("progress").textContent =
    `Étape ${step + 1} / ${mission.length}`;

  $("progress-fill").style.width =
    (step / mission.length) * 100 + "%";

  show("pick");
}

/* ======================
   VALIDATION PICK
====================== */

function validatePick() {

  const item = currentItem();
  const val = Number($("qty").value);

  if (!item) return showRecap();

  if (isNaN(val) || val < 0) {
    $("warning").textContent = "Quantité invalide";
    return;
  }

  if (val > item.qty) {
    $("warning").textContent =
      "Impossible de dépasser la quantité prévue";
    return;
  }

  data[item.name] = val;

  step++;

  if (step < mission.length) {
    showPick();
  } else {
    showRecap();
  }
}

/* ======================
   RECAP FIX (CLIENT + PRODUITS OK)
====================== */

function showRecap() {

  let missing = 0;
  let errors = 0;
  let html = "";

  $("finalClientName").textContent = client.name;
  $("finalClientAddress").textContent = client.address;

  mission.forEach(m => {

    const val = data[m.name] || 0;

    let status = "OK";

    if (val < m.qty) {
      status = `MANQUE ${m.qty - val}`;
      missing++;
    }

    if (val > m.qty) {
      status = `SURPLUS ${val - m.qty}`;
      errors++;
    }

    html += `
      <p>
        ${m.icon} ${m.name} : ${val}/${m.qty} → ${status}
      </p>
    `;
  });

  $("recapList").innerHTML = html;

  const hasError = missing > 0 || errors > 0;

  $("shipBtn").disabled = hasError;

  $("shipBtn").textContent =
    hasError ? "🚫 Expédition bloquée" : "🚚 Expédier la commande";

  $("fixBtn").style.display =
    hasError ? "block" : "none";

  show("recap");
}

/* ======================
   SHIP ANIMATION (CAMION FIX PROPRE)
====================== */

function ship() {

  if ($("shipBtn").disabled) {
    alert("Compléter la commande");
    return;
  }

  show("delivery");

  const bar = $("deliveryProgress");
  const truck = $("truck");

  let progress = 0;

  bar.style.width = "0%";
  truck.style.left = "0%";

  const timer = setInterval(() => {

    progress += 3;

    if (progress > 100) progress = 100;

    bar.style.width = progress + "%";
    truck.style.left = progress + "%";

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => show("success"), 400);
    }

  }, 100);
}
/* ======================
   RESET DELIVERY (ANTI BUG MOBILE)
====================== */

function resetDelivery() {

  const bar = $("deliveryProgress");
  const truck = $("truck");

  if (bar) bar.style.width = "0%";
  if (truck) truck.style.left = "0%";
}

/* ======================
   BACK
====================== */

function backToPick() {
  step = 0;
  showPick();
}

/* ======================
   RESTART CLEAN
====================== */

function restartApp() {

  generateMission();

  step = 0;
  data = {};

  renderMission();
  show("mission");
}