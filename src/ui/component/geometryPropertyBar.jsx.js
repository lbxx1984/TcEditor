define(function (require) {

    var ColorPicker = require('./colorPicker.jsx');

    return React.createClass({
        render: function () {

            var props = {
                className: 'geometry-property-bar',
                style: {display: this.props.display}
            }
            var mesh = this.props.mesh;
            var meshColor = mesh.hasOwnProperty('__tceditor__') ? mesh['__tceditor__'].color : '#000000';
            var name = mesh.name || (mesh.geometry.type.replace('Geometry', '') + ' '
                + new Date(mesh.birth).format('MM/DD hh:mm:ss'));

            // console.log(mesh.material)
            // 格式化数字
            function numberFormat(v, type) {
                return (type === 'rotation' ? 180 * v / Math.PI : v).toFixed(2);
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
                        <div className="label-l1">
                            <div className="label-l2">type:</div>{mesh.geometry.type}</div>
                        <div className="label-l1">
                            <div className="label-l2">name:</div>
                            <input type="text" value={name}/>
                        </div>
                        <div className="label-l1">
                            <div className="label-l2">color:</div>
                            <ColorPicker value={meshColor}/>
                        </div>
                    </td>
                    <td>
                        <div className="label-l1">position</div>
                        {numberBox('position', 'x')}
                        {numberBox('position', 'y')}
                        {numberBox('position', 'z')}
                    </td>
                    <td>
                        <div className="label-l1">rotation</div>
                        {numberBox('rotation', 'x')}
                        {numberBox('rotation', 'y')}
                        {numberBox('rotation', 'z')}
                    </td>
                    <td>
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
