import ManyBody from "./manyBody.js";
import {judge, choose, caldis, getNodePair} from "./stop.js" ;
import {getTree, nwk2json, initTreeShape, processNoneName} from "./util.js";
import {paintAllLinks, paintAllNodes, paintAllTexts, createShape} from "./SDrawUtil.js";

var svgNS = 'http://www.w3.org/2000/svg';   //命名空间
var oParent = document.getElementById("svg");   //获取父节点 才能添加到页面中
var centerX = oParent.offsetWidth/2;   //中心点横坐标
var centerY = oParent.offsetHeight/2;   //中心点纵坐标

var oG_Node = createShape('g', {'style':'cursor:pointer', 'class':'circleStyle'});  //  鼠标悬浮在形状上时为手指icon
var oG_Line = createShape('g', {'style':'cursor:pointer', 'class':'lineStyle'});
var oG_Text = createShape('g', {'style':'cursor:pointer', 'class':'textStyle'});
var oSvg = createShape('svg', {'xmlns':svgNS, 'width':'100%', 'height':'100%' });

oParent.appendChild(oSvg);  //添加到oParent

var pad_Node = {oG: oG_Node, oSvg: oSvg};
var pad_Link = {oG: oG_Line, oSvg: oSvg};
var pad_Text = {oG: oG_Text, oSvg: oSvg};

let info = nwk2json('(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F');
// let info = nwk2json('(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F');
// let info = nwk2json('((C:0.3,D:0.4)E:0.1)F');
let tree = getTree(info);
console.log(tree);
var nodes = initTreeShape(info, 1000, 600), edges = tree.edges, datas = tree.datas;
let noneNameNodeIdx = processNoneName(datas);

var manyBody = new ManyBody(null, 1000, 600);
manyBody.nodes = nodes, manyBody.datas = datas, manyBody.edges = edges;
manyBody.buildTree();

var pairName = choose(edges, datas), pair = [];
var record = 0;

// iter();

setInterval(function(){
    paintAmimation();
    paintAllLinks(manyBody.nodes, manyBody.edges, pad_Link);
    paintAllNodes(manyBody.nodes, pad_Node);
    paintAllTexts(manyBody.nodes, manyBody.datas, noneNameNodeIdx, pad_Text);
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
