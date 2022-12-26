//Constant
const startButton = document.querySelector("#startButton")
const inputSegment = document.querySelector("#inputSegment")
const parentContainer = document.querySelector("body")
const gameDiv = document.querySelector("#game")
const splashDiv = document.querySelector("#splash")
let MAP = []
const BOMB_MAP = []

const RIGHT_CLICK = 3
const HOLD_DELAY = 300

let score = 0

let revealed = 0

let isFinish = false


function updateNeighbor(i, j, size) {
    //atas
    if (i > 0) {
        if (MAP[i - 1][j].numBomb >= 0) {
            MAP[i - 1][j].numBomb++;
        }
        //kanan atas
        if (j < size - 1 && MAP[i - 1][j + 1].numBomb >= 0) {
            MAP[i - 1][j + 1].numBomb++;
        }
    }
    //bawah
    if (i < size - 1) {
        if (MAP[i + 1][j].numBomb >= 0) {
            MAP[i + 1][j].numBomb++;
        }
        //kanan bawah
        if (j < size - 1 && MAP[i + 1][j + 1].numBomb >= 0) {
            MAP[i + 1][j + 1].numBomb++;
        }
    }
    //kanan
    if (j < size - 1 && MAP[i][j + 1].numBomb >= 0) {
        MAP[i][j + 1].numBomb++;
    }
    //kiri
    if (j > 0) {
        if (MAP[i][j - 1].numBomb >= 0) {
            MAP[i][j - 1].numBomb++;
        }
        //kiri atas
        if (i > 0 && MAP[i - 1][j - 1].numBomb >= 0) {
            MAP[i - 1][j - 1].numBomb++;
        }
        //kiri bawah
        if (i < size - 1 && MAP[i + 1][j - 1].numBomb >= 0) {
            MAP[i + 1][j - 1].numBomb++
        }
    }

}

//membuat peta dimana saja bom berada
function generateBombMap(size) {
    let bombCount = document.querySelector("#bombCount").value
    for (counter = 0; counter < bombCount; counter++) {
        // do {
        //     i_index = Math.floor(Math.random() * size)
        //     j_index = Math.floor(Math.random() * size)
        // } while (MAP[i_index][j_index].numBomb !== 0)
        let choosed_plot_idx = Math.floor(Math.random() * BOMB_MAP.length-1)
        if(choosed_plot_idx<0){
            choosed_plot_idx = 0
        }
        let choosed_plot = BOMB_MAP[choosed_plot_idx]
        let i_index = choosed_plot[0]
        let j_index = choosed_plot[1]
        BOMB_MAP.splice(choosed_plot_idx,1)

        MAP[i_index][j_index].numBomb = -1 //-1 berarti ada bomb
        updateNeighbor(i_index, j_index, size)
    }
}


function initiateMap(size) {
    for (i = 0; i < size; i++) {
        MAP[i] = new Array(size)
        for (j = 0; j < size; j++) {
            MAP[i][j] = {
                numBomb: 0,
                timestamp: -1, // kalau -1 berarti gak aktif timestampnya
            }
            BOMB_MAP.push([i,j])
        }
    }
}

//fungsi untuk membuat papan
function generateBoard(size) {
    initiateMap(size)
    generateBombMap(size)
    html = '<table cellspacing="0">'
    for (i = 0; i < size; i++) {
        html += '<tr>'
        for (j = 0; j < size; j++) {
            html += `<td id='${i}${j}' onmousedown='start(this)' onmouseup='finish(this)'></td>`
        }
        html += '</tr>'
    }
    html += '</table>'
    gameDiv.innerHTML = html
    inputSegment.innerHTML = ""
    console.log(MAP)
}




//Event Handler
function startGame(){
    console.log(MAP)
    console.log(isFinish)
    let size = document.querySelector("#sizeInput").value
    generateBoard(size)
}



function start( cell) {
    //event.preventDefault()
    //selain itu
    console.log("asu")
    cell_id = cell.id
    i_index = cell_id[0]
    j_index = cell_id[1]
    MAP[i_index][j_index].timestamp = new Date()
    // if(MAP[i_index][j_index].numBomb===-1){
    //     cell.style.background = "red"
    // }
    // else{
    //     cell.innerHTML = MAP[i_index][j_index].numBomb
    // }

}

function finish( cell) {
    //event.preventDefault()
    if (isFinish) {
        //kalau misalnya finish gak bisa ngapa ngapain
        return
    }
    //selain itu
    cell_id = cell.id
    i_index = cell_id[0]
    j_index = cell_id[1]
    if (cell.classList.contains("revealed")) {
        //dah di buka langsung kick aja
        return
    }
    let curTimestamp = new Date()
    if (curTimestamp - MAP[i_index][j_index].timestamp > HOLD_DELAY) {
        //nge hold lebih dari 1 detik set flag
        setFlag(cell)
        console.log("assss");
        if(cell.classList.contains("flag") && MAP[i_index][j_index].numBomb === -1){
            score++
            revealed++
        }
        else if(!cell.classList.contains("flag") && MAP[i_index][j_index].numBomb === -1){
            score--
            revealed--
        }
        // else if(!cell.classList.contains("flag") && MAP[i_index][j_index].numBomb !== -1){
        //     revealed--
        // }
        // else if(cell.classList.contains("flag") && MAP[i_index][j_index].numBomb !== -1){
        //     revealed--
        // }
        checkWin()
        return
    }
    MAP[i_index][j_index].timestamp = curTimestamp
    //else berarti dia nekan ini
    if(cell.classList.contains("flag")){
        //lagi di flag jangan di trendang
        return
    }
    else if (MAP[i_index][j_index].numBomb === -1) {
        // cell.style.background = "red"
        cell.innerHTML = '<img class="bomb" src="image/bomb.jpg" draggable="false" ondragstart="return false">'
        gameover()
    }
    else {
        cell.innerHTML = MAP[i_index][j_index].numBomb
        cell.classList.add("open")
        score++;
        revealed++;
    }
    cell.classList.add("revealed")
    //cek apakah menang
    checkWin()
}

function checkWin(){
    if(win()){
        finish = true;
        alert("anda menang!")
        splashDiv.innerHTML = `
        <h1>score akhir: ${score}</h1>
        <button onclick="restart()">Mainkan Ulang</button>
    `
    }
}

function win(){
    console.log(revealed)
    return revealed===(MAP.length*MAP.length)
}
function setFlag(cell) {
    console.log("anyinggg")
    cell_id = cell.id
    i_index = cell_id[0]
    j_index = cell_id[1]
    if (cell.classList.contains("flag")) {
        cell.classList.remove("flag")
        cell.innerHTML = ''
    }
    else {
        cell.classList.add("flag")
        cell.innerHTML = '<img src="image/flag.jpg" draggable="false" ondragstart="return false">'
    }
}

function gameover() {
    alert("Kau kalah!")
    finish = true
    splashDiv.innerHTML = `
        <h1>score akhir: ${score}</h1>
        <button onclick="restart()">Mainkan Ulang</button>
    `
}

function restart() {
    // inputSegment.innerHTML = `
    // <label for="size">Pilih Ukuran Papan:</label>
    // <input type="number" id="sizeInput">
    // <label for="bombCount">Berapa banyak bom yang ada:</label>
    // <input type="number" id="bombCount">
    // <button id="startButton" onclick="startGame()">Mulai</button>
    // `
    // splashDiv.innerHTML = ''
    // gameDiv.innerHTML = ''
    // MAP = []
    // score = 0
    // finish = false
    location.reload()
}