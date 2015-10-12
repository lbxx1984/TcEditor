define(['React'], function (React) {
    return React.createClass({
        render: function () {
            return (
                <div className="stage">
                    <div className="stage3d" ref="stage3d"></div>
                    <div className="stage2d" ref="stage2d"></div>
                    <div className="camera-controller" ref="cameracontroller"></div>
                </div>
            );
        }
    });
});