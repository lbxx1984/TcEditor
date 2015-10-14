define(function (require) {
    return React.createClass({
        render: function () {
            var stageProps = {
                className: 'stage',
                onMouseUp: this.props.mouseup,
                onMouseMove: this.props.mousemove,
                onMouseDown: this.props.mousedown,
                onContextMenu: function () {
                    return false;
                }
            };
            return (
                <div {...stageProps}>
                    <div className="stage3d" ref="stage3d"></div>
                    <div className="stage2d" ref="stage2d"></div>
                    <div className="camera-controller" ref="cameracontroller"></div>
                </div>
            );
        }
    });
});