import QuadTree from "./QuadTree.js";
import ManyBody from "./manyBody.js";

var nodes = [{x:100, y:100}, {x:200, y:130}, {x:800, y:400}, {x:900, y:500}, {x:900, y:50}];
var datas = [{name:'A', E:100}, {name:'B', E:200}, {name:'C', E:150}, {name:'D', E:300}, {name:'E', E:450}];
let x = 0, y = 0, sumE = 0;
for(let i = 0; i < nodes.length; ++i) {
    x += nodes[i].x * datas[i].E;
    y += nodes[i].y * datas[i].E;
    sumE += datas[i].E;
}
x /= sumE, y /= sumE;

// var quadTree = new QuadTree(1000, 600);
// quadTree.build(nodes, datas);
// console.log(quadTree.root);
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var manyBody = new ManyBody(ctx, 1000, 600);
manyBody.nodes = nodes, manyBody.datas = datas;
manyBody.buildTree();
setInterval(function(){
    ctx.clearRect(0,0,1000,600);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI*2, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
    manyBody.quadTree.dfsPaint(ctx, manyBody.quadTree.root);
    manyBody.forceOnBodies();
    ctx.strokeRect(0,0,1000,600);
},30);