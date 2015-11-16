define(function (require) {
    return React.createClass({
        render: function () {
            var props = {
                className: 'property-bar',
                'data-is-property-bar': true,
                style: {
                    display: this.props.mesh ? 'block' : 'none'
                }
            }
            var mesh = this.props.mesh;
            if (!mesh) {
                return (<div {...props}></div>);
            }
            var name = mesh.name || (mesh.geometry.type.replace('Geometry', '') + ' '
                + new Date(mesh.birth).format('MM/DD hh:mm:ss'));

            console.log(mesh);

            // 格式化数组
            function numberFormat(v, type) {
                if (type === 'rotation') {
                    v = 180 * v / Math.PI;
                }
                return v.toFixed(2);
            }

            // 创建参数输入框
            function numberBox(type, direction) {
                return (
                    <div className="label-l1">
                        <div className="label-l3">{direction}:</div>
                        <input type="number" value={numberFormat(mesh[type][direction], type)}/>
                    </div>
                );
            }

            return (
                <div {...props}><table><tr>
                    <td style={{width: '230px'}}>
                        <div className="label-l1"><div className="label-l2">type:</div>{mesh.geometry.type}</div>
                        <div className="label-l1">
                            <div className="label-l2">name:</div>
                            <input type="text" value={name}/>
                        </div>
                    </td>
                    <td style={{width: '150px'}}>
                        <div className="label-l1">position</div>
                        {numberBox('position', 'x')}
                        {numberBox('position', 'y')}
                        {numberBox('position', 'z')}
                    </td>
                    <td style={{width: '150px'}}>
                        <div className="label-l1">rotation</div>
                        {numberBox('rotation', 'x')}
                        {numberBox('rotation', 'y')}
                        {numberBox('rotation', 'z')}
                    </td>
                    <td style={{width: '150px'}}>
                        <div className="label-l1">scale</div>
                        {numberBox('scale', 'x')}
                        {numberBox('scale', 'y')}
                        {numberBox('scale', 'z')}
                    </td>
                    <td></td>
                </tr></table></div>
            );
        }
    });
});
