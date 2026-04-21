let step = 0;
let data = {};
let mission = [];
let client = null;
let orderId = null;

const $ = (id) => document.getElementById(id);

const clients = [
{ name:"Jean ROBERT", address:"26 sous les cocotiers, 97490 La Réunion"},
{ name:"Sophie MARTIN", address:"12 rue des manguiers, 26000 Valence"},
{ name:"Karim BENALI", address:"8 avenue du port, 13002 Marseille"},
{ name:"Emma LEBLANC", address:"5 rue des alizés, 75012 Paris"}
];

const products = [
{ name:"Boîte à outils", icon:"🧰"},
{ name:"Peinture murale", icon:"🎨"},
{ name:"Tournevis", icon:"🪛"},
{ name:"Chaise de jardin", icon:"🪑"},
{ name:"Gazon synthétique", icon:"🌱"},
{ name:"Perceuse", icon:"🔧"}
];

function generateMission(){

client = clients[Math.floor(Math.random()*clients.length)];

orderId = Math.floor(Math.random()*90000+10000);

mission = [...products]
.sort(()=>Math.random()-0.5)
.slice(0,4)
.map(p=>({
...p,
qty:Math.floor(Math.random()*4)+1
}));

}

function show(id){
document.querySelectorAll(".screen")
.forEach(s=>s.classList.remove("active"));

$(id).classList.add("active");
}

window.onload=()=>{
generateMission();
show("lock");
};

function unlock(){
show("home");
}

function openMission(){

generateMission();
renderMission();
show("mission");

}

function renderMission(){

$("clientName").textContent=client.name;
$("clientAddress").textContent=client.address;
$("orderId").textContent=orderId;

$("missionList").innerHTML=
mission.map(m=>
`<li>${m.icon} ${m.name} — ${m.qty}</li>`
).join("");

}

function startMission(){
step=0;
data={};
showPick();
}

function currentItem(){
return mission[step];
}

function showPick(){

const item=currentItem();

if(!item){
showRecap();
return;
}

$("productName").textContent=item.name;
$("productIcon").textContent=item.icon;

$("infoBox").innerHTML=
`Quantité demandée : <b>${item.qty}</b>`;

$("qty").value="";
$("warning").textContent="";

$("progress").textContent=
`Étape ${step+1}/${mission.length}`;

$("progress-fill").style.width=
(step/mission.length)*100+"%";

show("pick");

}

function validatePick(){

const item=currentItem();

if(!item){
showRecap();
return;
}

const val=Number($("qty").value);

if(isNaN(val)||val<0){
$("warning").textContent="Quantité invalide";
return;
}

if(val>item.qty){
$("warning").textContent=
"Impossible de dépasser la quantité prévue";
return;
}

data[item.name]=val;

step++;

if(step<mission.length){
showPick();
}else{
showRecap();
}

}

function showRecap(){

let missing=0;
let errors=0;
let html="";

$("finalClientName").textContent=client.name;
$("finalClientAddress").textContent=client.address;

mission.forEach(m=>{

const val=data[m.name]||0;

if(val<m.qty) missing++;
if(val>m.qty) errors++;

html+=`
<p>
${m.icon} ${m.name}
${val}/${m.qty}
</p>
`;

});

$("recapList").innerHTML=html;

const hasError=(missing>0||errors>0);

$("shipBtn").disabled=hasError;

$("shipBtn").textContent=
hasError
?"🚫 Expédition bloquée"
:"🚚 Expédier la commande";

$("fixBtn").style.display=
hasError?"block":"none";

show("recap");

}

function ship(){

  if($("shipBtn").disabled){
  alert("Compléter la commande");
  return;
  }
  
  show("delivery");
  
  let progress=0;
  
  const bar=$("deliveryProgress");
  const truck=$("truck");
  const percent=$("deliveryPercent");
  
  const timer=setInterval(()=>{
  
  progress+=4;
  
  bar.style.width=progress+"%";
  truck.style.left=progress+"%";
  percent.textContent=progress+"%";
  
  if(progress>=100){
  
  clearInterval(timer);
  
  setTimeout(()=>{
  show("success");
  },500);
  
  }
  
  },120);
  
  }
function backToPick(){
step=0;
showPick();
}

function restartApp(){

generateMission();
renderMission();

step=0;
data={};

show("mission");

}