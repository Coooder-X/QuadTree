export default class TreeNode {
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