define(function (require) {
    return React.createClass({
        getInitialState: function () {
            return {x: 0, y: 0, z: 0};
        },
        render: function () {
            return (
                <div className="mouse-position-bar">
                    x:<div className="position-item">{this.state.x}</div>
                    y:<div className="position-item">{this.state.y}</div>
                    z:<div className="position-item">{this.state.z}</div>
                </div>
            );
        }
    });
});