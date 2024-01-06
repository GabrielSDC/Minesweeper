var easy = {
    height: 8,
    width: 10,
    totalMines: 10,
    sizeCell: 30,
    sizeFont: 20
};

var normal = {
    height: 14,
    width: 18,
    totalMines: 40,
    sizeCell: 24,
    sizeFont: 17
};

var hard = {
    height: 20,
    width: 24,
    totalMines: 99,
    sizeCell: 20,
    sizeFont: 14
};

var gamemode;
var emptyCells;
// var rightclick;


start();

function start() {
    var select = document.getElementById("select-gamemode");
    var option = select.options[select.selectedIndex].value;

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
    // solve();
}

function generateField() {
    var field = document.getElementById("field");
    var counter = document.getElementById("counter");
    var lines = "";

    for(var i = 0; i < gamemode.height; i++) {
        lines += "<div class='line'>";
        for(var j = 0; j < gamemode.width; j++) {
            lines += "<button id='"+j+","+i+"' onclick='pressCell("+j+","+i+")' value='0' title='none' class='cell' style='width:"+gamemode.sizeCell+"px;height:"+gamemode.sizeCell+"px;font-size:"+gamemode.sizeFont+"px;'>";
        }
        lines += "</div>";
    }

    field.innerHTML = lines;
    counter.innerHTML = gamemode.totalMines;
    generateMines();
}

function generateMines() {
    var i = 0;
    
    while(i < gamemode.totalMines) {
        const x = parseInt(Math.random() * gamemode.width);
        const y = parseInt(Math.random() * gamemode.height);
        const idCell = x + "," + y;
        const cell = document.getElementById(idCell);
        // console.log(idCell);

        if(cell.value != "mine") {
            cell.value = "mine";
            numAround(x, y);
            i++;
        }
    }
}

//determines the number of mines around each cell
function numAround(x, y) {
    for(var i = Math.max(0, y - 1); i <= Math.min(gamemode.height - 1, y + 1); i++) {
        for(var j = Math.max(0, x - 1); j <= Math.min(gamemode.width - 1, x + 1); j++) {
            if(i === y && j === x) continue;

            // console.log(x + "," + y + " -> " + j + "," + i);
            const sideCell = document.getElementById(j + "," + i);
            if(sideCell.value != "mine")
                sideCell.value = parseInt(sideCell.value) + 1;
        }
    }
}


function pressCell(x, y) {
    var idCell = x + "," + y;
    var pressedCell = document.getElementById(idCell);
    var color;

    if(pressedCell.value == "mine")
        finish("lose");
    else if(pressedCell.title == "pressed")
        checkFlags(x, y);
    else if(pressedCell.title == "none") {
        color = findColor(pressedCell.value);
        console.log(pressedCell.value);

        pressedCell.classList.replace("cell", "pressed");

        if(pressedCell.value > 0)
            pressedCell.innerHTML = "<p style='color:" + color + ";'>" + pressedCell.value + "</p>"; 
        
        pressedCell.title = "pressed";
        emptyCells--;

        if(emptyCells == 0)
            finish("win");

        if(pressedCell.value == "0")
            cleanAround(x, y);
    }
}

function finish(end) {
    console.log("bye bitch");
    var newClass = "";

    if(end == "lose") {
        newClass = "mined";
    }
    else {
        newClass = "flagged";
        alert("You win!");
    }

    for(var i = 0; i < gamemode.height; i++) {
        for(var j = 0; j < gamemode.width; j++) {
            showmine(i, j, newClass);
        }
    }
}

function showmine(i, j, newClass) {
    var cell = document.getElementById(j + "," + i);

    if(cell.value == "mine") {
        cell.classList.replace("cell", newClass);
    }
    cell.onmousedown = start;
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
    for(var i = Math.max(0, y - 1); i <= Math.min(gamemode.height - 1, y + 1); i++) {
        for(var j = Math.max(0, x - 1); j <= Math.min(gamemode.width - 1, x + 1); j++) {
            const sideCell = document.getElementById(j + "," + i);
            if(sideCell.title == "none")
                pressCell(j, i);
        }
    }
}

//solve the game
function solve() {
    var cell;

    for(var i = 0; i < gamemode.height; i++) {
        for(var j = 0; j < gamemode.width; j++) {
            cell = document.getElementById(j+","+i);
            if(cell.value != "mine")
                pressCell(j, i);
        }
    }
}

//checks if 
function checkFlags(x, y) {
    var centerCell = document.getElementById(x+","+y);
    var sideCell;
    var flagsAround = 0;

    for(var i = Math.max(0, y - 1); i <= Math.min(gamemode.height - 1, y + 1); i++) {
        for(var j = Math.max(0, x - 1); j <= Math.min(gamemode.width - 1, x + 1); j++) {
            sideCell = document.getElementById(j + "," + i);
            if(sideCell.title == "flagged")
                flagsAround++;
        }
    }

    if(parseInt(centerCell.value) == flagsAround)
        cleanAround(x, y);
}

document.getElementById("field").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    
    const cell = document.getElementById(e.target.id);
    console.log(cell.title);
    
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
    console.log(cell.className);
});