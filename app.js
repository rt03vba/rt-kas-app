const SUPABASE_URL = "https://bbolukhqpvsmdcceipmn.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib2x1a2hxcHZzbWRjY2VpcG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTI4MjksImV4cCI6MjA4ODg4ODgyOX0.xeZwWLufxwZT7ELwG29Y0MaC8JHee9THUiTuqP6QFss"

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)


function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.style.display="none"
})

document.getElementById(page).style.display="block"

}


async function loadWarga(){

const { data, error } = await supabase
.from("warga")
.select("*")
.order("alamat")

const list = document.getElementById("warga")

list.innerHTML = ""

data.forEach(w=>{

const div = document.createElement("div")

div.innerHTML = `
<div style="padding:10px;border-bottom:1px solid #ddd">
<b>${w.nama}</b><br>
Status : ${w.status}<br>
Alamat : ${w.alamat}
</div>
`

list.appendChild(div)

})

}

loadWarga()
