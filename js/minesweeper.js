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
const MAX_TILESIZE = 40

let score = 0
let bomb = 0;
let size = 0;

let revealed = 0

let isFinish = false

let time = 0

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
        let choosed_plot_idx = Math.floor(Math.random() * BOMB_MAP.length - 1)
        if (choosed_plot_idx < 0) {
            choosed_plot_idx = 0
        }
        let choosed_plot = BOMB_MAP[choosed_plot_idx]
        let i_index = choosed_plot[0]
        let j_index = choosed_plot[1]
        BOMB_MAP.splice(choosed_plot_idx, 1)

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
            BOMB_MAP.push([i, j])
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
    inputSegment.innerHTML = `
    <div id="topbar">
    <div class="container">
    <img src="image/timer.png" class="icon-top">
    <p id="timeText" class="top-text">${time}</p>
    </div>
    <button onclick="restart()" id="restartButton">Mulai Ulang</button>
    <div class="container">
    <img src="image/remaining-flag.jpg" class="icon-top">
    <p id="flagText" class="top-text">${bomb}</p>
    </div>
    </div>
    `
    setTimeout(function updateTime() {
        let timeText = document.querySelector("#timeText")
        if(timeText===null || timeText===undefined){
            return;
        }
        timeText.textContent = ++time;
        setTimeout(updateTime, 1000)
    }, 1000)
}




//Event Handler
function startGame() {
    size = document.querySelector("#sizeInput").value
    if (size < 1 || size > 40) {
        return;
    }
    //cek sebelahnya
    bomb = document.querySelector("#bombCount").value
    if (bomb < 0 || bomb > (size * size)) {
        return;
    }
    generateBoard(size)
}



function start(cell) {
    cell_id = cell.id
    i_index = cell_id[0]
    j_index = cell_id[1]
    MAP[i_index][j_index].timestamp = new Date()

}

function finish(cell) {
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
        if (cell.classList.contains("flag") && MAP[i_index][j_index].numBomb === -1) {
            score++
            revealed++
        }
        else if (!cell.classList.contains("flag") && MAP[i_index][j_index].numBomb === -1) {
            score--
            revealed--
        }
        checkWin()
        return
    }
    MAP[i_index][j_index].timestamp = curTimestamp
    //else berarti dia nekan ini
    if (cell.classList.contains("flag")) {
        //lagi di flag jangan di trendang
        return
    }
    else if (MAP[i_index][j_index].numBomb === -1) {
        cell.innerHTML = '<img class="bomb" src="image/bomb.jpg" draggable="false" ondragstart="return false">'
        gameover()
    }
    else {
        cell.innerHTML = MAP[i_index][j_index].numBomb
        cell.classList.add("open")
        revealOthers(i_index, j_index)
        score++;
        revealed++;
    }
    cell.classList.add("revealed")
    //cek apakah menang
    checkWin()
}

function checkWin() {
    if (win()) {
        finish = true;
        alert("anda menang!")
        splashDiv.innerHTML = `
        <h1>Skor Akhir: ${score}</h1>
        <h1>Waktu Bermain: ${time}</h1>
        <button onclick="restart()">Mainkan Ulang</button>
    `
        inputSegment.innerHTML = ``
    }
}

