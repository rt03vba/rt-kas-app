const SUPABASE_URL="https://bbolukhqpvsmdcceipmn.supabase.co"

const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib2x1a2hxcHZzbWRjY2VpcG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTI4MjksImV4cCI6MjA4ODg4ODgyOX0.xeZwWLufxwZT7ELwG29Y0MaC8JHee9THUiTuqP6QFss"

const supabase=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY)

let role="warga"

function login(){

let pass=document.getElementById("password").value

if(pass==="111"){role="admin"}
if(pass==="123"){role="warga"}

if(pass==="111"||pass==="123"){

document.getElementById("loginPage").style.display="none"
document.getElementById("appPage").style.display="block"

showPage("dashboard")

loadDashboard()
loadWarga()
loadDropdown()
loadKas()
loadIuran()

initChart()

}else{

alert("Password salah")

}

}

function showPage(page){

document.querySelectorAll(".page").forEach(p=>p.style.display="none")

document.getElementById(page).style.display="block"

}

function uploadLogo(e){

let reader=new FileReader()

reader.onload=function(){

document.getElementById("logoRT").src=reader.result

}

reader.readAsDataURL(e.target.files[0])

}

async function loadDashboard(){

const {data:warga}=await supabase.from("warga").select("")
const {data:kas}=await supabase.from("kas").select("")

let totalWarga=warga ? warga.length : 0

document.getElementById("totalWarga").innerText=totalWarga

let masuk=0
let keluar=0

if(kas){

kas.forEach(k=>{

if(k.jenis==="masuk"){masuk+=k.jumlah}
if(k.jenis==="keluar"){keluar+=k.jumlah}

})

}

document.getElementById("kasMasuk").innerText=masuk
document.getElementById("kasKeluar").innerText=keluar

}

async function loadWarga(){

const {data}=await supabase.from("warga").select("*").order("alamat")

let list=document.getElementById("wargaList")

list.innerHTML=""

if(!data) return

data.forEach(w=>{

let nik=""

if(role==="admin"){nik="NIK:"+w.nik+"<br>"}

let div=document.createElement("div")

div.className="warga"

div.innerHTML=

"<b>"+w.nama+"</b><br>"+
nik+
"Alamat:"+w.alamat+"<br>"+
"Status:"+w.status

list.appendChild(div)

})

}

function searchWarga(){

let input=document.getElementById("searchWarga").value.toLowerCase()

document.querySelectorAll(".warga").forEach(w=>{

w.style.display=w.innerText.toLowerCase().includes(input)?"block":"none"

})

}

async function loadDropdown(){

const {data}=await supabase.from("warga").select("*")

let drop=document.getElementById("dropdownWarga")

drop.innerHTML=""

if(!data) return

data.forEach(w=>{

let opt=document.createElement("option")

opt.value=w.nama
opt.text=w.nama

drop.appendChild(opt)

})

}

async function tambahIuran(){

let nama=document.getElementById("dropdownWarga").value
let jumlah=document.getElementById("jumlahIuran").value

await supabase.from("iuran").insert([{nama:nama,jumlah:jumlah}])

loadIuran()

}

async function loadIuran(){

const {data}=await supabase.from("iuran").select("*")

let list=document.getElementById("iuranList")

list.innerHTML=""

if(!data) return

data.forEach(i=>{

let div=document.createElement("div")

div.className="warga"

div.innerHTML=i.nama+" - Rp "+i.jumlah

list.appendChild(div)

})

}

async function tambahKas(){

let jumlah=document.getElementById("kasJumlah").value
let jenis=document.getElementById("jenisKas").value
let ket=document.getElementById("kasKet").value

await supabase.from("kas").insert([{

jumlah:jumlah,
jenis:jenis,
keterangan:ket

}])

loadKas()

}

async function loadKas(){

const {data}=await supabase.from("kas").select("*")

let list=document.getElementById("kasList")

list.innerHTML=""

if(!data) return

data.forEach(k=>{

let div=document.createElement("div")

div.className="warga"

div.innerHTML="Rp "+k.jumlah+" - "+k.keterangan

list.appendChild(div)

})

}

let chart

function initChart(){

const ctx=document.getElementById("chartKas")

chart=new Chart(ctx,{
type:"bar",
data:{
labels:["Kas Masuk","Kas Keluar"],
datasets:[{
label:"Kas RT",
data:[0,0]
}]
}
})

}

async function exportExcel(){

const {data}=await supabase.from("kas").select("*")

const ws=XLSX.utils.json_to_sheet(data)

const wb=XLSX.utils.book_new()

XLSX.utils.book_append_sheet(wb,ws,"KasRT")

XLSX.writeFile(wb,"laporan_kas_rt.xlsx")

}

async function exportPDF(){

const {data}=await supabase.from("kas").select("*")

const {jsPDF}=window.jspdf

let doc=new jsPDF()

let y=10

data.forEach(k=>{

doc.text("Rp "+k.jumlah+" - "+k.keterangan,10,y)

y+=10

})

doc.save("laporan_kas_rt.pdf")

}
