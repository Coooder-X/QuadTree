//生成从minNum到maxNum的随机数
export function randomNum(minNum, maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        default: 
            return 0; 
    } 
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

export function getNodePos(width = 1000, height = 600) {
    return {x: randomNum(0, width), y: randomNum(0, height)};
}

export function nwk2json(s) {
	var ancestors = [];
	var tree = {};
	var tokens = s.split(/\s*(; |\(|\)|,|:)\s*/);
	for (var i=0; i<tokens.length; i++) {
		var token = tokens[i];
		switch (token) {
			case '(': // new children
				var subtree = {};
				tree.children = [subtree];
				ancestors.push(tree);
				tree = subtree;
				break;
			case ',': // another branch
				var subtree = {};
				ancestors[ancestors.length-1].children.push(subtree);
				tree = subtree;
				break;
			case ')': // optional name next
				tree = ancestors.pop();
				break;
			case ':': // optional length next
				break;
			default:
				var x = tokens[i-1];
				if(x == ')' || x == '(' || x == ',') {
					tree.name = token;
				}
                else if (x == ':') {
					tree.branch_length = parseFloat(token);
				}
		}
	}
	return tree;
};

export function json2nwk(json) {
	function nested(nest) {
		var subtree = "";

		if(nest.hasOwnProperty('children')) {
			var children = [];
			nest.children.forEach(function(child) {
				var subsubtree = nested(child);
				children.push(subsubtree);
			});
			var substring = children.join();
			if(nest.hasOwnProperty('name')) {
				subtree = "("+substring+")" + nest.name;
			}
			if(nest.hasOwnProperty('branch_length')) {
				subtree = subtree + ":"+nest.branch_length;
			}
		}
        else {
			var leaf = "";
			if(nest.hasOwnProperty('name')) {
				leaf = nest.name;
			}
			if(nest.hasOwnProperty('branch_length')) {
				leaf = leaf + ":"+nest.branch_length;
			}
			subtree = subtree + leaf;
		}
		return subtree;
	}
	return nested(json) +";";
};

export function getTree(tree) {
    let nodes = [], edges = [], datas = [], idx = 0;
    let que = new Array(), now = {node: tree, idx: 0};
	//  根节点的E设为100? (设为0会导致计算force时出现力为0，nodes变为NaN，若设置过小会导致该节点剧烈摆动而不收敛)
    datas.push({name: now.node.name, E: 100});  
    que.push(now);
    while(que.length) {
        now = que[0];
        que.shift();
        if(now.node.children != undefined) { //  是非叶子节点
            for(let i = 0; i < now.node.children.length; ++i) {  //  孩子是非叶子节点
                let child = now.node.children[i];
                if(child.children != undefined) {
                    idx++;
                    edges.push({source: now.idx, target: idx, length: getLen(child.branch_length)});
                    datas.push({name: child.name, E: getE(child.branch_length)});
                    que.push({node: child, idx: idx});
                }
                else {  //  孩子是叶子节点
                    idx++;
                    edges.push({source: now.idx, target: idx, length: getLen(child.branch_length)});
                    datas.push({name: child.name, E: getE(child.branch_length)});
                }
            }
        }
    }
    return {edges: edges, datas: datas};
}

function getLen(num) {
    return num * 380;	//	280
}

function getE(len) {
    return len * 1300;
}

export function initTreeShape(tree, width=1000, height=600) {
	let nodes = [];
	let que = new Array(), now = {node: tree, pos: {x: width/2, y: height/2}, alpha: 0};
    que.push(now);
    while(que.length) {
        now = que[0];
		nodes.push(now.pos);
        que.shift();
        if(now.node.children != undefined) { //  是非叶子节点
			let childrenList = [], leafList = [];
			now.node.children.forEach(child => {
				if(child != undefined)
					childrenList.push(child);
			});
			let nowAlpha = 0.0, subAlpha = 2 * Math.PI / (childrenList.length + 1);// + 0.05 / (2 * Math.PI);
			childrenList.forEach(child => {
				nowAlpha += subAlpha;
				let tmpAlpha = Math.PI - now.alpha + nowAlpha;
				let dx = Math.cos(tmpAlpha) * getLen(child.branch_length), dy = Math.sin(tmpAlpha) * getLen(child.branch_length);
				let tmpPos = {x: now.pos.x + dx, y: now.pos.y + dy};
				que.push({node: child, pos: tmpPos, alpha: tmpAlpha});
			});
        }
    }
	return nodes;
}
