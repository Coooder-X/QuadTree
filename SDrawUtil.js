//  绘制所有连接节点的边
export function paintAllLinks(nodes, edges, pad) {
    for(let i = 0; i < edges.length; ++i) {
        let src = nodes[edges[i].source], tar = nodes[edges[i].target];
        svgLine(src, tar, pad, "#DAB1D5", 4, i);
    }
}
//  绘制所有节点
export function paintAllNodes(nodes, pad) {
    nodes.forEach((node, idx) => {
        svgPoint(node.x, node.y, pad, 'black', 5, idx);
    });
}
//  绘制所有节点的文字
export function paintAllTexts(nodes, datas, G, notLeaf, filterSet, pad) {
    let fontSize = 20;
    nodes.forEach((node, idx) => {
        if(!filterSet.has(idx)) {   //  若name不为null
            if(notLeaf.has(idx)) { //  若当前点不是叶节点，不打印
                svgText(node.x + 8, node.y - 8, pad, 0, fontSize, "Georgia", "black", "", idx);
            }
            else { //  打印叶节点
                let father = nodes[G[idx][0].pos];
                let dx = node.x - father.x, dy = node.y - father.y;
                //  通过找到上一标签（circle标签），获得节点的半径 r
                let r = Number(document.getElementById("svg").getElementsByTagName('circle')[idx].getAttribute('r'));
                let dis = Math.sqrt(dx * dx + dy * dy), gap = 15 + r;    //  gap是节点到字的间距
                let sin = Math.abs(dy / dis), cos = Math.abs(dx / dis);
                let alpha = 360 * Math.asin(Math.abs(dy) / dis) / (2 * Math.PI);// alpha是边和x轴锐角绝对值
                if(dx > 0 && dy < 0) {  //  第一象限
                    alpha = 360 - alpha;
                } else if(dx < 0 && dy < 0) {  //  第二象限
                    alpha += 180;
                } else if(dx < 0 && dy > 0) {  //  第三象限
                    alpha = 180 - alpha;
                } else {  //  第四象限
                    alpha = alpha;
                }   //  计算出文字应旋转的角度alpha（x轴正向是0°，顺时针是正方向）
                dx = (gap * cos) * (dx < 0? -1 : 1), dy = (gap * sin) * (dy < 0? -1 : 1);
                // console.log(alpha);
                svgText(node.x + dx, node.y + dy, pad, alpha, fontSize, "Georgia", "black", datas[idx].name, idx);
            }
        }
        else {  //  name为null
            svgText(node.x + 8, node.y - 8, pad, 0, fontSize, "Georgia", "black", "", idx);
        }
    });
}

//  绘制节点、四叉树分割线、重心
// export function dfsPaint(Nodepad, linePad, textPad, centerPad, root) {
//     if(root.isLeaf()/* && root != this.root*/) {
//         canvasPoint(root.centerX, root.centerY, pad, "black", 3);
//         canvasText(root.dataX + 8, root.dataY - 8, ctx, 16, "Georgia", "black", root.data.name);
//     }
//     else {
//         canvasPoint(root.centerX, root.centerY, pad, "red", 3);
//         //  绘制四叉树的分割线
//         svgLine({x:root.areaX + root.width / 2, y: root.areaY}, 
//             {x:root.areaX + root.width / 2, y:root.areaY + root.height},
//                 linePad, "#E0E0E0", 2);
//         svgLine({x:root.areaX, y: root.areaY + root.height / 2}, 
//             {x:root.areaX + root.width, y:root.areaY + root.height / 2},
//                 linePad, "#E0E0E0", 2);
//     }
//     for(let i = 0; i < root.child.length; ++i) {
//         if(root.child[i] != null) {
//             dfsPaint(Nodepad, linePad, textPad, centerPad, root.child[i]);
//         }
//     }
// }

//  封装svg绘制直线
function svgLine(src, tar, pad, color, width, idx) {
    let line = pad.oG.getElementsByTagName('line')[idx];
    if(line != undefined) {
        line.setAttribute('x1', src.x);
        line.setAttribute('y1', src.y);
        line.setAttribute('x2', tar.x);
        line.setAttribute('y2', tar.y);
    }
    else {
        line = createShape('line', {'x1':src.x, 'y1':src.y, 'x2':tar.x, 'y2':tar.y, 'stroke':color, 'stroke-width':width});
        pad.oG.appendChild(line);  //添加到oG
        pad.oSvg.appendChild(pad.oG);  //添加到oSvg
        line.onmouseenter = function() {
            startMoveLine(line, width * 1.8, width * 1.3);  //  选中动画特效
            //...修改线的颜色
            line.setAttribute('stroke-width', width * 1.5);
            line.setAttribute('stroke', 'red');
        }
        line.onmouseleave = function() {
            line.setAttribute('stroke-width', width);
            line.setAttribute('stroke', color);
        };
    }
}

