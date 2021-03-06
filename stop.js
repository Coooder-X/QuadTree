import QuadTree from "./QuadTree.js";
import TreeNode from "./TreeNode.js";
export function judge(pair, record) {
    let dis = caldis(pair);
    return Math.abs(dis - record) < 0.0003;//0.0002;
}

export function caldis(pair) {
    let dx = pair[0].dataX - pair[1].dataX, dy = pair[0].dataY - pair[1].dataY;
    return Math.sqrt(dx * dx + dy * dy);
}
 /*   
    return：返回树的直径的两个端点的name
 */
export function choose(edges, datas) {
    let pair = [], G = createGraph(edges);
    let start = bfs(0, G);
    pair.push(datas[start].name);
    pair.push(datas[bfs(start, G)].name);
    return pair;
}

export function getNodePair(pair, quadTree) {    // 根据树直径的两个端点name，查找TreeNode节点返回
    return [quadTree.map.get(pair[0]), quadTree.map.get(pair[1])];
}
 /*   
    寻找最远点
    startIdx: 起点下标，G: 图邻接表
    return：最远点下标
 */
function bfs(startIdx, G) {
    let que = new Array();
    let end = null, maxlen = 0, now = {pos: startIdx, len: 0};
    let vis = [];
    for(let i = 0; i < G.length; ++i) 
        vis.push(0);
    vis[startIdx] = 1;
    que.push(now);
    while(que.length) {
        now = que[0];
        que.shift();
        for(let i = 0; i < G[now.pos].length; ++i) {
            if(vis[G[now.pos][i].pos])  continue;
            que.push({pos: G[now.pos][i].pos, len: now.len + G[now.pos][i].len});
            vis[G[now.pos][i].pos] = 1;
            if(maxlen < now.len + G[now.pos][i].len) {
                maxlen = now.len + G[now.pos][i].len;
                end = G[now.pos][i].pos;
            }
        }
    }
    return end;
}

export function createGraph(edges) {   //  根据edges建立图邻接表
    let G = new Array();
    for(let i = 0; i < edges.length + 1; ++i)
        G.push(new Array());
    for(let i = 0; i < edges.length; ++i) {
        G[edges[i].source].push({pos: edges[i].target, len: edges[i].length});
        G[edges[i].target].push({pos: edges[i].source, len: edges[i].length});
    }
    return G;
}