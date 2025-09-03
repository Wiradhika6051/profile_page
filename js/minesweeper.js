//Constant
const HOLD_DELAY = 300
const MAX_TILESIZE = 40


class Minesweeper {
    constructor(size, bombCount) {
        if(bombCount > (size * size -1)){
            bombCount = size * size -1
        }
        this.size = size;
        this.bombCount = bombCount;
        this.map = [];
        this.availableTiles = [];
        this.revealed = 0;
        this.flagsLeft = bombCount;
        this.score = 0;
        this.time = 0;
        this.isFinished = false;
        this.timerId = null;

        // Handle mobile
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        this.gameDiv = document.querySelector("#game");
        this.splashDiv = document.querySelector("#splash");
        this.inputSegment = document.querySelector("#inputSegment");
    }

    // ===== GAME INIT =====
    start() {
        this.initMap();
        this.placeBombs();
        this.renderBoard();
        this.startTimer();
    }
    initMap() {
        this.map = Array.from({ length: this.size }, (_, i) =>
            Array.from({ length: this.size }, (_, j) => {
                this.availableTiles.push([i, j]);
                return { numBomb: 0, timestamp: -1 };
            })
        );
    }
    //membuat peta dimana saja bom berada
    placeBombs() {
        for (let b = 0; b < this.bombCount; b++) {
            const idx = Math.floor(Math.random() * this.availableTiles.length);
            const [i, j] = this.availableTiles.splice(idx, 1)[0];
            this.map[i][j].numBomb = -1; //-1 berarti ada bomb
            this.updateNeighbors(i, j);
        }
    }

    updateNeighbors(i, j) {
        const directions = [
            [-1, 0], [1, 0], [0, 1], [0, -1],
            [-1, 1], [-1, -1], [1, 1], [1, -1]
        ];
        for (const [di, dj] of directions) {
            const ni = i + di, nj = j + dj;
            if (this.inBounds(ni, nj) && this.map[ni][nj].numBomb >= 0) {
                this.map[ni][nj].numBomb++;
            }
        }
    }

    inBounds(i, j) {
        return i >= 0 && j >= 0 && i < this.size && j < this.size;
    }
    // ===== UI =====
    renderBoard() {
        let html = '<table cellspacing="0">';
        for (let i = 0; i < this.size; i++) {
            html += '<tr>';
            for (let j = 0; j < this.size; j++) {
                html += `<td id="cell-${i}-${j}"></td>`;
            }
            html += '</tr>';
        }
        html += '</table>';
        this.gameDiv.innerHTML = html;

        this.renderTopBar();
        this.addEventListeners();
    }

    renderTopBar() {
        this.inputSegment.innerHTML = `
            <div id="topbar">
                <div class="container">
                    <img src="image/timer.png" class="icon-top">
                    <p id="timeText" class="top-text">${this.time}</p>
                </div>
                <button id="restartButton">Mulai Ulang</button>
                <div class="container">
                    <img src="image/remaining-flag.jpg" class="icon-top">
                    <p id="flagText" class="top-text">${this.flagsLeft}</p>
                </div>
            </div>
        `;
        document.querySelector("#restartButton").addEventListener("click", () => this.restart());
    }

