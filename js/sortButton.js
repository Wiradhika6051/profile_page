
// Sorting modes

export default function sortData(datas,mode,label,renderer){
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
    updateUI(label)
    // render ulang label
    renderer(datas)
}

function updateUI(label){
    // Close dropdown
    // Update button label
    document.getElementById("sortText").innerText = `Sort: ${label}`;
}