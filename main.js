import QuadTree from "./QuadTree.js";
import ManyBody from "./manyBody.js";
import {judge, choose, caldis, getNodePair} from "./stop.js" ;

var nodes = [{x:100, y:100}, {x:200, y:130}, {x:800, y:400}, {x:900, y:500}, {x:900, y:50}];
var datas = [{name:'A', E:100}, {name:'B', E:200}, {name:'C', E:150}, {name:'D', E:300}, {name:'E', E:450}];
// var edges = [{source: 0, target: 1, length: 70}, {source: 1, target: 2, length: 60}, {source: 2, target: 3, length: 30}, {source: 2, target: 4, length: 55}];
var edges = [{source: 0, target: 1, length: 10*3}, {source: 1, target: 2, length: 20*3}, {source: 2, target: 3, length: 40*3}, {source: 2, target: 4, length: 80*3}];

function calAllCenter() {
    let x = 0, y = 0, sumE = 0;
    for(let i = 0; i < nodes.length; ++i) {
        x += nodes[i].x * datas[i].E;
        y += nodes[i].y * datas[i].E;
        sumE += datas[i].E;
    }
    x /= sumE, y /= sumE;
    return {x: x, y: y};
}

// var quadTree = new QuadTree(1000, 600);
// quadTree.build(nodes, datas);
// console.log(quadTree.root);
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var manyBody = new ManyBody(ctx, 1000, 600);
manyBody.nodes = nodes, manyBody.datas = datas, manyBody.edges = edges;
manyBody.buildTree();

var pairName = choose(edges, datas), pair = [];
var record = 0;

// iter();

setInterval(function(){
    manyBody.buildTree();
    //  判断形状收敛，退出迭代
    pair = getNodePair(pairName, manyBody.quadTree);
    if(judge(pair, record))
        return;
    record = caldis(pair);
    // console.log(record);

    ctx.clearRect(0,0,1000,600);
    ctx.beginPath();
    let center = calAllCenter();
    ctx.arc(center.x, center.y, 5, 0, Math.PI*2, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
    manyBody.quadTree.dfsPaint(ctx, manyBody.quadTree.root);
    ctx.strokeRect(0,0,1000,600);
    manyBody.step();
}, 1);

function iter() {
    while(1) {
        manyBody.buildTree();
        //  判断形状收敛，退出迭代
        pair = getNodePair(pairName, manyBody.quadTree);
        if(judge(pair, record))
            return;
        record = caldis(pair);
        manyBody.step();
    }
}
