window.onload = () => {
    const field = document.getElementById("field");
    const counter = document.getElementById("counter"); 
    field.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        
        const cell = game.cells[parseInt(e.target.value)];
        
        if(cell.state === "pressed")
            return;
    
        if(cell.state === "none") {
            cell.state = "flagged";
            counter.innerHTML--;
        }
        else {
            cell.state = "none";
            counter.innerHTML++;
        }
        
        const cellElement = document.getElementById(e.target.id);
        cellElement.disabled = !cellElement.disabled;
        cellElement.classList.toggle("flagged");
    });

    console.log(window);
    setupGame();
};

const dificulty = [
    { height:  8, width: 10, totalMines: 10 },
    { height: 14, width: 18, totalMines: 40 },
    { height: 14, width: 32, totalMines: 99 }
];

let game;

function setupGame() {
    document.getElementById("start-button").innerHTML = "start";

    const select = document.getElementById("select-gamemode");
    game = new Field(dificulty[select.selectedIndex]);
    game.state = "playing";
    
    const camp = document.getElementById("field");
    const counter = document.getElementById("counter");
    let lines = "";

    // generate the html elements of the field
    for(let i = 0; i < game.height; i++) {
        lines += "<div class='line'>";
        for(let j = 0; j < game.width; j++) {
            const id = j+","+i;
            const val = i * game.width + j;
            lines += `<button id='${id}' onclick='pressCell(${id})' value='${val}' class='cell'>`;
        }
        lines += "</div>";
    }

    camp.innerHTML = lines;
    counter.innerHTML = game.totalMines;
}

function pressCell(x, y) {
    if(game.state === "finished")
        return;

    const pressedCell = game.getCell(y, x);
    
    if(game.isCellMined(y, x)) {
        finish("lose");
    }
    else if(pressedCell.state === "pressed") {
        checkFlags(pressedCell);
    }
    else if(pressedCell.state === "none") {
        const idCell = x + "," + y;
        const pressedElement = document.getElementById(idCell);

        pressedElement.classList.replace("cell", "pressed"); 
        pressedElement.innerHTML = `<img src="../assets/img/${pressedCell.minesAround}.png">`; 
        
        pressedCell.state = "pressed";
        game.emptyCells--;

        if(game.emptyCells == 0)
            finish("win");

        if(pressedCell.minesAround === 0)
            cleanAround(pressedCell);
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

    for(let i = 0; i < game.mines.length; i++) {
        showMines(game.mines[i].x, game.mines[i].y, newClass);
    }
    
    game.state = "finished";
    document.getElementById("start-button").innerHTML = "restart";
}

function showMines(j, i, newClass) {
    const cellElement = document.getElementById(j + "," + i);

    if(game.isCellMined(i, j)) {
        cellElement.classList.replace("cell", newClass);
    }
    cellElement.onmousedown = setupGame;
}

const colors = ["#E5E8E8", "#2874A6", "#239B56",
                "#B03A2E", "#6C3483", "#F1C40F", 
                "#3498DB", "#1C2833", "#641E16"]

function findColor(num) {
    const i = parseInt(num);
    return (i < 0 || i > 8) ? undefined : colors[i];
}

// press all the adjecent blank cells
function cleanAround(cell) {
    for(let i = 0; i < cell.edges.length; i++) {
        if(cell.edges[i] && cell.edges[i].state === "none") {
            pressCell(cell.edges[i].x, cell.edges[i].y);
        }
    }
}

function checkFlags(cell) {
    let flags = 0;

    for(let i = 0; i < cell.edges.length; i++) {
        if(cell.edges[i] && cell.edges[i].state === "flagged")
            flags++;
    }

    if(cell.minesAround === flags)
        cleanAround(cell);
}