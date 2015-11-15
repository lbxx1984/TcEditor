define(function (require) {
    return React.createClass({
        render: function () {
            var mesh = this.props.activeMesh;
            if (mesh == null) {
                return (
                    <div className="tab-content" style={{display:this.props.display}}>
                    </div>
                );
            }
            var name = mesh.name || (mesh.geometry.type.replace('Geometry', '') + ' '
                + new Date(mesh.birth).format('MM/DD hh:mm:ss'));

            return (
                <div className="tab-content geometry-content" style={{display:this.props.display}}>
                    <div className="label-l1"><div>name:</div>{name}</div>
                    <div className="label-l1"><div>type:</div>{mesh.geometry.type}</div>
                    <div className="label-l1"><div>position:</div>{mesh.position.x.toFixed(2)}</div>
                    <div className="label-l1"><div></div>{mesh.position.y.toFixed(2)}</div>
                    <div className="label-l1"><div></div>{mesh.position.z.toFixed(2)}</div>
                </div>
            );
        }
    });
});
