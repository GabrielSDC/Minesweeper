function getAllCells(num) {
    let cells = [];
    for(let i = 0; i < num; i++) {
        cells[i] = new Cell();
    }
    return cells;
}

class Field {
    constructor(info) {
        this.width = info.width;
        this.height = info.height;
        this.totalMines = info.totalMines;
        this.emptyCells = info.height * info.width - info.totalMines;
        this.cells = getAllCells(info.height * info.width);
        this.mines = [];

        // connect all to cells their neighboors
        for(let i = 0; i < info.height; i++) {
            for(let j = 0; j < info.width; j++) {
                let currentCell = this.cells[i * info.width + j];
                // console.log("Começa aqui: ", j, i);
                currentCell.addEdges(this, j, i, info.width, info.hieght);
            }
        }

        // find the position of the mines
        for(let i = 0; i < info.totalMines;) {
            const x = parseInt(Math.random() * info.width);
            const y = parseInt(Math.random() * info.height);
            
            // console.log(x, y);
            let cell = this.cells[y * info.width + x];
            if(cell.isMined) continue;
            
            cell.isMined = true; 
            for(let i = 0; i < cell.edges.length; i++) {
                // console.log(cell.edges[i].x, edge.y, edge.minesAround);
                cell.edges[i].minesAround++;
            }
            this.mines.push(cell);
            i++;
        }
    }

    isCellMined(i, j) {
        return this.cells[i * this.width + j].isMined || false;
    }

    getCell(i, j) {
        return this.cells[i * this.width + j];
    }
}