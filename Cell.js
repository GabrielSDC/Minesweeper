class Cell {
    constructor() {
        this.minesAround = 0;
        this.isMined = false;
        this.state = "none";
        this.edges = [];
    }

    addEdges(field, x, y, w, h) {
        for(let i = y - 1; i <= y + 1; i++) {
            for(let j = x - 1; j <= x + 1; j++) {
                if(i === y && j === x || i < 0 || j < 0 || i >= h || j >= w) continue;
                
                let newEdge = field.getCell(i, j);
                if(newEdge) this.edges.push(newEdge);
            }
        }
        this.x = x;
        this.y = y;
    }
}