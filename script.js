let step = 0;
let data = {};

// 📦 mission unique source
const mission = [
  { name: "Boîte à outils", qty: 1, icon: "🧰" },
  { name: "Peinture murale", qty: 3, icon: "🎨" },
  { name: "Tournevis", qty: 5, icon: "🪛" },
  { name: "Chaise de jardin", qty: 4, icon: "🪑" },
  { name: "Gazon synthétique", qty: 2, icon: "🌱" }
];

/* ======================
   NAVIGATION
====================== */

function show(id) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
}

/* ======================
   INIT
====================== */

window.onload = () => {
  show("lock");
  renderMissionList();
};

/* ======================
   ACTIONS
====================== */

function unlock() {
  show("home");
}

function openMission() {
  show("mission");
}

/* ======================
   LIST MISSION
====================== */

function renderMissionList() {
  const list = document.getElementById("missionList");
  if (!list) return;

  list.innerHTML = "";

  mission.forEach(item => {
    list.innerHTML += `
      <li>${item.icon} ${item.name} — ${item.qty}</li>
    `;
  });
}

/* ======================
   PICK SYSTEM
====================== */

function startMission() {
  step = 0;
  data = {};
  showPick();
}

function showPick() {
  const item = mission[step];

  document.getElementById("productName").innerText = item.name;
  document.getElementById("productIcon").innerText = item.icon;

  document.getElementById("infoBox").innerHTML =
    `📥 Quantité à prélever : <strong>${item.qty}</strong>`;

  document.getElementById("qty").value = "";

  show("pick");
}

function validatePick() {
  const item = mission[step];

  data[item.name] = Number(document.getElementById("qty").value);

  step++;

  if (step < mission.length) {
    showPick();
  } else {
    showRecap();
  }
}

/* ======================
   RECAP FINAL
====================== */

function showRecap() {
  let html = "";

  mission.forEach(item => {
    html += `
      <p>
        ${item.icon} ${item.name} :
        <strong>${data[item.name] || 0}</strong> / ${item.qty}
      </p>
    `;
  });

  document.getElementById("recapList").innerHTML = html;

  show("recap");
}

/* ======================
   DELIVERY PAGE
====================== */

function showDelivery() {
  show("delivery");
}

/* ======================
   EXPEDITION
====================== */

function ship() {
  showDelivery();
}

/* ======================
   RESTART APP
====================== */

function restartApp() {
    step = 0;
    data = {};
    show("lock");
  }