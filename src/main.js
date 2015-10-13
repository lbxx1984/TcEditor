require.config({
    paths: {
        three: '../deps/three/three.min.r72',
        CanvasRenderer: '../deps/three/CanvasRenderer',
        React: '../deps/react.min'
    }
});

define([
    'React', './ui/application.jsx', './stage/main', './command/main'
], function (React, App, Stage, CommandRouting) {
    var routing = new CommandRouting('mouse-cameramove');
    var props = {
        commandRouting: function (e) {
            routing.main(e);
        },
        stageMouseDown: function (e) {
            console.log(e);
        }
    };
    routing.ui = React.render(
        React.createElement(App, props),
        document.body,
        function () {
            var stageRefs = this.refs.containerleft.refs.stage.refs;
            var stageDom = this.refs.containerleft.refs.stage.getDOMNode();
            routing.stage = new Stage({
                ui: this,
                container1: stageRefs.cameracontroller.getDOMNode(),
                container2: stageRefs.stage2d.getDOMNode(),
                container3: stageRefs.stage3d.getDOMNode()
            });
            stageDom.addEventListener('mousedown', function (e) {routing.mousedown(e);});
            stageDom.addEventListener('mouseup', function (e) {routing.mouseup(e);});
            stageDom.addEventListener('mouseleave', function (e) {routing.mouseup(e);});
            stageDom.addEventListener('mousemove', function (e) {routing.mousemove(e);});
            stageDom.onmousewheel = function(event) {
                routing.stage.zoom(event);
                event.stopPropagation();
                return false;
            }
        }
    );
    window.onresize = function () {
        if (routing.stage != null) {
            routing.stage.resize();
        }
    }
});