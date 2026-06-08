const API_URL =
"https://script.google.com/macros/s/AKfycbxcTRZ_KKM2WRXkUbk6MQSpYFCbARhINZOKSRCaGeZhQO9C7EuctWGgeU8klypl9LK0/exec";

let products = [];

const pin = prompt("Masukkan PIN Admin");

if(pin !== "1234"){
alert("PIN salah");
location.href="index.html";
}

loadProducts();

async function loadProducts(){

const res = await fetch(
`${API_URL}?action=getProducts`
);

products = await res.json();

renderProducts();

}

function renderProducts(){

const keyword =
document
.getElementById("searchInput")
.value
.toLowerCase();

const tbody =
document.getElementById("productTable");

tbody.innerHTML="";

products
.filter(p =>
p.nama.toLowerCase().includes(keyword)
)
.forEach(product=>{

tbody.innerHTML += `
<tr>

<td>${product.id}</td>

<td>${product.nama}</td>

<td>${product.harga}</td>

<td>

<button
class="action-btn"
onclick='editProduct("${product.id}")'>
Edit
</button>

<button
class="action-btn"
onclick='deleteProduct("${product.id}")'>
Hapus
</button>

</td>

</tr>
`;

});

}

async function saveProduct(){

const data = {

action:"saveProduct",

id:
document.getElementById("idProduk").value,

nama:
document.getElementById("namaProduk").value,

harga:
document.getElementById("hargaProduk").value,

satuan:
document.getElementById("satuanProduk").value

};

const res = await fetch(API_URL,{
method:"POST",
body:JSON.stringify(data)
});

const result = await res.json();

if(result.success){

alert(result.message);

clearForm();

loadProducts();

}else{

alert(result.message);

}

clearForm();

loadProducts();

}

function clearForm(){

document.getElementById("idProduk").value="";
document.getElementById("namaProduk").value="";
document.getElementById("hargaProduk").value="";
document.getElementById("satuanProduk").value="PCS";

}

function editProduct(id){

const product =
products.find(p=>p.id==id);

if(!product) return;

document.getElementById("idProduk").value=
product.id;

document.getElementById("namaProduk").value=
product.nama;

document.getElementById("hargaProduk").value=
product.harga;

document.getElementById("satuanProduk").value=
product.satuan;

window.scrollTo({
top:0,
behavior:"smooth"
});

}

async function deleteProduct(id){

if(!confirm("Hapus produk?"))
return;

await fetch(
`${API_URL}?action=deleteProduct&id=${id}`
);

loadProducts();

}

let scanner;

function beep(){

const audio = new Audio(
"https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
);

audio.play();

}

function startScanner(){

document
.getElementById("reader")
.style.display="block";

scanner = new Html5Qrcode("reader");

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

scanner.stop();

document
.getElementById("reader")
.style.display="none";

}
