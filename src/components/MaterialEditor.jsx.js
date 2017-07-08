/**
 * @file 材质编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var THREE = require('three');
    var React = require('react');
    var Dialog = require('fcui2/Dialog.jsx');
    var NumberBox = require('fcui2/NumberBox.jsx');
    var Select = require('fcui2/Select.jsx');
    var CheckBox = require('fcui2/CheckBox.jsx');
    var ColorSetter = require('./dialogContent/ColorSetter.jsx');
    var dialog = new Dialog();
    var _ = require('underscore');
    var io = require('../core/io');


    function formatRGB(v) {
        return parseInt(v * 255, 10);
    }


    function getMtlParam(props) {
        var mesh = props.mesh;
        var dataset = {
            opacity: 1
        };
        if (!mesh) dataset;
        dataset.opacity = parseFloat(mesh.material.opacity).toFixed(2) * 1
        return dataset;
    }


    return React.createClass({
        // @override
        contextTypes: {
            dispatch: React.PropTypes.func
        },
        getInitialState: function () {
            return _.extend({}, getMtlParam(this.props));
        },
        componentWillReceiveProps: function (nextProps) {
            if (!nextProps.mesh) return;
            if (nextProps.timer !== this.props.timer || nextProps.mesh !== this.props.mesh) {
                this.setState(getMtlParam(nextProps));
                return;
            }
        },
        onPanelCloseIconClick: function () {
            this.context.dispatch('view-close-panel', this.props.type);
        },
        onPanelToggleIconClick: function () {
            this.context.dispatch('view-toggle-panel', this.props.type);
        },
        onColorClick: function () {
            var me = this;
            var mesh = this.props.mesh;
            dialog.pop({
                contentProps: {
                    value: mesh.tc.materialColor,
                    onChange: function (value) {
                        mesh.tc.materialColor = value;
                        mesh.material.color.setHex(value);
                        me.context.dispatch('updateTimer');
                    }
                },
                content: ColorSetter,
                title: 'Please Choose Material Color'
            });
        },
        onEmissiveChange: function () {
            var me = this;
            var mesh = this.props.mesh;
            dialog.pop({
                contentProps: {
                    value: mesh.tc.materialEmissive,
                    onChange: function (value) {
                        mesh.tc.materialEmissive = value;
                        mesh.material.emissive.setHex(value);
                        me.context.dispatch('updateTimer');
                    }
                },
                content: ColorSetter,
                title: 'Please Choose Material Emissive'
            });
        },
        onWireframeChange: function (e) {
            this.props.mesh.material.wireframe = e.target.checked;
            this.context.dispatch('updateTimer');
        },
        onOpacityChange: function (e) {
            var value = e.target.value;
            this.setState({opacity: value});
            if (isNaN(value) || value === '') return;
            value = parseFloat(value);
            this.props.mesh.material.setValues({
                opacity: parseFloat(value),
                transparent: value < 1
            });
        },
        onSideChange: function (e) {
            this.props.mesh.material.setValues({
                side: ~~e.target.value
            });
            this.context.dispatch('updateTimer');
        },
        onTextureChange: function (e) {
            e.target.blur();
            var me = this;
            var mesh = this.props.mesh;
            io.uploadImage(e.target, 'image/').then(function (img) {
                if (mesh.material.map) {
                    mesh.material.map.image = img;
                }
                else {
                    mesh.material.map = new THREE.Texture(img);
                }
                mesh.material.map.needsUpdate = true;
                mesh.material.needsUpdate = true;
                me.context.dispatch('updateTimer');
            });
        },
        render: function () {
            var expendBtnIcon = this.props.expend ? 'icon-down' : 'icon-right';
            return (
                <div className="tc-meshlist">
                    <div className="tc-panel-title-bar">
                        <span className="tc-icon icon-close" onClick={this.onPanelCloseIconClick}></span>
                        <span className={'tc-icon ' + expendBtnIcon} onClick={this.onPanelToggleIconClick}></span>
                        Material Properties
                    </div>
                    <div className="tc-panel-content-container">
                        {this.props.expend ? editorFactory(this) : null}
                    </div>
                </div>
            );
        }
    });


    function editorFactory(me) {
        var mesh = me.props.mesh;
        var mtl = mesh.material;
        var color = mtl.color;
        var emissive = mtl.emissive;
        var colorContainerStyle = {
            border: '1px solid #FFF',
            padding: '4px',
            cursor: 'pointer'
        };
        var wireframeProps = {
            checked: mtl.wireframe,
            onChange: me.onWireframeChange
        };
        var opacityProps = {
            width: 100,
            value: me.state.opacity,
            type: 'float',
            fixed: 2,
            step: 0.1,
            onChange: me.onOpacityChange
        };
        var sideProps = {
            value: mtl.side,
            onChange: me.onSideChange,
            datasource: [
                {label: 'Front Side', value: THREE.FrontSide},
                {label: 'Back Side', value: THREE.BackSide},
                {label: 'Double Side', value: THREE.DoubleSide}
            ]
        };
        var fileSelectorPlaceholderProps = {
            className: 'file-selector-placeholder',
            style: {
                backgroundColor: me.props.mesh.material.map ? '#D97915' : 'transparent'
            }
        }
        return (
            <table className="tc-geometry-editor">
                <tr>
                    <td>type:</td>
                    <td>{mtl.type}</td>
                </tr>
                <tr>
                    <td>color:</td>
                    <td>
                        <span style={colorContainerStyle} onClick={me.onColorClick}>
                            {'R:' + formatRGB(color.r) + ' G:' + formatRGB(color.g) + ' B:' + formatRGB(color.b)}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>emissive:</td>
                    <td>
                        <span style={colorContainerStyle} onClick={me.onEmissiveChange}>
                            {'R:' + formatRGB(emissive.r) + ' G:' + formatRGB(emissive.g) + ' B:' + formatRGB(emissive.b)}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>texture:</td>
                    <td className="file-selector-container">
                        <span {...fileSelectorPlaceholderProps}>Browse</span>
                        <input type="file" value="" className="file-selector" onChange={me.onTextureChange}/>
                    </td>
                </tr>
                <tr>
                    <td>wireframe:</td>
                    <td><CheckBox {...wireframeProps}/></td>
                </tr>
                <tr>
                    <td>opacity:</td>
                    <td><NumberBox {...opacityProps}/></td>
                </tr>
                <tr>
                    <td>side:</td>
                    <td><Select {...sideProps}/></td>
                </tr>
            </table>
        );
    }


});
