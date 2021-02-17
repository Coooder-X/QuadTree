import QuadTree from "./QuadTree.js"
export default class ManyBody {
    constructor(w, h) {
        this.nodes = [];
        this.datas = [];
        this.edges = [];
        this.quadTree = new QuadTree(w, h);
    }
}