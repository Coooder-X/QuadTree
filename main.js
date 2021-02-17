import QuadTree from "./QuadTree.js";

var nodes = [{x:100, y:100}, {x:200, y:130}, {x:800, y:400}, {x:900, y:500}, {x:900, y:50}];
var datas = [{name:'A', E:10}, {name:'B', E:20}, {name:'C', E:15}, {name:'D', E:30}, {name:'E', E:45}];
let x = 0, y = 0, sumE = 0;
for(let i = 0; i < nodes.length; ++i) {
    x += nodes[i].x * datas[i].E;
    y += nodes[i].y * datas[i].E;
    sumE += datas[i].E;
}
x /= sumE, y /= sumE;

var quadTree = new QuadTree(1000, 600);
quadTree.build(nodes, datas);
console.log(quadTree.root);
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
setInterval(function(){
    ctx.clearRect(0,0,1000,600);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI*2, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
    quadTree.dfsPaint(ctx, quadTree.root);
    ctx.strokeRect(0,0,1000,600);
},30);