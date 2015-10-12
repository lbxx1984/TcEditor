require.config({
    paths: {
        three: '../deps/three/three.min.r72',
        CanvasRenderer: '../deps/three/CanvasRenderer',
        React: '../deps/react.min'
    }
});
define(['React', './component/application.jsx', './stage/main'], function (React, App, Stage) {
    var stage = null;
    var props = {
        commandRouting: function (e) {
            console.log(e);
        }
    };
    React.render(
        React.createElement(App, props),
        document.body,
        function () {
            stage = new Stage({
                ui: this,
                container1: this.refs.containerleft.refs.stage.refs.cameracontroller.getDOMNode(),
                container2: this.refs.containerleft.refs.stage.refs.stage2d.getDOMNode(),
                container3: this.refs.containerleft.refs.stage.refs.stage3d.getDOMNode()
            });
        }
    );
    window.onresize = function () {
        if (stage != null) {
            stage.resize();
        }
    }
});