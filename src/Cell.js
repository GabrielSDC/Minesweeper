class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.minesAround = 0;
        this.isMined = false;
        this.state = "none";
        this.edges = [];
    }
    
    addEdges(field, x, y, w, h) {
        for(let i = y - 1; i <= y + 1; i++) {
            for(let j = x - 1; j <= x + 1; j++) {
                if(i === y && j === x) 
                    continue;
                const newEdge = field.getCell(i, j);
                if(newEdge) this.edges.push(newEdge);
            }
        }
    }
}