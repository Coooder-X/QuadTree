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
            // console.log(this);
            
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
            root.child[pos.idx].dataX = root.child[pos.idx].centerX = node.x;    
            root.child[pos.idx].dataY = root.child[pos.idx].centerY = node.y;
            root.child[pos.idx].total = 1;   
            //  update root
            root.centerX = node.x;
            root.centerY = node.y;
            root.total = 1;
            this.size++;
            return;
        }

        if(root.isLeaf() && root != this.root) { //  root是叶子节点，则内部已包含一个数据k，则应重新划分区域，放入node和k
            //  
            let tmpNode = {x: root.dataX, y: root.dataY};   //  当前root包含的数据的坐标
            // root = new TreeNode(root.areaX, root.areaY, root.width, root.height);
            root.areaX = root.areaX;
            root.areaY = root.areaY;
            root.width = root.width;
            root.height = root.height;
            let pos = root.calPos(tmpNode.x, tmpNode.y, size.w, size.h);    //  判断原数据k应划分在那个象限
            root.child[pos.idx] = new TreeNode(pos.x, pos.y, size.w, size.h);
            root.child[pos.idx].dataX = root.child[pos.idx].centerX = tmpNode.x;    //  更新原数据k进入的新节点的center、数据、total
            root.child[pos.idx].dataY = root.child[pos.idx].centerY = tmpNode.y;
            root.child[pos.idx].total = 1;

            this.add(root, node);
            //  重新计算root的center和total
            root.centerX = (tmpNode.x + node.x) / 2;
            root.centerY = (tmpNode.y + node.y) / 2;
            root.total = 2;
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
            }
            else {
                let n = root.total;
                root.centerX = (root.centerX * n + node.x) / (n + 1);
                root.centerY = (root.centerY * n + node.y) / (n + 1);   //  更新center, total
                root.total++;
                this.add(rt, node);
            }
        }
    }

}

class TreeNode {
    constructor(x, y, w, h) {
        this.centerX = NaN;
        this.centerY = NaN;
        this.total = NaN;
        this.areaX = x;
        this.areaY = y;
        this.dataX = NaN;
        this.dataY = NaN;
        this.child = [null, null, null, null];
        this.width = w;
        this.height = h;
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
        console.log(i + ' ' + j);
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