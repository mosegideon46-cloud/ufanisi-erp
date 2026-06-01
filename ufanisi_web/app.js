// =========================
// FILE: app.js (UPDATED STABLE)
// =========================

const $ = (id) => document.getElementById(id);

// ================= STORAGE =================
let products =
JSON.parse(localStorage.getItem("products")) || [];

let orders =
JSON.parse(localStorage.getItem("orders")) || [];

let settings =
JSON.parse(localStorage.getItem("settings")) || {
storeName: "UFANISI POULTRY",
whatsapp: "254712345678",
logo: "",
facebook: "",
instagram: "",
tiktok: "",
darkMode: false
};

// ================= SAVE DATA =================
function saveData(){
localStorage.setItem("products", JSON.stringify(products));
localStorage.setItem("orders", JSON.stringify(orders));
localStorage.setItem("settings", JSON.stringify(settings));
}

// ================= NOTIFICATIONS =================
function notify(message, color="green"){
let note = document.createElement("div");

note.innerText = message;
note.style.position = "fixed";
note.style.top = "20px";
note.style.right = "20px";
note.style.background = color;
note.style.color = "white";
note.style.padding = "12px";
note.style.borderRadius = "8px";
note.style.zIndex = "999999";

document.body.appendChild(note);

setTimeout(() => note.remove(), 3000);
}

// ================= NAVIGATION =================
function goStore(){
$("storePage").classList.add("active");
$("orderPage").classList.remove("active");
}

function goOrder(){
$("storePage").classList.remove("active");
$("orderPage").classList.add("active");
}
function markAsSold(index){

orders[index].status = "SOLD";

saveData();
renderAll();

notify("✅ Order marked as SOLD");
}
function printReceipt(index){

let o = orders[index];

let win = window.open("", "_blank");

win.document.write(`
<html>
<head>
<title>Receipt</title>
<style>
body{font-family:Arial;padding:20px;}
h2{color:#2563eb;}
hr{margin:10px 0;}
</style>
</head>

<body>

<h2>${settings.storeName}</h2>
<hr>

<p><b>Customer:</b> ${o.customer}</p>
<p><b>Phone:</b> ${o.phone}</p>
<p><b>Product:</b> ${o.product}</p>
<p><b>Quantity:</b> ${o.qty}</p>
<p><b>Total:</b> KSh ${o.total}</p>
<p><b>Date:</b> ${o.time}</p>

<hr>
<p>Thank you for your purchase!</p>

<script>
window.print();
</script>

</body>
</html>
`);

win.document.close();
}
function sendReceipt(index){

let o = orders[index];

let msg =
`*RECEIPT - ${settings.storeName}*%0A%0A` +
`Customer: ${o.customer}%0A` +
`Phone: ${o.phone}%0A` +
`Product: ${o.product}%0A` +
`Qty: ${o.qty}%0A` +
`Total: KSh ${o.total}%0A` +
`Status: ${o.status}%0A%0A` +
`Thank you for your purchase!`;

window.open(
`https://wa.me/${o.phone}?text=${msg}`,
"_blank"
);

notify("📤 Receipt Sent");
}
function deleteOrder(index){

if(orders[index].status === "SOLD"){
notify("❌ Cannot delete SOLD order","red");
return;
}

if(confirm("Delete this order?")){
orders.splice(index,1);
saveData();
renderAll();
notify("✅ Order Deleted","red");
}
}

// ================= ADMIN ACCESS =================
document.addEventListener("keydown", (e) => {
if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
$("adminLogin").style.display = "flex";
}

if (e.ctrlKey && e.key.toLowerCase() === "o") {
$("adminLogin").style.display = "flex";
}
});

document.addEventListener("DOMContentLoaded", () => {
let logo = $("logoText");
let timer;

logo.addEventListener("touchstart", () => {
timer = setTimeout(() => {
$("adminLogin").style.display = "flex";
}, 3000);
});

logo.addEventListener("touchend", () => {
clearTimeout(timer);
});
});

