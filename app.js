const API_URL =
"https://script.google.com/macros/s/AKfycbx2QCToOg42Agu9o3kk-E1yySauYuED7UXejCerDxi5FK1xmgjR9PA1X339Ixo8UzFr/exec";

let qty = 1;
let cart = [];
let scanner = null;

function beep(){

const audio = new Audio(
"https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
);

audio.play();

}

function plusQty(){

qty++;

document.getElementById(
"qtyDisplay"
).innerText = qty;

}

function minusQty(){

if(qty > 1){

qty--;

document.getElementById(
"qtyDisplay"
).innerText = qty;

}

}

async function searchById(){

const id =
document.getElementById(
"idProduk"
).value;

if(!id) return;

const res = await fetch(
`${API_URL}?action=getProduct&id=${id}`
);

const product =
await res.json();

if(product){

fillProduct(product);

}

}

function fillProduct(product){

document.getElementById(
"idProduk"
).value = product.id;

document.getElementById(
"namaProduk"
).value = product.nama;

document.getElementById(
"hargaProduk"
).value = product.harga;

document.getElementById(
"satuanProduk"
).value = product.satuan;

}

async function searchProductName(){

const keyword =
document.getElementById(
"namaProduk"
).value;

if(keyword.length < 2){

document.getElementById(
"suggestions"
).style.display = "none";

return;

}

const res = await fetch(
`${API_URL}?action=searchProduct&q=${keyword}`
);

const products =
await res.json();

const box =
document.getElementById(
"suggestions"
);

box.innerHTML = "";

products.forEach(product=>{

box.innerHTML += `
<div
class="suggestion"
onclick='selectProduct(${JSON.stringify(product)})'>
${product.nama}
</div>
`;

});

box.style.display = "block";

}

function selectProduct(product){

fillProduct(product);

document.getElementById(
"suggestions"
).style.display = "none";

}

function saveBill(){

const id =
document.getElementById(
"idProduk"
).value;

if(!id){

alert("Pilih produk dulu");

return;

}

const nama =
document.getElementById(
"namaProduk"
).value;

const harga =
Number(
document.getElementById(
"hargaProduk"
).value
);

cart.push({

id,
nama,
harga,
qty,
subtotal:harga*qty

});

renderBill();

clearInput();

}

function clearInput(){

document.getElementById(
"idProduk"
).value="";

document.getElementById(
"namaProduk"
).value="";

document.getElementById(
"hargaProduk"
).value="";

document.getElementById(
"satuanProduk"
).value="";

qty=1;

document.getElementById(
"qtyDisplay"
).innerText=1;

}

function renderBill(){

const container =
document.getElementById(
"billContainer"
);

container.innerHTML="";

let total=0;

cart.forEach((item,index)=>{

total += item.subtotal;

container.innerHTML += `

<div class="bill-item">

${index+1}. ${item.nama}<br>

${item.qty} x ${item.harga}

= ${item.subtotal}

</div>

`;

});

document.getElementById(
"totalHarga"
).innerText =
total.toLocaleString("id-ID");

document.getElementById(
"resetBtn"
).classList.remove("hidden");

}

function resetBill(){

if(!confirm("Reset bill?"))
return;

cart=[];

document.getElementById(
"billContainer"
).innerHTML =
"Belum ada item";

document.getElementById(
"totalHarga"
).innerText="0";

document.getElementById(
"resetBtn"
).classList.add("hidden");

}

function goAdmin(){

const pin =
prompt("Masukkan PIN Admin");

if(pin==="1234"){

location.href =
"admin.html";

}else{

alert("PIN salah");

}

}

function startScanner(){

document.getElementById(
"reader"
).style.display="block";

scanner =
new Html5Qrcode("reader");

scanner.start(
{ facingMode:"environment" },
{
fps:10,
qrbox:250
},
onScanSuccess
);

}

async function onScanSuccess(code){

beep();

document.getElementById(
"idProduk"
).value = code;

await searchById();

scanner.stop();

document.getElementById(
"reader"
).style.display="none";

}
