import QuadTree from "./QuadTree.js";
import ManyBody from "./manyBody.js";
import {judge, choose, caldis, getNodePair} from "./stop.js" ;
import {paintCenter, getNodePos, getTree, nwk2json, randomNum} from "./util.js";

// var nodes = [{x:100, y:100}, {x:200, y:130}, {x:800, y:400}, {x:900, y:500}, {x:900, y:50}];
// var nodes = [getNodePos(), getNodePos(), getNodePos(), getNodePos(), getNodePos()];
// var datas = [{name:'A', E:100}, {name:'B', E:200}, {name:'C', E:150}, {name:'D', E:300}, {name:'E', E:450}];
// var edges = [{source: 0, target: 1, length: 70}, {source: 1, target: 2, length: 60}, {source: 2, target: 3, length: 30}, {source: 2, target: 4, length: 55}];
// var edges = [{source: 0, target: 1, length: 10*3}, {source: 1, target: 2, length: 20*3}, {source: 2, target: 3, length: 40*3}, {source: 2, target: 4, length: 80*3}];


// var nodes = [getNodePos(), getNodePos(), getNodePos(), getNodePos(), getNodePos(), getNodePos()];
// var datas = [{name:'A', E:100}, {name:'B', E:200}, {name:'C', E:150}, {name:'D', E:300}, {name:'E', E:450}, {name:'F', E:450}];
// var edges = [{source: 0, target: 1, length: 70}, {source: 1, target: 2, length: 60}, {source: 2, target: 3, length: 30}, {source: 2, target: 4, length: 55}, {source: 3, target: 5, length: 55}];

let info = nwk2json('(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F');
// let info = nwk2json('((C:0.3,D:0.4)E:0.1)F');
let tree = getTree(info);
console.log(tree);
var nodes = tree.nodes, edges = tree.edges, datas = tree.datas;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var manyBody = new ManyBody(ctx, 1000, 600);
manyBody.nodes = nodes, manyBody.datas = datas, manyBody.edges = edges;
manyBody.buildTree();

var pairName = choose(edges, datas), pair = [];
var record = 0;

// iter();

setInterval(function(){
    paintAmimation();
    ctx.clearRect(0,0,1000,600);
    manyBody.paintAllLinks();
    paintCenter(ctx, nodes, datas);
    manyBody.quadTree.dfsPaint(ctx, manyBody.quadTree.root);
    ctx.strokeRect(0,0,1000,600);
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

function paintAmimation() {
    manyBody.buildTree();
    //  判断形状收敛，退出迭代
    pair = getNodePair(pairName, manyBody.quadTree);
    if(judge(pair, record))
        return;
    record = caldis(pair);
    manyBody.step();
}