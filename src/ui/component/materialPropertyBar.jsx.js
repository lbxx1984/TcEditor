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
        render: function () {
            var props = {
                className: 'geometry-property-bar',
                style: {display: this.props.display}
            }
            var mesh = this.props.mesh;
            var type = mesh.material.type.replace('Material', '');
            var me = this;
            // if (mesh.material.map) {
            //     mesh.material.map.dispose();
            // }
            // var loader = new THREE.TextureLoader();
            // loader.load('resources/textures/ash_uvgrid01.jpg', function (texture) {
            //     mesh.material.setValues({
            //         opacity: 0.5,
            //         map: texture
            //     });
            //     mesh.material.needsUpdate = true;
            // });
            
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
                    </td>
                    <td>
                        <div className="label-l1">map纹理图片，这个很有用</div>
                        <div className="label-l1">opacity，没什么乱用这个属性</div>
                        <div className="label-l1">side渲染面数量，基本也没什么卵用</div>
                        <div className="label-l1">wireframe显示成网格，已经实现</div>
                    </td>
                </tr></table></div>
            );
        }
    });
});
