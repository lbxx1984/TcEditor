define(['React', './mousePositionBar.jsx'], function (React, MousePositionBar) {
    return React.createClass({
        getInitialState: function () {
            return {
                mouse3d: {x: 0, y: 0, z: 0}
            };
        },
        render: function () {
            var mousePositionBarProps = {
                mouse3d: this.state.mouse3d
            };
            return (
                <div className="container-right">
                    <MousePositionBar {...mousePositionBarProps}/>
                </div>
            );
        }
    });
});