/*
  封装svg绘制节点
  x,y 圆心坐标; pad为父标签集合; idx为该节点（节点或重心）索引（它们不在一个g标签内）
*/
function svgPoint(x, y, pad, color, radius, idx) {    //  pad {oG: , oSvg: }
    let circle = pad.oG.getElementsByTagName('circle')[idx];
    if(circle != undefined) {
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
    }
    else {
        circle = createShape('circle', {'cx':x, 'cy':y, 'r':radius  ,'fill':color, 'stroke':'black', 'stroke-width':'1'});
        pad.oG.appendChild(circle);  //添加到oG
        pad.oSvg.appendChild(pad.oG);  //添加到oSvg
        circle.onmouseenter = function() {
            startMovePoint(pad.oG.getElementsByTagName('circle')[idx], 1.8 * radius, radius); //this是g标签 要找到圆 起始值为半径40 目标变成30
            circle.setAttribute('fill', '#FF9224');
            circle.setAttribute('stroke', '#FF9224');
        }
        circle.onmouseleave = function() {
            circle.setAttribute('fill', color);
            circle.setAttribute('stroke', color);
        };
    }
}

//  封装svg绘制文字
function svgText(x, y, pad, alpha = 0, fontSize, font, color, text, idx) {
    let oText = pad.oG.getElementsByTagName('text')[idx];
    if(oText != undefined) {
        oText.setAttribute('x', x);
        oText.setAttribute('y', y);
    }
    else {
        oText = createShape('text', {'x':x, 'y':y, 'fill':color, 'font-size':fontSize, 'text-anchor':'middle', 'font-family':font });
        oText.innerHTML = text;  //添加文字
        pad.oG.appendChild(oText);  //添加到oG
        pad.oSvg.appendChild(pad.oG);  //添加到oSvg
    }
    oText.setAttribute("text-anchor", "start"); //  text-anchor="start"时，(x,y)为<text>的起始坐标
    oText.setAttribute("transform", 'rotate(' + alpha + ' ' + x + ' ' + y + ')');   // 设置文字旋转角度和旋转中心
}

//  绘制重心
export function paintCenter(pad, nodes, datas, idx) {
    let center = calAllCenter(nodes, datas);
    svgPoint(center.x, center.y, pad, 'green', 5, idx);
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

export function createShape(tag, objAttr) {       //封装一个创建标签的函数 这里取名为createTag
    let svgNS = 'http://www.w3.org/2000/svg';   //命名空间
    let oTag = document.createElementNS(svgNS, tag);
    for(let attr in objAttr){
       oTag.setAttribute(attr, objAttr[attr]);    //设置属性
    }
    return oTag;
}

//鼠标移入移出时的弹性变化
function startMovePoint(obj, r1, r2) {
    var nowR = r1;
    var overR = r2;
    obj.speed = 0;
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        obj.speed += (overR - nowR) / 6;
        obj.speed *= 0.8; //摩擦系数
        if(Math.abs(overR - nowR) <= 1 && Math.abs(obj.speed) <= 1) {
            clearInterval(obj.timer);
            obj.setAttribute('r', overR);
        }
        else{
            nowR += obj.speed;
            obj.setAttribute('r', nowR);
        }
    }, 30);
}

//鼠标移入移出时的弹性变化
function startMoveLine(obj, r1, r2) {
    var nowR = r1;
    var overR = r2;
    obj.speed = 0;
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        obj.speed += (overR - nowR) / 6;
        obj.speed *= 0.8; //摩擦系数
        if(Math.abs(overR - nowR) <= 1 && Math.abs(obj.speed) <= 1) {
            clearInterval(obj.timer);
            obj.setAttribute('stroke-width', overR);
        }
        else{
            nowR += obj.speed;
            obj.setAttribute('stroke-width', nowR);
        }
    }, 30);
}

export function positionShift(screenWidth, screenHeight, treeWidth, treeHeight, nodes) {
    let centerX = screenWidth / 2, centerY = screenHeight / 2;
    let centerX2 = treeWidth / 2, centerY2 = treeHeight / 2;
    let dx = centerX2 - centerX, dy = centerY2 - centerY;
    let shiftedNodes = [];
    for(let i = 0; i < nodes.length; ++i) {
        shiftedNodes.push({x: nodes[i].x - dx, y: nodes[i].y - dy});
    }
    return shiftedNodes;
}
