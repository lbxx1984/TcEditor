define(function (require) {
    var ContainerProperty = require('./containerProperty.jsx');
    return React.createClass({
        getInitialState: function () {
            return {
                activeMesh: null
            };
        },
        render: function () {
            return (
                <div className="container-stage">
                    <div className="stage3d" ref="stage3d"></div>
                    <div className="stage2d" ref="stage2d"></div>
                    <ContainerProperty mesh={this.state.activeMesh}/>
                    <div className="camera-controller" ref="cameracontroller"></div>
                </div>
            );
        }
    });
});