// ================= ADMIN LOGIN =================
function checkAdmin(){
let pass = $("adminPass").value;

if(pass === "Ufanisi@2375"){
$("adminLogin").style.display = "none";
$("adminPanel").classList.add("active");
notify("✅ Admin Access Granted");
}else{
notify("❌ Wrong Password","red");
}
}

function closeAdmin(){
$("adminLogin").style.display = "none";
}

function logoutAdmin(){
$("adminPanel").classList.remove("active");
notify("✅ Logged Out");
}

// ================= TABS =================
function showTab(tab){
document.querySelectorAll(".tab")
.forEach(t => t.style.display = "none");

$(tab + "Tab").style.display = "block";
}

// ================= SETTINGS =================
function toggleDarkMode(){
settings.darkMode = !settings.darkMode;
applySettings();
saveData();
notify("✅ Theme Updated");
}

function saveSettings(){
settings.storeName = $("storeNameInput").value;
settings.whatsapp = $("whatsappInput").value;
settings.facebook = $("facebookInput").value;
settings.instagram = $("instagramInput").value;
settings.tiktok = $("tiktokInput").value;

let file = $("logoUpload").files[0];

if(file){
let reader = new FileReader();

reader.onload = function(){
settings.logo = reader.result;
applySettings();
saveData();
notify("✅ Settings Updated");
};

reader.readAsDataURL(file);
}else{
applySettings();
saveData();
notify("✅ Settings Updated");
}
}

function deleteLogo(){
settings.logo = "";
saveData();
applySettings();
notify("✅ Logo Deleted","red");
}

function applySettings(){
$("logoText").innerText = settings.storeName;

if(settings.darkMode){
document.body.classList.add("dark");
}else{
document.body.classList.remove("dark");
}

if(settings.logo){
$("storeLogo").src = settings.logo;
$("storeLogo").style.display = "block";
}else{
$("storeLogo").style.display = "none";
}

$("storeNameInput").value = settings.storeName;
$("whatsappInput").value = settings.whatsapp;
$("facebookInput").value = settings.facebook;
$("instagramInput").value = settings.instagram;
$("tiktokInput").value = settings.tiktok;
}

// ================= ADD PRODUCT =================
function addProduct(event){

let name = $("pName").value.trim();
let price = $("pPrice").value;
let stock = $("pStock").value;
let desc = $("pDesc").value;
let file = $("pImage").files[0];

if(!name || !price || !stock || !desc){
notify("❌ Fill All Fields","red");
return;
}

let exists = products.find(
p => p.name.toLowerCase() === name.toLowerCase()
);

if(exists){
notify("❌ Product Already Exists","red");
return;
}

if(!file){
notify("❌ Select Product Image","red");
return;
}

let btn = event.target;
btn.disabled = true;

let reader = new FileReader();

reader.onload = function(){

products.push({
name,
price,
stock,
desc,
image: reader.result
});

saveData();
renderAll();

notify("✅ Product Added Successfully");

$("pName").value="";
$("pPrice").value="";
$("pStock").value="";
$("pDesc").value="";
$("pImage").value="";

btn.disabled = false;
};

reader.readAsDataURL(file);
}

// ================= EDIT PRODUCT =================
function editProduct(index){

let p = products[index];

let newPrice = prompt("New Price", p.price);
let newStock = prompt("New Stock", p.stock);

if(newPrice !== null) p.price = newPrice;
if(newStock !== null) p.stock = newStock;

saveData();
renderAll();
notify("✅ Product Updated");
}

// ================= DELETE PRODUCT =================
function deleteProduct(index){
if(confirm("Delete Product?")){
products.splice(index,1);
saveData();
renderAll();
notify("✅ Product Deleted","red");
}
}

