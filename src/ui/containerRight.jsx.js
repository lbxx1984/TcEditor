define(['React'], function (React) {
    return React.createClass({
        render: function () {
            var m3 = this.props.mouse3d;
            return (
                <div className="container-right">
                    <div className="mouse-position-bar">
                        x:<div className="position-item">{m3.x}</div>
                        y:<div className="position-item">{m3.y}</div>
                        z:<div className="position-item">{m3.z}</div>
                    </div>
                </div>
            );
        }
    });
});