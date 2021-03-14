/*      (A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F
{
    name: "F",
    children: [
        {name: "A", branch_length: 0.1},
        {name: "B", branch_length: 0.2},
        {
            name: "E",
            branch_length: 0.5,
            children: [
                {name: "C", branch_length: 0.3},
                {name: "D", branch_length: 0.4}
            ]
        }
    ]
}
*/
import {randomNum, randomString, json2nwk} from "./util.js";
export default function randomNewick() {
    let n = randomNum(2, 50); //  树节点数量
    let root = {name: randomName(), children: []};
    let que = new Array();
    let now = root;
    que.push(now);
    n--;
    while(n > 0 && que.length > 0) {
        now = que[0];
        que.shift();
        let Min = (now == root? 1 : 0); //  Min 为当前节点的最小孩子数，根节点至少有一个孩子
        // if(now != root && randomNum(0, 7) == 0)    //  有 1/3 概率一个非根节点没有孩子
        //     Min = 0;
        let childNum = Math.min(randomNum(Min, 7), n);  //  当前节点孩子数
        n -= childNum;
        let children = [];
        while(childNum > 0) {
            childNum--;
            let child = {};
            child.name = randomName();
            child.branch_length = Math.random();
            children.push(child);
            que.push(child);
        }
        now.children = children;
    }
    console.log(root);
    console.log(json2nwk(root));
    return json2nwk(root);
}

function randomName() {
    return randomString(randomNum(3, 7));
}