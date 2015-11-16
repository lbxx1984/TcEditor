define(function (require) {
    var PropertyBar = require('../component/propertyBar.jsx');
    return React.createClass({
        getInitialState: function () {
            return {
                activeMesh: null
            };
        },
        render: function () {
            return (
                <div className="stage">
                    <div className="stage3d" ref="stage3d"></div>
                    <div className="stage2d" ref="stage2d"></div>
                    <PropertyBar mesh={this.state.activeMesh}/>
                    <div className="camera-controller" ref="cameracontroller"></div>
                </div>
            );
        }
    });
});