/**
 * @file 主启动文件
 */
define(function (require) {


    // 引入扩展和子系统
    require('./extend');
    require('io/FileSaver');
    var App = require('./application.jsx');
    var Stage = require('./stage/main');
    var Routing = require('./command/main');
    var Transformer = require('./transformer/main');
    var Morpher = require('./morpher/main');
    var Light = require('./light/main');
    var IO = require('./io/main');
    var FileSystem = require('./io/filesystem');
    var keyboard = require('./io/keyboard');  
    var routing = new Routing('mouse-cameramove');


    // 顺序初始化
    setupIO()
    .then(enterWorkingSpace, unsupported)
    .then(setupUI, unsupported)
    .then(setupStage, unsupported)
    .then(loadEditorConf, unsupported)
    .then(bindEventHandlers, unsupported)
    .then(displayInformation, unsupported);


    function unsupported() {
        console.log('Your browser does not support TcEditor.');
    }

    function setupIO() {
        return new Promise(function (resolve, reject) {
            routing.filePath = null;
            routing.imgCache = {};
            routing.keyboard = keyboard;
            routing.io = new IO({routing: routing});
            routing.fs = new FileSystem(function (fs) {
                fs ? resolve() : reject();
            });
        });
    }

    function enterWorkingSpace() {
        return new Promise(function (resolve, reject) {
            routing.fs.md(window.editorKey, function (result) {
                result instanceof FileError ? reject() : resolve();
            });
        }).then(function () {
            return new Promise(function (resolve, reject) {
                routing.fs.cd(window.editorKey, function (result) {
                    result instanceof FileError ? reject() : resolve();
                });
            });
        }, unsupported);
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

    function setupStage() {
        return new Promise(function (resolve, reject) {
            var stageRefs = routing.ui.refs.containerleft.refs.stage.refs;
            var stageDom = routing.ui.refs.containerleft.refs.stage.getDOMNode();
            // 舞台
            routing.stage = new Stage({
                container1: stageRefs.cameracontroller.getDOMNode(),
                container2: stageRefs.stage2d.getDOMNode(),
                container3: stageRefs.stage3d.getDOMNode()
            });
            // 变形器
            routing.transformer = new Transformer(routing.stage);
            // 关节变换器
            routing.morpher = new Morpher(routing.stage);
            // 灯光系统
            routing.light = new Light({stage: routing.stage, ui: routing.ui});
            // 必成功
            resolve();
        });
    }

    function loadEditorConf() {
        return new Promise(function (resolve, reject) {
            routing.io.readEditorConf(function () {
                resolve();
            });
        });
    }

    function bindEventHandlers() {
        // 重置鼠标事件参数
        function cloneMouseEvent(e) {
            var parent = e.target.parentNode;
            var result = {
                clientX: e.clientX,
                clientY: e.clientY,
                offsetX: e.offsetX + parent.offsetLeft,
                offsetY: e.offsetY + parent.offsetTop,
                target: e.target,
                button: e.button
            };
            return result;
        }
        return new Promise(function (resolve, reject) {
            var containerleft = routing.ui.refs.containerleft;
            var stageDom = routing.ui.refs.containerleft.refs.stage.getDOMNode();
            // 变形器事件
            routing.transformer.onChange = function (mesh) {
                containerleft.refs.stage.setState({activeMesh: mesh});
            }
            // 关节变换器事件
            routing.morpher.onChange = function (joint) {
                containerleft.refs.stage.setState({activeJoint: joint});
            }
            // 舞台事件
            stageDom.addEventListener('mousedown', function (e) {
                routing.mousedown(cloneMouseEvent(e));
            });
            stageDom.addEventListener('mouseup', function (e) {
                routing.mouseup(cloneMouseEvent(e));
            });
            stageDom.addEventListener('mouseleave', function (e) {
                routing.mouseleave(cloneMouseEvent(e));
            });
            stageDom.addEventListener('mousemove', function (e) {
                routing.mousemove(cloneMouseEvent(e));
            });
            stageDom.oncontextmenu = function (event) {
                routing.mouseRightClick(event);
                return false;
            };
            stageDom.onmousewheel = function(event) {
                routing.stage.zoom(event);
                event.stopPropagation();
                return false;
            };
            // 全局resize事件
            window.onresize = function () {
                if (routing.stage != null) {
                    routing.stage.resize();
                }
            };
            // 全局鼠标事件
            document.onkeydown = function (e) {
                if (keyboard.preventDefault(e)) {
                    e.preventDefault();
                }
            }
            document.onkeyup = function (e) {
                if (e.target.tagName !== 'BODY') {
                    return;
                }
                var key = keyboard.translate(e);
                // 优先派发component注册的自定义快捷键事件
                if (keyboard.depatch(key)){
                    return;
                }
                // 派发系统级别快捷键事件
                var cmd = keyboard.key2cmd(key);
                if (cmd !== undefined) {
                    routing.main(cmd);
                    return;
                }
            }
            // 必成功
            resolve();
        });
    }

    function displayInformation() {
        return new Promise(function (resolve, reject) {
            showLight();
            function showLight() {
                if (routing.ui == null) {
                    setTimeout(showLight, 10);
                    return;
                }
                // 显示灯光
                routing.ui.refs.containerright.refs.verticallist.refs.lightBox.setState({
                    light: routing.light.children
                });
                resolve();
            }
        });
    }


});
