/*
 * @Github: https://github.com/Geek-James
 * @掘金: https://juejin.im/user/5c4ebc72e51d4511dc7306ce
 * @Date: 2020-05-08 16:50:22
 * @LastEditors: your name
 * @LastEditTime: 2020-05-08 17:52:27
 */
var gameView = document.getElementById("gameView");
var stage = new createjs.Stage(gameView);
var height = 50; //节点之间的高
var width = 30; //节点之间的宽
var tops = 40; //根节点离顶部的距离
var foot = 40; //树离底部距离
var spacing = 30; //树分别离两边的间距

var tree = new BinaryTree();

// 单个逐次添加
function AddOneNumber() {
    var numbertext = document.getElementById("numbertext").value;

    var oneNums = numbertext.match(/[1-9][0-9]{0,2}\,?/);
    document.getElementById("numbertext").value = numbertext.replace(/[1-9][0-9]{0,2}\,?/, "");

    var num = (oneNums + "").match(/[1-9][0-9]{0,2}/);

    if (num) {
        tree.Insert(parseInt(num));
        RenewTreeNode();
    }
}

// 一次性添加所有
function AddAllNumber() {
    while (true) {
        AddOneNumber();
        var numbertext = document.getElementById("numbertext").value;
        if (!/[1-9][0-9]{0,2}/.test(numbertext)) {
            break;
        }
    }
}

// 删除
function DeleteNumber(number) {
    tree.Remove(parseInt(number));
    RenewTreeNode();
}

// 前序排列
function preOrderTraverse() {

    tree.preOrderTraverse(tree.Root);

    // document.getElementById('preOrder').innerText = numbertext;
}

function RenewTreeNode(number) {
    stage.removeAllChildren();

    SetCanvasWidthHeight(tree);

    tree.SetPoint();

    tree.PreOrder(SetPreOrder);
}

function SetCanvasWidthHeight(tree) {
    var level = tree.Level();
    gameView.height = height * level + tops + foot;
    gameView.width = Math.pow(2, level + 1) * width + spacing * 2;
}

function SetPreOrder(node) {
    var container = CreateNode(
        node.Data,
        gameView.width / 2 + width * node.nodePoint,
        (node.nodeLevel * height + parseInt(tops)),
        "red");
    stage.addChild(container);

    if (node.Parent != null) {
        var line = CreateLineTo(
            (gameView.width / 2 + width * node.Parent.nodePoint),
            (node.Parent.nodeLevel * height + parseInt(tops)),
            (node.Data, gameView.width / 2 + width * node.nodePoint),
            (node.nodeLevel * height + parseInt(tops)));
        stage.addChild(line);
    }
    stage.update();
}

//color=gray red yellow blue  black
function CreateNode(number, x, y, color) {
    var textX = 0;
    if (number < 10) {
        textX = -5;
    } else if (number > 9 && number < 100) {
        textX = -9;
    } else {
        textX = -14;
    }
    var text = new createjs.Text(number, "16px Arial", "#fff");
    text.x = textX;
    text.y = -8;

    var graphics = new createjs.Graphics();
    graphics.setStrokeStyle(1);
    graphics.beginStroke(createjs.Graphics.getRGB(0, 0, 255));
    graphics.beginFill(color);
    graphics.drawCircle(0, 0, 15);
    var shape = new createjs.Shape(graphics);

    var container = new createjs.Container();
    container.x = x;
    container.y = y;
    container.addChild(shape, text);

    container.addEventListener("dblclick", function () {
        DeleteNumber(text.text);
    });

    return container;
}

function CreateLineTo(fatherNodex, fatherNodey, childrenNodex, childrenNodey) {
    var sp = new createjs.Shape();
    sp.graphics.s("blue").ss(2).mt(fatherNodex, fatherNodey + 15).lt(childrenNodex, childrenNodey - 15).es(); //线
    return sp;
}

// 重置
function reset() {
    window.location.reload();
}