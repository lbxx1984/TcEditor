/**
 * @file 主启动文件
 */
define([
    './application.jsx', './stage/main', './command/main', './transformer/main', './morpher/main'
], function (App, Stage, Routing, Transformer, Morpher) {

    var routing = new Routing('mouse-cameramove');
    var uiProps = {
        commandRouting: function (e) {routing.main(e);}
    };
    routing.ui = React.render(React.createElement(App, uiProps), document.body, uiLoaded);

    window.onresize = function () {
        if (routing.stage != null) {
            routing.stage.resize();
        }
    };

    function cloneMouseEvent(e) {
        var parent = e.target.parentNode;
        var result = {
            clientX: e.clientX,
            clientY: e.clientY,
            offsetX: e.offsetX + parent.offsetLeft,
            offsetY: e.offsetY + parent.offsetTop,
            target: e.target 
        };
        return result;
    }

    function uiLoaded() {
        var stageRefs = this.refs.containerleft.refs.stage.refs;
        var stageDom = this.refs.containerleft.refs.stage.getDOMNode();
        // 为控制路由添加舞台
        routing.stage = new Stage({
            container1: stageRefs.cameracontroller.getDOMNode(),
            container2: stageRefs.stage2d.getDOMNode(),
            container3: stageRefs.stage3d.getDOMNode()
        });
        // 为控制路由添加变形器
        routing.transformer = new Transformer(routing.stage);
        // 为控制路由添加关节变换器
        routing.morpher = new Morpher(routing.stage);
        // 为舞台添加事件
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
    }
});