// ================= CREATE ORDER =================
function createOrder(event){

let p = products.find(x =>
x.name === $("productSelect").value
);

if(!p){
notify("❌ Select Product","red");
return;
}

let customer = $("cName").value.trim();
let phone = $("cPhone").value.trim();
let qty = Number($("qty").value);

if(!customer || !phone || !qty){
notify("❌ Fill All Fields","red");
return;
}

if(qty > Number(p.stock)){
notify("❌ Not Enough Stock","red");
return;
}

let btn = event.target;
btn.disabled = true;

p.stock = Number(p.stock) - qty;

let total = qty * Number(p.price);

orders.push({
customer,
phone,
product: p.name,
qty,
total,
time: new Date().toLocaleString(),
status: "PENDING"
});

saveData();
renderAll();

let message =
`*${settings.storeName} ORDER*%0A%0A` +
`Customer: ${customer}%0A` +
`Phone: ${phone}%0A` +
`Product: ${p.name}%0A` +
`Quantity: ${qty}%0A` +
`Total: KSh ${total}`;

window.open(
`https://wa.me/${settings.whatsapp}?text=${message}`,
"_blank"
);

notify("✅ Order Sent Successfully");

$("cName").value="";
$("cPhone").value="";
$("qty").value="";

btn.disabled = false;
}

// ================= DELETE ORDER (NEW FIX) =================
function deleteOrder(index){
if(confirm("Delete this order?")){
orders.splice(index,1);
saveData();
renderAll();
notify("✅ Order Deleted","red");
}
}

// ================= RENDER =================
function renderAll(){

$("marketList").innerHTML =
products.map(p=>`
<div class="product-card">
<img src="${p.image}">
<h3>${p.name}</h3>
<p><b>KSh ${p.price}</b></p>
<p>${p.desc}</p>
<p>Stock: ${p.stock}</p>
<button class="btn" onclick="goOrder()">Order</button>
</div>
`).join("");

$("productSelect").innerHTML =
products.map(p=>`<option>${p.name}</option>`).join("");

$("adminProducts").innerHTML =
products.map((p,index)=>`
<div class="product-card">
<img src="${p.image}">
<h3>${p.name}</h3>
<p>KSh ${p.price}</p>
<p>Stock: ${p.stock}</p>
<button class="btn" onclick="editProduct(${index})">Edit</button>
<button class="btn danger" onclick="deleteProduct(${index})">Delete</button>
</div>
`).join("");

$("adminOrders").innerHTML =
orders.map((o,index)=>`

<div class="product-card">

<h3>${o.customer}</h3>
<p>${o.phone}</p>
<p>${o.product}</p>
<p>Qty: ${o.qty}</p>
<p>KSh ${o.total}</p>
<p>${o.time}</p>

<p>Status: <b>${o.status}</b></p>

${o.status === "PENDING" ? `
<button class="btn"
onclick="markAsSold(${index})">
Mark as Sold
</button>
` : `
<button class="btn"
onclick="printReceipt(${index})">
Print Receipt
</button>

<button class="btn"
onclick="sendReceipt(${index})">
Send Receipt
</button>
`}

<button class="btn danger"
onclick="deleteOrder(${index})">
Delete Order
</button>

</div>

`).join("");

let totalSales =
orders.reduce((sum,o)=>sum + Number(o.total),0);

$("reportBox").innerHTML = `
<div class="product-card">
<h3>Total Sales</h3>
<p>KSh ${totalSales}</p>
<h3>Total Orders</h3>
<p>${orders.length}</p>
<h3>Total Products</h3>
<p>${products.length}</p>
</div>
`;

$("socialLinks").innerHTML = `
<div class="socials">
<a href="${settings.facebook}" target="_blank">Facebook</a>
<a href="${settings.instagram}" target="_blank">Instagram</a>
<a href="${settings.tiktok}" target="_blank">TikTok</a>
</div>
`;
}

// ================= INIT =================
applySettings();
renderAll();