function getCell(i,j){
    pattern = `${i}${j}`
    cell = document.getElementById(pattern)
    return cell
}
function revealOthers(i, j) {
    i = Number(i)
    j = Number(j)
    const checkedTile = []
    if (MAP[i][j].numBomb === 0) {
        //cek tetangganya
        //atas
        if (i > 0) {
            if (MAP[i - 1][j].numBomb !==-1 ) {
                cell = getCell(i - 1,j)
                if(!cell.classList.contains("open")){
                    cell.innerHTML = MAP[i-1][j].numBomb
                    revealed++
                    checkedTile.push([i-1,j])
                    cell.classList.add("open")
                    cell.classList.add("revealed")
                }
            }
            //kanan atas
            if (j < size - 1 &&  MAP[i - 1][j + 1].numBomb !== -1) {
                cell = getCell(i - 1,j+1)
                if(!cell.classList.contains("open")){
                    cell.innerHTML = MAP[i-1][j+1].numBomb
                    revealed++
                    checkedTile.push([i-1,j+1])
                    cell.classList.add("open")
                    cell.classList.add("revealed")
                }
            }
        }
        //bawah
        if (i < size - 1) {
            if (MAP[i+1][j].numBomb !==-1) {
                cell = getCell(i + 1,j)
                if(!cell.classList.contains("open")){
                    cell.innerHTML = MAP[i+1][j].numBomb
                    revealed++
                    checkedTile.push([i+1,j])
                    cell.classList.add("open")
                    cell.classList.add("revealed")
                }
            }
            //kanan bawah
            if (j < size - 1 && MAP[i + 1][j + 1].numBomb !== -1) {
                cell = getCell(i + 1,j+1)
                if(!cell.classList.contains("open")){
                    cell.innerHTML = MAP[i+1][j+1].numBomb
                    revealed++
                    checkedTile.push([i+1,j+1])
                    cell.classList.add("open")
                    cell.classList.add("revealed")
                }
            }
        }
        //kanan
        if (j < size - 1 && MAP[i][j + 1].numBomb !== -1) {
            cell = getCell(i ,j+1)
            if(!cell.classList.contains("open")){
                cell.innerHTML = MAP[i][j+1].numBomb
                revealed++
                checkedTile.push([i,j+1])
                cell.classList.add("open")
                cell.classList.add("revealed")
            }
        }
        //kiri
        if (j > 0) {
            if ( MAP[i][j - 1].numBomb !== -1) {
                cell = getCell(i ,j-1)
                if(!cell.classList.contains("open")){
                    cell.innerHTML = MAP[i][j-1].numBomb
                    revealed++
                    checkedTile.push([i,j-1])
                    cell.classList.add("open")
                    cell.classList.add("revealed")
                }
            }
            //kiri atas
            if (i > 0 && MAP[i - 1][j - 1].numBomb !== -1) {
                cell = getCell(i-1 ,j-1)
                if(!cell.classList.contains("open")){
                    cell.innerHTML = MAP[i-1][j-1].numBomb
                    revealed++
                    checkedTile.push([i-1,j-1])
                    cell.classList.add("open")
                    cell.classList.add("revealed")
                }
            }
            //kiri bawah
            if (i < size - 1 && MAP[i + 1][j - 1].numBomb !== -1) {
                cell = getCell(i+1 ,j-1)
                if(!cell.classList.contains("open")){
                    cell.innerHTML = MAP[i+1][j-1].numBomb
                    revealed++
                    checkedTile.push([i+1,j-1])
                    cell.classList.add("open")
                    cell.classList.add("revealed")
                }
            }
        }
        checkedTile.forEach((e)=>{
            revealOthers(e[0],e[1])
        })
    }
}

function win() {
    return revealed === (MAP.length * MAP.length)
}
function setFlag(cell) {
    cell_id = cell.id
    i_index = cell_id[0]
    j_index = cell_id[1]
    if (cell.classList.contains("flag")) {
        cell.classList.remove("flag")
        cell.innerHTML = ''
        document.querySelector("#flagText").innerHTML = ++bomb;
    }
    else {
        cell.classList.add("flag")
        cell.innerHTML = '<img src="image/flag.jpg" draggable="false" ondragstart="return false">'
        document.querySelector("#flagText").innerHTML = --bomb;
    }
}

function gameover() {
    alert("Kau kalah!")
    finish = true
    splashDiv.innerHTML = `
        <h1>Skor Akhir: ${score}</h1>
        <h1>Waktu Bermain: ${time}</h1>
        <button onclick="restart()" id="restartButton">Mainkan Ulang</button>
    `
    inputSegment.innerHTML = ''
}

function restart() {
    location.reload()
}

function validateBomb(input) {
    input.value = Number(input.value)
    input.value = Math.round(input.value)
    if (input.value <= 0) {
        input.value = 0
    }
    inputTile = document.querySelector("#sizeInput")
    tileSize = Math.round(inputTile.value * inputTile.value) - 1
    if (input.value > tileSize) {
        input.value = tileSize;
    }
}

function validateTile(input) {
    input.value = Number(input.value)
    input.value = Math.round(input.value)
    if (input.value <= 1) {
        input.value = 1
    }
    if (input.value > MAX_TILESIZE) {
        input.value = MAX_TILESIZE
    }
    //cek sebelah
    bombSize = document.querySelector("#bombCount").value
    if (bombSize > ((input.value * input.value) - 1)) {
        document.querySelector("#bombCount").value = (input.value * input.value) - 1
    }
}