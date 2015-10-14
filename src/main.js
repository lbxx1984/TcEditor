/**
 * @file 主启动文件
 */
require([
    './ui/application.jsx', './stage/main', './command/main', './transformer/main'
], function (App, Stage, Routing, Transformer) {

    var routing = new Routing('mouse-cameramove');
    var uiProps = {
        commandRouting: function (e) {routing.main(e);}
    };

    routing.ui = React.render(React.createElement(App, uiProps), document.body, uiLoaded);
    
    window.onresize = function () {
        if (routing.stage != null) {
            routing.stage.resize();
        }
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
        // 为舞台添加事件
        stageDom.addEventListener('mousedown', function (e) {routing.mousedown(e);});
        stageDom.addEventListener('mouseup', function (e) {routing.mouseup(e);});
        stageDom.addEventListener('mouseleave', function (e) {routing.mouseleave(e);});
        stageDom.addEventListener('mousemove', function (e) {routing.mousemove(e);});
        stageDom.onmousewheel = function(event) {
            routing.stage.zoom(event);
            event.stopPropagation();
            return false;
        }
    }
});
