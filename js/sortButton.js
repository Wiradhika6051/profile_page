
// Sorting modes
const sortModes = [
    {key: "name", order: "asc", label: "Name ↑"},
  { key: "name", order: "desc", label: "Name ↓" },
  { key: "date", order: "asc", label: "Date ↑" },
  { key: "date", order: "desc", label: "Date ↓" }
]

function sortData(datas,modeIdx,attribute){
    const mode = sortModes[modeIdx]
    datas.sort((a,b)=>{
        let valA = a[mode.key]
        let valB = b[mode.key]
        // Kalau date convert ke Date objects
        if(mode.key==='date'){
            valA = new Date(valA)
            valB = new Date(valB)
        }
        // karena kalau date gak bisa pakai ===, kita cek dari valA dan valB nya aja
        if (valA < valB){
            return mode.order==='asc'? -1 : 1;
        }
        if (valA > valB){
            return mode.order==='asc'? 1 : -1;
        }
        // sisanya berarti sama
        return 0;
    })
    renderList();
    document.getElementById("sortButton").innerText = `Sort: ${mode.label}`;
}


function renderList() {
//   const list = document.getElementById("dataList");
//   list.innerHTML = "";
//   data.forEach(item => {
//     const li = document.createElement("li");
//     li.textContent = `${item.name} — ${new Date(item.date).toLocaleDateString(undefined, { month: "long", year: "numeric" })}`;
//     list.appendChild(li);
//   });
}

document.getElementById("sortButton").addEventListener("click", () => {
    // TODO: check tipe sort
  currentModeIndex = (currentModeIndex + 1) % sortModes.length;
  sortData();
});

// Initial render
sortData();