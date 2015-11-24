/**
 * @file 主启动文件
 */
define(function (require) {


    // 引入扩展和子系统
    require('./extend');
    var App = require('./application.jsx');
    var Stage = require('./stage/main');
    var Routing = require('./command/main');
    var Transformer = require('./transformer/main');
    var Morpher = require('./morpher/main');
    var Light = require('./light/main');
    var IO = require('./io/main');
    var FileSystem = require('fs');


    // 顺序初始化
    var routing = new Routing('mouse-cameramove');
    var promise = new Promise(setupFileSystem)
        .then(makeWorkingSpace, unsupported)
        .then(enterWorkingSpace, unsupported)
        .then(setupUI, unsupported)



    // 绑定全局resize事件
    window.onresize = function () {
        if (routing.stage != null) {
            routing.stage.resize();
        }
    };


    function setupFileSystem(resolve, reject) {
        routing.fs = new FileSystem(function (fs) {
            fs ? resolve() : reject();
        });
    }
    function makeWorkingSpace() {
        return new Promise(function (resolve, reject) {
            routing.fs.md(window.editorKey, function (result) {
                result instanceof FileError ? reject() : resolve();
            });
        });
    }
    function enterWorkingSpace() {
        return new Promise(function (resolve, reject) {
            routing.fs.cd(window.editorKey, function (result) {
                result instanceof FileError ? reject() : resolve();
            });
        });
    }
    function setupUI() {
        var uiElement = React.createElement(App, {
            commandRouting: function () {routing.main.apply(routing, arguments);}
        });
        return new Promise(function (resolve, reject) {
            try {
                routing.ui = React.render(uiElement, document.body, resolve);
            }
            catch (e) {
                reject();
            }
        });
    }
    function unsupported() {
        console.log('Your browser does not support TcEditor.');
    }





    // // UI控制回调



    // // UI初始化回调
    // function uiLoaded() {

    //     var stageRefs = this.refs.containerleft.refs.stage.refs;
    //     var stageDom = this.refs.containerleft.refs.stage.getDOMNode();

    //     // 舞台
    //     routing.stage = new Stage({
    //         container1: stageRefs.cameracontroller.getDOMNode(),
    //         container2: stageRefs.stage2d.getDOMNode(),
    //         container3: stageRefs.stage3d.getDOMNode()
    //     });
    //     // 变形器
    //     routing.transformer = new Transformer(routing.stage);
    //     // 关节变换器
    //     routing.morpher = new Morpher(routing.stage);
    //     // 灯光系统
    //     routing.light = new Light({stage: routing.stage});

    //     // 默认灯光
    //     var light = new THREE.PointLight(0xffffff, 1.5, 3000);
    //     light.position.set(0, 900, 0);
    //     routing.light.add(light);
    //     // light = new THREE.PointLight(0xff0000, 1.5, 3000);
    //     // light.position.set(900, 900, 0);
    //     // routing.light.add(light);
    //     // light = new THREE.PointLight(0x0000ff, 1.5, 3000);
    //     // light.position.set(900, 900, 900);
    //     // routing.light.add(light);
    //     // light = new THREE.PointLight(0x00ff00, 1.5, 3000);
    //     // light.position.set(0, 900, 900);
    //     // routing.light.add(light);

    //     // 变形器事件
    //     routing.transformer.onChange = function (mesh) {
    //         routing.ui.refs.containerleft.refs.stage.setState({activeMesh: mesh});
    //     }

    //     // 关节变换器事件
    //     routing.morpher.onChange = function (joint) {
    //         routing.ui.refs.containerleft.refs.stage.setState({activeJoint: joint});
    //     }

    //     // 舞台事件
    //     stageDom.addEventListener('mousedown', function (e) {
    //         routing.mousedown(cloneMouseEvent(e));
    //     });
    //     stageDom.addEventListener('mouseup', function (e) {
    //         routing.mouseup(cloneMouseEvent(e));
    //     });
    //     stageDom.addEventListener('mouseleave', function (e) {
    //         routing.mouseleave(cloneMouseEvent(e));
    //     });
    //     stageDom.addEventListener('mousemove', function (e) {
    //         routing.mousemove(cloneMouseEvent(e));
    //     });
    //     stageDom.oncontextmenu = function (event) {
    //         routing.mouseRightClick(event);
    //         return false;
    //     };
    //     stageDom.onmousewheel = function(event) {
    //         routing.stage.zoom(event);
    //         event.stopPropagation();
    //         return false;
    //     };

    //     // 显示信息
    //     displayInformation();

    //     // 重置鼠标事件参数
    //     function cloneMouseEvent(e) {
    //         var parent = e.target.parentNode;
    //         var result = {
    //             clientX: e.clientX,
    //             clientY: e.clientY,
    //             offsetX: e.offsetX + parent.offsetLeft,
    //             offsetY: e.offsetY + parent.offsetTop,
    //             target: e.target,
    //             button: e.button
    //         };
    //         return result;
    //     }
    // }


    // // 显示信息
    // // 由于React的Render是异步的，所以这里要判断APP究竟Render完了没有，uiLoaded执行时Routing.ui的值尚不存在
    // function displayInformation() {
    //     if (routing.ui == null) {
    //         setTimeout(displayInformation, 10);
    //         return;
    //     }
    //     // 显示灯光
    //     routing.ui.refs.containerright.refs.verticallist.refs.lightBox.setState({
    //         light: routing.light.children
    //     });
    // }


});
