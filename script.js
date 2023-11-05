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
    var cell;

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
    var x, y; 
    var cell, idCell;
    var i = 0;
    
    while(i < gamemode.totalMines) {
        x = parseInt(Math.random() * gamemode.width);
        y = parseInt(Math.random() * gamemode.height);
        idCell = x + "," + y;
        cell = document.getElementById(idCell);
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
    var sideCell;

    for(var i = y - 1; i <= y + 1; i++) {
        for(var j = x - 1; j <= x + 1; j++) {
            if(j >= 0 && j < gamemode.width && i >= 0 && i < gamemode.height) {
                sideCell = document.getElementById(j + "," + i);
                if(sideCell.value != "mine")
                    sideCell.value = parseInt(sideCell.value) + 1;
            }
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

function findColor(num) {
    var color;

    switch(num) {
        case "0":
            color = "#E5E8E8";
            break;
        case "1":
            color = "#2874A6";
            break;
        case "2":
            color = "#239B56";
            break;
        case "3":
            color = "#B03A2E";
            break;
        case "4":
            color = "#6C3483";
            break;
        case "5":
            color = "#F1C40F";
            break;
        case "6":
            color = "#3498DB";
            break;
        case "7":
            color = "#1C2833";
            break;
        case "8":
            color = "#641E16";
            break;
        default:
            finish("lose");
    }
    return color;
}

//clean all the adjecent blank cells
function cleanAround(x, y) {
    var sideCell;

    for(var i = y - 1; i <= y + 1; i++) {
        for(var j = x - 1; j <= x + 1; j++) {
            if(j >= 0 && j < gamemode.width && i >= 0 && i < gamemode.height) {
                sideCell = document.getElementById(j + "," + i);
                if(sideCell.title != "pressed" && sideCell.title != "flagged")
                    pressCell(j, i);
            }
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

    for(var i = y - 1; i <= y + 1; i++) {
        for(var j = x - 1; j <= x + 1; j++) {
            if(j >= 0 && j < gamemode.width && i >= 0 && i < gamemode.height) {
                sideCell = document.getElementById(j + "," + i);
                if(sideCell.title == "flagged")
                    flagsAround++;
            }
        }
    }

    if(parseInt(centerCell.value) == flagsAround)
        cleanAround(x, y);
}

document.getElementById("field").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    cell = document.getElementById(e.target.id);
    console.log(cell.title);
    
    if(cell.title != "pressed"){
        if(cell.title == "none") {
            cell.title = "flagged";
            counter.innerHTML--;
            cell.disabled = true;
        }
        else if(cell.title == "flagged") {
            cell.title = "none";
            counter.innerHTML++;
            cell.disabled = false;
        }

        cell.classList.toggle("flagged");
        console.log(cell.className);
    }
});