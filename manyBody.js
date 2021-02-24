import QuadTree, {chargeForce} from "./QuadTree.js"
export default class ManyBody {
    constructor(ctx, w, h) {
        this.width = w, this.height = h;
        this.k = 0.08;  //  弹性劲度系数 (需要改为动态计算，适用于各种情况)
        // this.m = ;  //  每个节点的质量的倒数，仅在计算边的弹性力时起作用（避免）
        this.ctx = ctx;
        this.nodes = [];
        this.datas = [];
        this.edges = [];    //  {source: , target: , length:}
        this.quadTree = new QuadTree(w, h);
    }
    //  根据初始化node数据，建树
    buildTree() {
        this.quadTree = new QuadTree(this.width, this.height);
        this.quadTree.build(this.nodes, this.datas);
    }
    //  更新所有node的合力 / 执行力的作用
    step() {
        for(let i = 0; i < this.nodes.length; ++i) {
            let tarNode = this.quadTree.map.get(this.datas[i].name);
            let force = this.getForceOnBody(tarNode);
            //力对位置的作用
            this.nodes[i].x += force.vx, this.nodes[i].y += force.vy; 

            this.linkForce();
            // if(this.datas[i].name == 'C') {
            //     this.nodes[i].x = this.width/2, this.nodes[i].y = this.height/2; 
            //     continue;
            // }
            this.centering();
        }
    }
    //  获得单个node的合力
    getForceOnBody(tarNode) {
        let ans = {vx: 0, vy: 0};
        this.quadTree.force(this.quadTree.root, tarNode, ans);
        this.paintForce(this.ctx, tarNode, {vx: ans.vx*80, vy:ans.vy*80});
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

    linkForce() {   //  计算边的弹性力，并直接作用在节点上
        for(let i = 0; i < this.edges.length; ++i) {
            let src = this.nodes[this.edges[i].source], tar = this.nodes[this.edges[i].target];
            let dx = src.x - tar.x, dy = src.y - tar.y;
            let dis = Math.sqrt(dx * dx + dy * dy);
            let sin = Math.abs(dy / dis), cos = Math.abs(dx / dis);
            let F = this.k * Math.abs(dis - this.edges[i].length);
            let vx = F * cos, vy = F * sin;
            src.x += (dx > 0? -vx : vx);
            src.y += (dy > 0? -vy : vy);
            tar.x += (dx > 0? vx : -vx);
            tar.y += (dy > 0? vy : -vy);
            this.paintLink(src, tar);
        }
    }

    paintLink(src, tar) {
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo (src.x, src.y);       //设置起点状态
        ctx.lineTo (tar.x, tar.y);       //设置末端状态
        ctx.lineWidth = 0.5;          //设置线宽状态
        ctx.strokeStyle = "#DAB1D5" ;  //设置线的颜色状态
        ctx.stroke();  
        ctx.closePath();
    }

    addCenterForce(centerX = this.width / 2, centerY = this.height / 2) {
        let center = {x: centerX, y: centerY}, data = {name: "", E: -20}    //  此处的E要动态计算，使其大小合适
        this.quadTree.add(this.quadTree.root, center, data);
    }
    
    centerForce(centerX = this.width / 2, centerY = this.height / 2, E = 2000) {
        let center = {dataX: centerX, dataY: centerY, data: {name: "", E: E}};
        for(let i = 0; i < this.nodes.length; ++i) {
            let tarNode = this.quadTree.map.get(this.datas[i].name);
            return chargeForce(center, tarNode, this.quadTree.G);
            // let dx = tarNode.dataX - center.dataX, dy = tarNode.dataY - center.dataY;
            // let dis = Math.sqrt(dx * dx + dy * dy);
            // let F = Math.abs(this.quadTree.G * center.data.E * tarNode.data.E / (dis * dis + 0.000001)); //  避免除以0
            // let sin = Math.abs(dy / dis), cos = Math.abs(dx / dis);
            // let vx = F * cos / tarNode.data.E, vy = F * sin / tarNode.data.E;  //     此处可以数学化简，减少一次开方
            // vx *= (dx > 0? -1 : 1);
            // vy *= (dy > 0? -1 : 1);
            // return {vx: vx, vy: vy};
        }
    }
    /*
        迭代到一定程度时，将系统重心与屏幕中心重合显示
    */
    centering() {
        let dx = this.quadTree.root.centerX - this.width / 2, dy = this.quadTree.root.centerY - this.height / 2;
        for(let i = 0; i < this.nodes.length; ++i) {
            if(this.nodes[i].x - dx < 0 || this.nodes[i].y - dy < 0
                || this.nodes[i].x - dx > this.width || this.nodes[i].y - dy > this.height)
                return;
        }
        for(let i = 0; i < this.nodes.length; ++i) {
            this.nodes[i].x -= dx * 0.05, this.nodes[i].y -= dy * 0.05;
        }
    }

}