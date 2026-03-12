const SUPABASE_URL="https://bbolukhqpvsmdcceipmn.supabase.co"
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib2x1a2hxcHZzbWRjY2VpcG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTI4MjksImV4cCI6MjA4ODg4ODgyOX0.xeZwWLufxwZT7ELwG29Y0MaC8JHee9THUiTuqP6QFss"

const supabase = window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY)

let role="warga"
let chart=null


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

setTimeout(initChart,300)

}else{

alert("Password salah")

}

}



function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.style.display="none"
})

let el=document.getElementById(page)

if(el) el.style.display="block"

}



function uploadLogo(e){

let reader=new FileReader()

reader.onload=function(){

let logo=document.getElementById("logoRT")
if(logo) logo.src=reader.result

}

reader.readAsDataURL(e.target.files[0])

}



async function loadDashboard(){

const {data:warga,error:wargaErr}=await supabase.from("warga").select("*")
const {data:kas,error:kasErr}=await supabase.from("kas").select("*")

let totalWarga=0
let masuk=0
let keluar=0

if(warga && !wargaErr){
totalWarga=warga.length
}

if(kas && !kasErr){

kas.forEach(k=>{

let jumlah=Number(k.jumlah)||0

if(k.jenis==="masuk"){
masuk+=jumlah
}

if(k.jenis==="keluar"){
keluar+=jumlah
}

})

}

document.getElementById("totalWarga").innerText=totalWarga
document.getElementById("kasMasuk").innerText=masuk
document.getElementById("kasKeluar").innerText=keluar

updateChart(masuk,keluar)

}



async function loadWarga(){

const {data,error}=await supabase
.from("warga")
.select("*")
.order("alamat",{ascending:true})

let list=document.getElementById("wargaList")

if(!list) return

list.innerHTML=""

if(!data || error) return

data.forEach(w=>{

let nik=""

if(role==="admin"){
nik="<div>NIK: "+(w.nik||"-")+"</div>"
}

let div=document.createElement("div")
div.className="warga"

div.innerHTML=`
<div><b>${w.nama||""}</b></div>
${nik}
<div>Alamat: ${w.alamat||""}</div>
<div>Status: ${w.status||""}</div>
`

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

const {data,error}=await supabase.from("warga").select("*")

let drop=document.getElementById("dropdownWarga")

if(!drop) return

drop.innerHTML=""

if(!data || error) return

data.forEach(w=>{

let opt=document.createElement("option")
opt.value=w.nama
opt.text=w.nama

drop.appendChild(opt)

})

}



async function tambahIuran(){

let nama=document.getElementById("dropdownWarga").value
let jumlah=Number(document.getElementById("jumlahIuran").value)

if(!nama || !jumlah){
alert("Data belum lengkap")
return
}

await supabase.from("iuran").insert([{
nama:nama,
jumlah:jumlah
}])

document.getElementById("jumlahIuran").value=""

loadIuran()
loadDashboard()

}



async function loadIuran(){

const {data,error}=await supabase.from("iuran").select("*")

let list=document.getElementById("iuranList")

if(!list) return

list.innerHTML=""

if(!data || error) return

data.forEach(i=>{

let div=document.createElement("div")
div.className="warga"

div.innerHTML=`${i.nama} - Rp ${i.jumlah}`

list.appendChild(div)

})

}



async function tambahKas(){

let jumlah=Number(document.getElementById("kasJumlah").value)
let jenis=document.getElementById("jenisKas").value
let ket=document.getElementById("kasKet").value

if(!jumlah){
alert("Jumlah kosong")
return
}

await supabase.from("kas").insert([{

jumlah:jumlah,
jenis:jenis,
keterangan:ket

}])

document.getElementById("kasJumlah").value=""
document.getElementById("kasKet").value=""

loadKas()
loadDashboard()

}



async function loadKas(){

const {data,error}=await supabase.from("kas").select("*")

let list=document.getElementById("kasList")

if(!list) return

list.innerHTML=""

if(!data || error) return

data.forEach(k=>{

let div=document.createElement("div")
div.className="warga"

div.innerHTML=`Rp ${k.jumlah} - ${k.keterangan||""}`

list.appendChild(div)

})

}



function initChart(){

let canvas=document.getElementById("chartKas")

if(!canvas) return

const ctx=canvas.getContext("2d")

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



function updateChart(masuk,keluar){

if(!chart) return

chart.data.datasets[0].data=[masuk,keluar]
chart.update()

}



async function exportExcel(){

const {data,error}=await supabase.from("kas").select("*")

if(!data || error){
alert("Tidak ada data")
return
}

const ws=XLSX.utils.json_to_sheet(data)
const wb=XLSX.utils.book_new()

XLSX.utils.book_append_sheet(wb,ws,"KasRT")

XLSX.writeFile(wb,"laporan_kas_rt.xlsx")

}



async function exportPDF(){

const {data,error}=await supabase.from("kas").select("*")

if(!data || error){
alert("Tidak ada data")
return
}

const {jsPDF}=window.jspdf

let doc=new jsPDF()

let y=10

data.forEach(k=>{

doc.text(`Rp ${k.jumlah} - ${k.keterangan||""}`,10,y)

y+=10

})

doc.save("laporan_kas_rt.pdf")

}
