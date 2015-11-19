define(function (require) {

    var ColorPicker = require('./colorPicker.jsx');
    var math = require('math');

    return React.createClass({
        // 每次刷新后执行
        componentDidUpdate: function () {
            var mesh = this.props.mesh;
            var color = mesh.hasOwnProperty(window.editorKey) ? mesh[window.editorKey].color : '000000';
            if (!isNaN(color)) {
                color = color.toString(16);
            }
            while(color.length < 6) {
                color = '0' + color;
            }
            color = '#' + color;
            if (color !== this.refs.materialcolor.state.value) {
                this.refs.materialcolor.setState({value: color});
            }
        },
        render: function () {

            var props = {
                className: 'geometry-property-bar',
                style: {display: this.props.display}
            }
            var mesh = this.props.mesh;
            var type = mesh.geometry.type.replace('Geometry', '');
            var name = mesh.name || (type + ' ' + new Date(mesh.birth).format('MM/DD hh:mm:ss'));
            var callback = this.props.commandRouting;
            var me = this;

            // 修改物体名称
            function nameChangeHandler(e) {
                callback('modify-name', mesh, e.target.value);
            }

            // 修改颜色
            function colorChangeHandler(e) {
                callback('modify-color', mesh, parseInt(e.value.value.slice(1, 7), 16));
            }

            // 格式化数字
            function numberFormat(v, type, fix) {
                return (type === 'rotation' ? 180 * v / Math.PI : v).toFixed(fix);
            }

            // 创建参数输入框
            function numberBox(type, direction, fix) {
                var inputProp = {
                    type: 'number',
                    'data-cmd-type': type,
                    'data-cmd-direction': direction,
                    value: numberFormat(mesh[type][direction], type, fix),
                    step: type === 'position' ? 5 : 1,
                    onChange: function (e) {
                        var type = e.target.dataset.cmdType;
                        var direction = e.target.dataset.cmdDirection;
                        callback('modify-' + type, direction, e.target.value);
                    }
                };
                if (type === 'scale') {
                    inputProp.min = 0.05;
                    inputProp.step = 0.01;
                }
                return (
                    <div className="label-l1">
                        <div className="label-l3">{direction}:</div>
                        <input {...inputProp}/>
                    </div>
                );
            }

            // 显示关节
            function vector() {
                var mesh = me.props.mesh;
                var vertices = mesh.geometry.vertices;
                if (me.props.joint == null || me.props.joint > vertices.length - 1) {
                    return;
                }
                var joint =  vertices[me.props.joint];
                var matrix = math.rotateMatrix(mesh);
                var pos = math.Local2Global(joint.x, joint.y, joint.z, matrix, mesh);
                return (
                    <div>
                        <div className="label-l1">
                            <div className="label-l3">x:</div>
                            <input type="number" value={numberFormat(pos[0])}/>
                        </div>
                        <div className="label-l1">
                            <div className="label-l3">y:</div>
                            <input type="number" value={numberFormat(pos[1])}/>
                        </div>
                        <div className="label-l1">
                            <div className="label-l3">z:</div>
                            <input type="number" value={numberFormat(pos[2])}/>
                        </div>
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
                            <input type="text" value={name} onChange={nameChangeHandler}/>
                        </div>
                        <div className="label-l1">
                            <div className="label-l2">color:</div>
                            <ColorPicker ref="materialcolor" onChange={colorChangeHandler} width="134"/>
                        </div>
                        <div className="label-l1">
                            <div className="label-l2">wireframe:</div>
                            <input type="checkbox" checked={mesh.material.wireframe}/>
                        </div>
                    </td>
                    <td>
                        <div className="label-l1">position</div>
                        {numberBox('position', 'x', 0)}
                        {numberBox('position', 'y', 0)}
                        {numberBox('position', 'z', 0)}
                    </td>
                    <td>
                        <div className="label-l1">rotation</div>
                        {numberBox('rotation', 'x', 0)}
                        {numberBox('rotation', 'y', 0)}
                        {numberBox('rotation', 'z', 0)}
                    </td>
                    <td>
                        <div className="label-l1">scale</div>
                        {numberBox('scale', 'x', 2)}
                        {numberBox('scale', 'y', 2)}
                        {numberBox('scale', 'z', 2)}
                    </td>
                    <td style={{display: this.props.joint == null ? 'none' : 'block'}}>
                        <div className="label-l1">Vector</div>
                        {vector()}
                    </td>
                </tr></table></div>
            );
        }
    });
});
