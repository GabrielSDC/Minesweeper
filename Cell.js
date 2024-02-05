class Cell {
    constructor() {
        this.minesAround = 0;
        this.isMined = false;
        this.state = "none";
        this.edges = [];
    }

    addEdges(field, x, y, width) {
        const curr = field.cells[y * width + x];
        for(let i = y - 1; i < y + 1; i++) {
            for(let j = x - 1; j < x + 1; j++) {
                if(i === y && j === x) continue;
                const newEdge = field.cells[i * width + j]
                curr.edges.append(newEdge);
            }
        }
    }

    isMined(cells, i, j) {
        return cells[ij].isMined || false;
    }
}