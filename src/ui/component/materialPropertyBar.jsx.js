define(function (require) {

    var ColorPicker = require('widget/colorPicker.jsx');
    var math = require('math');

    return React.createClass({
        // 每次刷新后执行
        componentDidUpdate: function () {
            var mesh = this.props.mesh;
            var color = mesh.hasOwnProperty(window.editorKey) ? mesh[window.editorKey].color : '000000';
            var emissive = mesh.hasOwnProperty(window.editorKey) ? mesh[window.editorKey].emissive : '000000';
            if (!isNaN(color))
                color = color.toString(16);
            if (!isNaN(emissive))
                emissive = emissive.toString(16);
            while(color.length < 6)
                color = '0' + color;
            while(emissive.length < 6)
                emissive = '0' + emissive;
            color = '#' + color;
            emissive = '#' + emissive;
            if (color !== this.refs.materialcolor.state.value)
                this.refs.materialcolor.setState({value: color});
            if (emissive !== this.refs.materialemissive.state.value)
                this.refs.materialemissive.setState({value: emissive});
        },
        // 修改材质颜色
        colorChangeHandler: function (e) {
            this.props.commandRouting('modify-color', this.props.mesh, parseInt(e.value.value.slice(1, 7), 16));
        },
        // 修改阴影颜色
        emissiveChangeHandler: function (e) {
            this.props.commandRouting('modify-emissive', this.props.mesh, parseInt(e.value.value.slice(1, 7), 16));
        },
        // 显隐物体骨骼
        frameChangeHandler: function (e) {
            this.props.commandRouting('modify-wireframe', this.props.mesh, e.target.checked);
        },
        // 修改透明度，好像没什么用
        opacityChangeHandler: function (e) {
            this.props.commandRouting('modify-opacity', this.props.mesh, parseFloat(e.target.value));
        },
        // 修改渲染面
        sideChangeHandler: function (e) {
            this.props.commandRouting('modify-side', this.props.mesh, e.target.value);
        },
        // 修改纹理
        textureChangeHandler: function (e) {
            this.props.commandRouting('modify-texture', this.props.mesh, e.target);
        },
        render: function () {
            var props = {
                className: 'geometry-property-bar',
                style: {display: this.props.display}
            }
            var mesh = this.props.mesh;
            var type = mesh.material.type.replace('Material', '');
            var me = this;
            return (
                <div {...props}><table><tr>
                    <td style={{width: '230px'}}>
                        <div className="label-l1">
                            <div className="label-l2">type:</div>
                            {type}
                        </div>
                        <div className="label-l1">
                            <div className="label-l2">color:</div>
                            <ColorPicker ref="materialcolor" onChange={this.colorChangeHandler} width="140"/>
                        </div>
                        <div className="label-l1">
                            <div className="label-l2">emissive:</div>
                            <ColorPicker ref="materialemissive" onChange={this.emissiveChangeHandler} width="140"/>
                        </div>
                        <div className="label-l1">
                            <div className="label-l2">wireframe:</div>
                            <input type="checkbox" checked={mesh.material.wireframe}
                                onChange={this.frameChangeHandler}/>
                        </div>
                    </td>
                    <td style={{width: '260px'}}>
                        <div className="label-l1">
                            <div className="label-l2"></div>
                        </div>
                        <div className="label-l1">
                            <div className="label-l2">texture:</div>
                            <input type="file" value="" onChange={this.textureChangeHandler}/>
                        </div>
                        <div className="label-l1">
                            <div className="label-l2">opacity:</div>
                            <input type="range" step="0.01" max="1" min="0" value={mesh.material.opacity}
                                onChange={this.opacityChangeHandler}/>
                        </div>
                        <div className="label-l1">
                            <div className="label-l2">side:</div>
                            <select value={mesh.material.side} onChange={this.sideChangeHandler}>
                                <option value={THREE.FrontSide}>FrontSide</option>
                                <option value={THREE.BackSide}>BackSide</option>
                                <option value={THREE.DoubleSide}>DoubleSide</option>
                            </select>
                        </div>
                    </td>
                </tr></table></div>
            );
        }
    });
});
