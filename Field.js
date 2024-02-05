class Field {
    constructor(info) {
        this.width = info.width;
        this.height = info.height;
        this.emptyCells = info.height * info.width - info.totalMines;
        this.cells = new Array(info.widt * info.height).fill(new Cell());

        for(let i = 0; i < info.height; i++) {
            for(let j = 0; j < info.width; j++) {
                const currentCell = this.cells[i * info.width + j];
                currentCell.addEdges(this, j, i, info.width);
            }
        }

        for(let i = 0; i < info.totalMines;) {
            const x = Math.random() * info.width;
            const y = Math.random() * info.height;

            const cell = this.cells[y * info.width + x];
            if(cell.isMined) continue;
            
            cell.isMined = true;
            for(let edge in cell.edges) {
                if(edge) edge.minesAround++;
            }
            i++;
        }
    }

    isCellMined(i, j) {
        return this.cells[i * this.width + j].isMined || false;
    }
}