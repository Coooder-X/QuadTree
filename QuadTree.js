// import TreeNode from "TreeNode.js";
class QuadTree {
    constructor(w, h) {
        this.root = new TreeNode(0, 0, w, h);
        this.root.centerX = this.root.centerY = 0;
        this.root.total = 0;
        this.size = 0;
        this.width = w || 1000; //  总显示区域的长宽
        this.height = h || 600;
    }

    build(nodes) {
        for(let i = 0; i < nodes.length; ++i) {
            this.add(this.root, nodes[i]);
        }
    }

    add(root, node) {   //  node {x: "", y: ""}
        if(root == null)
            return;
        let size = {w: root.width / 2, h: root.height / 2};
        if(root === this.root && this.size == 0) { //  quadtree根的情况特判
            //  如果是根，直接创建node
            let pos = root.calPos(node.x, node.y, size.w, size.h);
            //  更新数据node进入的新节点的center、数据、total
            root.child[pos.idx] = new TreeNode(pos.x, pos.y, size.w, size.h);
            root.child[pos.idx].setInfo(node.x, node.y, node.x, node.y, 1);  
            //  update current root
            root.centerX = node.x;
            root.centerY = node.y;
            root.total = 1;
            this.size++;
            return;
        }

        if(root.isLeaf() && root != this.root) { //  root是叶子节点，则内部已包含一个数据k，则应重新划分区域，放入node和k
            let tmpNode = {x: root.dataX, y: root.dataY};   //  当前root包含的数据的坐标
            root.dataX = root.dataY = NaN, root.data = null;  //  清除当前root数据
            let pos = root.calPos(tmpNode.x, tmpNode.y, size.w, size.h);    //  判断原数据k应划分在那个象限
            root.child[pos.idx] = new TreeNode(pos.x, pos.y, size.w, size.h);
            root.child[pos.idx].setInfo(tmpNode.x, tmpNode.y, tmpNode.x, tmpNode.y, 1);//  更新原数据k进入的新节点的center、数据、total

            this.add(root, node);
            //  重新计算root的center和total
            root.total = 2;
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
                rt.total = 1;
                this.size++;
                //  update current root
                root.total++;
                this.updateCenter(root);
            }
            else {
                this.add(rt, node);
                root.total++;
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

    dfsPaint(ctx, root) {
        if(root.isLeaf() && root != this.root) {
            ctx.beginPath();
            ctx.arc(root.dataX, root.dataY, 3, 0, Math.PI*2, false);
            ctx.fillStyle = 'black';
            ctx.fill();
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

class TreeNode {
    constructor(x, y, w, h) {
        this.centerX = NaN;
        this.centerY = NaN;
        this.total = 0;
        this.areaX = x;
        this.areaY = y;
        this.dataX = NaN;
        this.dataY = NaN;
        this.child = [null, null, null, null];
        this.width = w;
        this.height = h;
        this.data = null;
    }

    setInfo(dataX, dataY, centerX, centerY, total) {
        this.dataX = dataX, this.dataY = dataY;
        this.centerX = centerX, this.centerY = centerY;
        this.total = total;
    }

    isLeaf() {
        for(let i = 0; i < this.child.length; ++i) {
            if(this.child[i] != null)
                return false;
        }
        return true;
    }

    calPos(x, y, sizeX, sizeY) {    //  返回(x, y)所在的块的idx，区域的长宽
        let posx = x - this.areaX, posy = y - this.areaY;
        let i = Math.floor(posx / sizeX), j = Math.floor(posy / sizeY);
        if(i == 0 && j == 0)
            return {idx: 0, x: this.areaX, y: this.areaY};    // 左上
        else if(i == 1 && j == 0)
            return {idx: 1, x: this.areaX + sizeX, y: this.areaY};   //  右上
        else if(i == 0 && j == 1)
            return {idx: 2, x: this.areaX, y: this.areaY + sizeY};   //  左下
        else if(i == 1 && j == 1)
            return {idx: 3, x: this.areaX + sizeX, y: this.areaY + sizeY};   //  右下
        return null;
    }

}