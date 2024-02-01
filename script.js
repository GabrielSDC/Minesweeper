let easy = {
    height: 8,
    width: 10,
    totalMines: 10
};

let normal = {
    height: 14,
    width: 18,
    totalMines: 40
};

let hard = {
    height: 14,
    width: 32,
    totalMines: 99
};

let gamemode = normal;

let emptyCells;

window.onload = () => {
    document.getElementById("field").addEventListener("contextmenu", (e) => {
        e.preventDefault();
        
        const cell = document.getElementById(e.target.id);
        
        if(cell.title == "pressed")
            return;
    
        if(cell.title == "none") {
            cell.title = "flagged";
            counter.innerHTML--;
        }
        else {
            cell.title = "none";
            counter.innerHTML++;
        }
    
        cell.disabled = !cell.disabled;
        cell.classList.toggle("flagged");
    });

    setupGame();
};

function setupGame() {
    const select = document.getElementById("select-gamemode");
    const option = select.options[select.selectedIndex].value;

    switch(option) {
        case "easy":
            gamemode = easy;
            break;
        case "normal":
            gamemode = normal;
            break;
        case "hard":
            gamemode = hard;
            break;
    }

    emptyCells = gamemode.height * gamemode.width - gamemode.totalMines;
    generateField();
}

function generateField() {
    const field = document.getElementById("field");
    const counter = document.getElementById("counter");
    let lines = "";

    for(let i = 0; i < gamemode.height; i++) {
        lines += "<div class='line'>";
        for(let j = 0; j < gamemode.width; j++) {
            const id = j+","+i;
            lines += `<button id='${id}' onclick='pressCell(${id})' value='0' title='none' class='cell'>`;
        }
        lines += "</div>";
    }

    field.innerHTML = lines;
    counter.innerHTML = gamemode.totalMines;
    generateMines();
}

function generateMines() {
    let i = 0;
    
    while(i < gamemode.totalMines) {
        const x = parseInt(Math.random() * gamemode.width);
        const y = parseInt(Math.random() * gamemode.height);
        const idCell = x + "," + y;
        const cell = document.getElementById(idCell);

        if(cell.value != "mine") {
            cell.value = "mine";
            numAround(x, y);
            i++;
        }
    }
}

function numAround(x, y) {
    for(let i = Math.max(0, y - 1); i <= Math.min(gamemode.height - 1, y + 1); i++) {
        for(let j = Math.max(0, x - 1); j <= Math.min(gamemode.width - 1, x + 1); j++) {
            if(i === y && j === x) continue;

            const sideCell = document.getElementById(j + "," + i);
            if(sideCell.value == "mine") continue;

            sideCell.value = parseInt(sideCell.value) + 1;
        }
    }
}

function pressCell(x, y) {
    const idCell = x + "," + y;
    const pressedCell = document.getElementById(idCell);

    if(pressedCell.value == "mine")
        finish("lose");
    else if(pressedCell.title == "pressed")
        checkFlags(x, y);
    else if(pressedCell.title == "none") {
        const color = findColor(pressedCell.value);
        console.log(pressedCell.value);

        pressedCell.classList.replace("cell", "pressed");

        if(pressedCell.value > 0)
            pressedCell.innerHTML = `<p style='color:${color};'>${pressedCell.value}</p>`; 
        
        pressedCell.title = "pressed";
        emptyCells--;

        if(emptyCells == 0)
            finish("win");

        if(pressedCell.value == "0")
            cleanAround(x, y);
    }
}

function finish(end) {
    let newClass;
    if(end == "lose") {
        newClass = "mined";
    }
    else {
        newClass = "flagged";
        alert("You win!");
    }

    for(let i = 0; i < gamemode.height; i++) {
        for(let j = 0; j < gamemode.width; j++) {
            showMines(i, j, newClass);
        }
    }
}

function showMines(i, j, newClass) {
    const cell = document.getElementById(j + "," + i);

    if(cell.value == "mine") {
        cell.classList.replace("cell", newClass);
    }
    cell.onmousedown = setupGame;
}

const colors = ["#E5E8E8", "#2874A6", "#239B56",
                "#B03A2E", "#6C3483", "#F1C40F", 
                "#3498DB", "#1C2833", "#641E16"]

function findColor(num) {
    const i = parseInt(num);

    if(i < 0 || i > 8)
        finish("lose");

    return colors[i];
}

//clean all the adjecent blank cells
function cleanAround(x, y) {
    for(let i = Math.max(0, y - 1); i <= Math.min(gamemode.height - 1, y + 1); i++) {
        for(let j = Math.max(0, x - 1); j <= Math.min(gamemode.width - 1, x + 1); j++) {
            const sideCell = document.getElementById(j + "," + i);
            if(sideCell.title == "none")
                pressCell(j, i);
        }
    }
}

//solve the game
function solve() {
    for(let i = 0; i < gamemode.height; i++) {
        for(let j = 0; j < gamemode.width; j++) {
            const cell = document.getElementById(j+","+i);
            if(cell.value != "mine")
                pressCell(j, i);
        }
    }
}

function checkFlags(x, y) {
    const centerCell = document.getElementById(x+","+y);
    let flagsAround = 0;

    for(let i = Math.max(0, y - 1); i <= Math.min(gamemode.height - 1, y + 1); i++) {
        for(let j = Math.max(0, x - 1); j <= Math.min(gamemode.width - 1, x + 1); j++) {
            const sideCell = document.getElementById(j + "," + i);
            if(sideCell.title == "flagged")
                flagsAround++;
        }
    }

    if(parseInt(centerCell.value) == flagsAround)
        cleanAround(x, y);
}