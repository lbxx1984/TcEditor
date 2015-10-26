define(function (require) {
    return React.createClass({
        getInitialState: function () {
            return {x: 0, y: 0, z: 0};
        },
        render: function () {
            return (
                <div className="mouse-position-bar">
                    <div className="position-label label-x">x:</div>
                    <div className="position-item item-x">{this.state.x}</div>
                    <div className="position-label label-y">y:</div>
                    <div className="position-item item-y">{this.state.y}</div>
                    <div className="position-label label-z">z:</div>
                    <div className="position-item item-z">{this.state.z}</div>
                </div>
            );
        }
    });
});