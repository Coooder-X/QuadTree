import QuadTree from "./QuadTree.js"
export default class ManyBody {
    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.nodes = [];
        this.datas = [];
        this.edges = [];
        this.quadTree = new QuadTree(w, h);
    }
    //  根据初始化node数据，建树
    buildTree() {
        this.quadTree.build(this.nodes, this.datas);
    }
    //  更新所有node的合力
    forceOnBodies() {
        for(let i = 0; i < this.nodes.length; ++i) {
            let tarNode = this.quadTree.map.get(this.datas[i].name);
            let force = this.getForceOnBody(tarNode);
            //.....
        }
    }
    //  获得单个node的合力
    getForceOnBody(tarNode) {
        let ans = {vx: 0, vy: 0};
        this.quadTree.force(this.quadTree.root, tarNode, ans);
        ans.vx *= 2000, ans.vy *= 2000;
        this.paintForce(this.ctx, tarNode, ans);
        return ans;
    }

    paintForce(ctx, node, force) {
        ctx.beginPath();
        ctx.moveTo (node.dataX, node.dataY);       //设置起点状态
        ctx.lineTo (node.dataX + force.vx, node.dataY + force.vy);       //设置末端状态
        ctx.lineWidth = 1;          //设置线宽状态
        ctx.strokeStyle = "#0080FF" ;  //设置线的颜色状态
        ctx.stroke();  
        ctx.closePath();
    }

}