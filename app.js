const kasMasuk = 500000
const kasKeluar = 200000

const ctx = document.getElementById("kasChart")

new Chart(ctx, {
type: "bar",

data: {
labels: ["Kas Masuk","Kas Keluar"],

datasets: [{
label: "Statistik Kas RT",
data: [kasMasuk,kasKeluar]
}]
}

})a