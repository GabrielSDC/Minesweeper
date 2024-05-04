function getAllCells(height, width) {
    let cells = [];
    for(let i = 0; i < height; i++)
        for(let j = 0; j < width; j++)
            cells[i * width + j] = new Cell(j, i);
    return cells;
}

class Field {
    constructor(info) {
        this.width = info.width;
        this.height = info.height;
        this.totalMines = info.totalMines;
        this.state = "none";

        this.emptyCells = info.height * info.width - info.totalMines;
        this.cells = getAllCells(info.height, info.width);
        this.mines = [];

        // connect all cells to their neighboors
        for(let i = 0; i < info.height; i++) {
            for(let j = 0; j < info.width; j++) {
                let currentCell = this.cells[i * info.width + j];
                currentCell.addEdges(this, j, i, info.width, info.height);
            }
        }

        // find the position of the mines
        for(let i = 0; i < info.totalMines;) {
            const x = parseInt(Math.random() * info.width);
            const y = parseInt(Math.random() * info.height);
            
            let cell = this.cells[y * info.width + x];
            if(cell.isMined) continue;
            
            cell.isMined = true;
            cell.minesAround = 9;
            for(let i = 0; i < cell.edges.length; i++) {
                cell.edges[i].minesAround++;
            }
            this.mines.push(cell);
            i++;
        }
    }

    isCellMined(i, j) {
        if(i < 0 || i >= this.height || j < 0 || j >= this.width)
            return false;
        return this.cells[i * this.width + j].isMined || false;
    }

    getCell(i, j) {
        if(i < 0 || i >= this.height || j < 0 || j >= this.width)
            return undefined;
        return this.cells[i * this.width + j];
    }
}