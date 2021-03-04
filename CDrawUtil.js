function paintLink(src, tar, ctx) {
    canvasLine(src, tar, ctx, "#DAB1D5", 2);
}

//  绘制所有连接节点的边
export function paintAllLinks(nodes, edges, ctx) {
    for(let i = 0; i < edges.length; ++i) {
        let src = nodes[edges[i].source], tar = nodes[edges[i].target];
        paintLink(src, tar, ctx);
    }
}

//  绘制节点、四叉树分割线、重心
export function dfsPaint(ctx, root) {
    if(root.isLeaf()/* && root != this.root*/) {
        canvasPoint(root.centerX, root.centerY, ctx, "black", 3);
        canvasText(root.dataX + 8, root.dataY - 8, ctx, 16, "Georgia", "black", root.data.name);
    }
    else {
        canvasPoint(root.centerX, root.centerY, ctx, "red", 3);
        //  绘制四叉树的分割线
        canvasLine({x:root.areaX + root.width / 2, y: root.areaY}, 
            {x:root.areaX + root.width / 2, y:root.areaY + root.height},
                ctx, "#E0E0E0", 2);
        canvasLine({x:root.areaX, y: root.areaY + root.height / 2}, 
            {x:root.areaX + root.width, y:root.areaY + root.height / 2},
                ctx, "#E0E0E0", 2);
    }
    for(let i = 0; i < root.child.length; ++i) {
        if(root.child[i] != null) {
            dfsPaint(ctx, root.child[i]);
        }
    }
}

//  封装canvas绘制直线
function canvasLine(src, tar, ctx, color, width) {
    ctx.beginPath();
    ctx.moveTo (src.x, src.y);       //设置起点状态
    ctx.lineTo (tar.x, tar.y);       //设置末端状态
    ctx.lineWidth = width          //设置线宽状态
    ctx.strokeStyle = color ;  //设置线的颜色状态
    ctx.stroke();  
    ctx.closePath();
}

//  封装canvas绘制点
function canvasPoint(x, y, ctx, color, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

//  封装canvas绘制文字
function canvasText(x, y, ctx, fontSize, font, color, text) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.font = fontSize + "px " + font;
    ctx.fillText(text, x, y);
    ctx.closePath();
}

//  绘制重心
export function paintCenter(ctx, nodes, datas) {
    ctx.beginPath();
    let center = calAllCenter(nodes, datas);
    ctx.arc(center.x, center.y, 5, 0, Math.PI*2, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
}
//  计算重心
function calAllCenter(nodes, datas) {
    let x = 0, y = 0, sumE = 0;
    for(let i = 0; i < nodes.length; ++i) {
        x += nodes[i].x * datas[i].E;
        y += nodes[i].y * datas[i].E;
        sumE += datas[i].E;
    }
    x /= sumE, y /= sumE;
    return {x: x, y: y};
}