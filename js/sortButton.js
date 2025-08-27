export default function sortData(datas,mode,label,renderer){
    const {key,order} = mode
    const direction = order === "asc" ? 1 : -1;

    datas.sort((a,b)=>{
        let valA = a[key]
        let valB = b[key]

        // Kalau date convert ke Date objects
        if(key==='date'){
            valA = new Date(valA)
            valB = new Date(valB)
        }

        if(valA===valB){
            return 0;
        }
        return valA < valB ? -1 * direction : 1 * direction
    })

    // Update UI
    updateUI(label)
    // render ulang label
    renderer(datas)
}

function updateUI(label){
    // Update button label
    document.getElementById("sortText").innerText = `Sort: ${label}`;
}