    addEventListeners() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = this.getCell(i, j);
                if (this.isTouch){
                    // Mobile devices, use hold logic
                    cell.addEventListener("touchstart", () => {
                        this.map[i][j].timestamp = new Date();
                    }); // mulai tekan
                    cell.addEventListener("touchend", () => this.handleTouch(i, j, cell)); // lepas tekan
                }else{
                    // Dekstop device, use normal click
                    cell.addEventListener("click",()=>{
                        if(this.isFinished)return
                        this.reveal(i, j, cell)
                        this.checkWin();
                    }) //left click
                    cell.addEventListener("contextmenu",(e)=>{
                        if(this.isFinished)return
                        e.preventDefault() //prevent browser context menu
                        this.toggleFlag(cell);
                        this.checkWin();
                    }) // right click
                }

            }
        }
    }

    startTimer() {
        this.timerId = setInterval(() => {
            if (this.isFinished) return;
            this.time++;
            const timeText = document.querySelector("#timeText");
            if (timeText) timeText.textContent = this.time;
        }, 1000);
    }

    // ===== GAMEPLAY =====
    handleTouch(i, j, cell) {
        if (this.isFinished || cell.classList.contains("revealed")) return;

        const held = new Date() - this.map[i][j].timestamp > HOLD_DELAY;
        //nge hold lebih dari 1 detik set flag
        if (held) {
            this.toggleFlag(cell); // long press -> set flag
        } else {
            this.reveal(i, j, cell); // short press -> open tile
        }
        this.checkWin();
    }

    toggleFlag( cell) {
        if (cell.classList.contains("flag")) {
            cell.classList.remove("flag");
            cell.innerHTML = "";
            this.flagsLeft++;
        } else {
            if (this.flagsLeft <= 0) return;
            cell.classList.add("flag");
            cell.innerHTML = '<img src="image/flag.jpg"  draggable="false" ondragstart="return false">';
            this.flagsLeft--;
        }
        document.querySelector("#flagText").textContent = this.flagsLeft;
    }

    reveal(i, j, cell) {
        const tile = this.map[i][j];
        //lagi di flag jangan di tendang
        if (cell.classList.contains("revealed") || cell.classList.contains("flag") || tile.numBomb === undefined) return;

        if (tile.numBomb === -1) {
            cell.innerHTML = '<img class="bomb" src="image/bomb.jpg" draggable="false" ondragstart="return false">';
            this.gameOver();
            return;
        }

        this.showCell(i, j, cell);

        if (tile.numBomb === 0) {
            this.revealNeighbors(i, j);
        }
    }

    showCell(i, j, cell) {
        const tile = this.map[i][j];
        if (cell.classList.contains("revealed")) return;

        cell.textContent = tile.numBomb || "";
        cell.classList.add("revealed", "open");
        this.revealed++;
        this.score++;
    }
    revealNeighbors(i, j) {
        const directions = [
            [-1, 0], [1, 0], [0, 1], [0, -1],
            [-1, 1], [-1, -1], [1, 1], [1, -1]
        ];
        for (const [di, dj] of directions) {
            const ni = i + di, nj = j + dj;
            if (this.inBounds(ni, nj)) {
                const cell = this.getCell(ni, nj);
                this.reveal(ni, nj, cell);
            }
        }
    }

    // ===== END GAME =====
    checkWin() {
        const totalTiles = this.size * this.size;
        if (this.revealed === totalTiles - this.bombCount) {
            this.isFinished = true;
            clearInterval(this.timerId);
            alert("Anda menang!");
            this.showResult();
        }
    }

    gameOver() {
        this.isFinished = true;
        clearInterval(this.timerId);
        alert("Kau kalah!");
        this.showResult();
    }

    showResult() {
        this.splashDiv.innerHTML = `
            <h1>Skor Akhir: ${this.score}</h1>
            <h1>Waktu Bermain: ${this.time}</h1>
            <button onclick="location.reload()">Mainkan Ulang</button>
        `;
        this.inputSegment.innerHTML = "";
    }

    restart() {
        location.reload();
    }

    // ===== HELPERS =====
    getCell(i, j) {
        return document.getElementById(`cell-${i}-${j}`);
    }
}
// Start game
function startGame() {
    const size = Number(document.querySelector("#sizeInput").value);
    const bombCount = Number(document.querySelector("#bombCount").value);

    if (size < 1 || size > MAX_TILESIZE) return;
    if (bombCount < 0 || bombCount >= size * size) return;

    const game = new Minesweeper(size, bombCount);
    game.start();
}


// Validation
function validateBomb(input) {
    input.value = Math.max(0,Math.round(Number(input.value)))
    const size =  Number(document.querySelector("#sizeInput").value) || 1
    const maxBombs = size * size - 1
    if (input.value > maxBombs) {
        input.value = maxBombs;
    }
}

function validateTile(input) {
    input.value = Math.min(MAX_TILESIZE, Math.max(1, Math.round(input.value)))
    //cek sebelah
    const bombInput = document.querySelector("#bombCount");
    const maxBombs = input.value * input.value - 1;
    if (bombInput.value > maxBombs){
        bombInput.value = maxBombs;
    } 
}