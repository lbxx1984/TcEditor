define(function (require) {
    var ContainerProperty = require('./containerProperty.jsx');
    return React.createClass({
        getInitialState: function () {
            return {
                activeMesh: null,
                activeJoint: null
            };
        },
        render: function () {
            var propertyProp = {
                mesh: this.state.activeMesh,
                joint: this.state.activeJoint,
                commandRouting: this.props.commandRouting
            };
            return (
                <div className="container-stage">
                    <div className="stage3d" ref="stage3d"></div>
                    <div className="stage2d" ref="stage2d"></div>
                    <ContainerProperty {...propertyProp}/>
                    <div className="camera-controller" ref="cameracontroller"></div>
                </div>
            );
        }
    });
});