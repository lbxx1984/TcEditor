define([
    'React', './containerRight.jsx', './containerLeft.jsx'
], function (React, RightContainer, MainContainer) {
    return React.createClass({
        getInitialState: function () {
            return {
                mouse3d: {x: 0, y: 0, z: 0}
            };
        },
        render: function () {
            var rightProps = {
                mouse3d: {
                    x: parseInt(this.state.mouse3d.x, 10),
                    y: parseInt(this.state.mouse3d.y, 10),
                    z: parseInt(this.state.mouse3d.z, 10)
                }
            };
            return (
                <div>
                    <RightContainer {...rightProps}/>
                    <MainContainer {...this.props} ref="containerleft"/>
                </div>
            );
        }
    });
});