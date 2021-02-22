import TreeNode from "./TreeNode.js";
export default class QuadTree {
    constructor(w, h) {
        this.root = new TreeNode(0, 0, w, h);
        this.root.centerX = this.root.centerY = 0;
        this.root.total = 0;
        this.size = 0;
        this.width = w || 1000; //  总显示区域的长宽
        this.height = h || 600;
        this.map = new Map();
        this.theta = 0.5;
        this.G = 30;//0.0;
    }

    build(nodes, datas) {
        for(let i = 0; i < nodes.length; ++i) {
            this.add(this.root, nodes[i], datas[i]);
        }
    }

    add(root, node, data) {   //  node {x: "", y: ""}   data {name: "", E: ""}
        if(root == null)
            return;
        let size = {w: root.width / 2, h: root.height / 2};
        if(root === this.root && this.size == 0) { //  quadtree根的情况特判
            //  如果是根，直接创建node
            let pos = root.calPos(node.x, node.y, size.w, size.h);
            //  更新数据node进入的新节点的center、数据、total
            root.child[pos.idx] = new TreeNode(pos.x, pos.y, size.w, size.h);
            root.child[pos.idx].setInfo(node.x, node.y, node.x, node.y, data.E, data);  
            //  update map
            this.map.set(data.name, root.child[pos.idx]);
            //  update current root
            root.centerX = node.x;
            root.centerY = node.y;
            root.total = data.E;
            this.size++;
            return;
        }

        if(root.isLeaf() && root != this.root) { //  root是叶子节点，则内部已包含一个数据k，则应重新划分区域，放入node和k
            let tmpNode = {x: root.dataX, y: root.dataY, data: root.data};   //  当前root包含的数据的坐标
            root.dataX = root.dataY = NaN, root.data = null;  //  清除当前root数据
            let pos = root.calPos(tmpNode.x, tmpNode.y, size.w, size.h);    //  判断原数据k应划分在那个象限
            root.child[pos.idx] = new TreeNode(pos.x, pos.y, size.w, size.h);
            root.child[pos.idx].setInfo(tmpNode.x, tmpNode.y, tmpNode.x, tmpNode.y, tmpNode.data.E, tmpNode.data);//  更新原数据k进入的新节点的center、数据、total、data
            //  update map
            this.map.set(tmpNode.data.name, root.child[pos.idx]);

            this.add(root, node, data);
            //  重新计算root的center和total
            root.total = tmpNode.data.E + data.E;
            this.updateCenter(root);
            return;
        }
        else {  //  非叶子节点，选择合适分支，递归进行插入node
            let pos = root.calPos(node.x, node.y, size.w, size.h);
            let rt = root.child[pos.idx];
            if(rt == null) {
                rt = root.child[pos.idx] = new TreeNode(pos.x, pos.y, size.w, size.h);
                rt.dataX = rt.centerX = node.x;    //  更新数据k进入的新节点的center、数据、total
                rt.dataY = rt.centerY = node.y;
                rt.total = data.E;
                rt.data = data;
                //  update map
                this.map.set(data.name, rt);
                this.size++;
                //  update current root
                root.total += data.E;
                this.updateCenter(root);
            }
            else {
                this.add(rt, node, data);
                root.total += data.E;
                this.updateCenter(root);
            }
        }
    }
    //  更新质心
    updateCenter(root) {
        let totalWeight = root.total, xx = 0, yy = 0;
        for(let i = 0; i < 4; ++i) {
            let son = root.child[i];
            if(son) {
                xx += son.centerX * son.total, yy += son.centerY * son.total;
            }
        }
        root.centerX = xx / totalWeight, root.centerY = yy / totalWeight;
    }

    force(root, node, ans) {
        if(root.isLeaf()) { //  对于叶节点，直接加入合力
            if(root !== node) {
                let F = this.chargeForce({dataX: root.dataX, dataY: root.dataY, data:{E: root.data.E}}, node);
                ans.vx += F.vx, ans.vy += F.vy;
            }
        }
        else {
            let s = root.width;
            let dx = node.dataX - root.centerX, dy = node.dataY - root.centerY;
            let d = Math.sqrt(dx * dx + dy * dy);
            if(s / d < this.theta) {    //  将该内部节点近似看成一个单独的物体
                let F = this.chargeForce({dataX: root.centerX, dataY: root.centerY, data:{E: root.total}}, node);
                ans.vx += F.vx, ans.vy += F.vy;
            }
            else {
                for(let i = 0; i < 4; ++i) {
                    if(root.child[i])
                        this.force(root.child[i], node, ans);
                }
            }
        }
    }

    chargeForce(src, tar) { //  src := {dataX: , dataY: }, tar := type of TreeNode
        let dx = tar.dataX - src.dataX, dy = tar.dataY - src.dataY;
        let dis = Math.sqrt(dx * dx + dy * dy);
        let F =  this.G * src.data.E * tar.data.E / (dis * dis);
        let sin = Math.abs(dy / dis), cos = Math.abs(dx / dis);
        let vx = F * cos / tar.data.E, vy = F * sin / tar.data.E;  //     此处可以数学化简，减少一次开方
        vx *= (dx > 0? 1 : -1);
        vy *= (dy > 0? 1 : -1);
        // console.log({vx: vx*1000, vy: vy*1000});
        return {vx: vx, vy: vy};
    }

    dfsPaint(ctx, root) {
        if(root.isLeaf() && root != this.root) {
            ctx.beginPath();
            ctx.arc(root.dataX, root.dataY, 3, 0, Math.PI*2, false);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.font="16px Georgia";
            ctx.fillText(root.data.name, root.dataX + 8, root.dataY - 8);
            ctx.closePath();
        }
        else {
            ctx.beginPath();
            ctx.arc(root.centerX, root.centerY, 3, 0, Math.PI*2, false);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo (root.areaX + root.width / 2, root.areaY);       //设置起点状态
            ctx.lineTo (root.areaX + root.width / 2, root.areaY + root.height);       //设置末端状态
            ctx.lineWidth = 2;          //设置线宽状态
            ctx.strokeStyle = "#E0E0E0" ;  //设置线的颜色状态
            ctx.moveTo (root.areaX, root.areaY + root.height / 2);       //设置起点状态
            ctx.lineTo (root.areaX + root.width, root.areaY + root.height / 2);       //设置末端状态
            ctx.stroke();               //进行绘制

            ctx.closePath();
        }
        for(let i = 0; i < root.child.length; ++i) {
            if(root.child[i] != null) {
                this.dfsPaint(ctx, root.child[i]);
            }
        }
    }

}
