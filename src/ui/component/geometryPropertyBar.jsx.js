define(function (require) {

    var ColorPicker = require('widget/colorPicker.jsx');
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
        // 修改物体名称
        nameChangeHandler: function (e) {
            this.props.commandRouting('modify-name', this.props.mesh, e.target.value);
        },
        // 修改颜色
        colorChangeHandler: function (e) {
            this.props.commandRouting('modify-color', this.props.mesh, parseInt(e.value.value.slice(1, 7), 16));
        },
        // 显隐物体骨骼
        frameChangeHandler: function (e) {
            this.props.commandRouting('modify-wireframe', this.props.mesh, e.target.checked);
        },
        // 修改物体关节
        vectorChangeHandler: function (e) {
            var dataset = e.target.dataset;
            this.props.commandRouting('modify-vector', this.props.mesh, dataset.joint, dataset.direction, e.target.value);
        },
        // 修改物体姿态
        matrixChangeHandler: function (e) {
            var type = e.target.dataset.cmdType;
            var direction = e.target.dataset.cmdDirection;
            this.props.commandRouting('modify-' + type, direction, e.target.value);
        },
        render: function () {
            var props = {
                className: 'geometry-property-bar',
                style: {display: this.props.display}
            }
            var mesh = this.props.mesh;
            var type = mesh.geometry.type.replace('Geometry', '');
            var name = mesh.name || (type + ' ' + new Date(mesh.birth).format('MM/DD hh:mm:ss'));
            var me = this;
            return (
                <div {...props}><table><tr>
                    <td style={{width: '230px'}}>
                        <div className="label-l1">
                            <div className="label-l2">type:</div>
                            {type}
                        </div>
                        <div className="label-l1">
                            <div className="label-l2">name:</div>
                            <input type="text" value={name} onChange={this.nameChangeHandler}/>
                        </div>
                        <div className="label-l1">
                            <div className="label-l2">color:</div>
                            <ColorPicker ref="materialcolor" onChange={this.colorChangeHandler} width="140"/>
                        </div>
                        <div className="label-l1">
                            <div className="label-l2">wireframe:</div>
                            <input type="checkbox" checked={mesh.material.wireframe} onChange={this.frameChangeHandler}/>
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
                        {[0, 1, 2].map(vectorBox)}
                    </td>
                </tr></table></div>
            );
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
                    onChange: me.matrixChangeHandler
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
            // 创建关节输入框
            function vectorBox(direction) {
                var labels = ['x', 'y', 'z'];
                var mesh = me.props.mesh;
                var vertices = mesh.geometry.vertices;
                if (me.props.joint == null || me.props.joint > vertices.length - 1) {
                    return (<div></div>);
                }
                var joint =  vertices[me.props.joint];
                var matrix = math.getRotateMatrix(mesh);
                var pos = math.local2world(joint.x, joint.y, joint.z, matrix, mesh);
                var inputProp = {
                    type: 'number',
                    step: 1,
                    'data-joint': me.props.joint,
                    'data-direction': direction,
                    value: numberFormat(pos[direction]),
                    onChange: me.vectorChangeHandler
                };
                return (
                    <div className="label-l1">
                        <div className="label-l3">{labels[direction]}:</div>
                        <input {...inputProp}/>
                    </div>
                );
            }
        }
    });
});
