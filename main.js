import QuadTree from "./QuadTree.js";

var nodes = [{x:100, y:100}, {x:200, y:130}, {x:800, y:400}, {x:900, y:500}, {x:900, y:50}];
var quadTree = new QuadTree(1000, 600);
quadTree.build(nodes);
console.log(quadTree.root);
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
setInterval(function(){
    ctx.clearRect(0,0,1000,600);
    ctx.beginPath();
    ctx.arc(580, 236, 5, 0, Math.PI*2, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
    quadTree.dfsPaint(ctx, quadTree.root);
    ctx.strokeRect(0,0,1000,600);
},30);