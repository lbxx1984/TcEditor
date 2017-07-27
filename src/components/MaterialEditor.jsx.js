/**
 * @file 材质编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    const THREE = require('three');
    const React = require('react');
    const Dialog = require('fcui2/Dialog.jsx');
    const NumberBox = require('fcui2/NumberBox.jsx');
    const Select = require('fcui2/Select.jsx');
    const CheckBox = require('fcui2/CheckBox.jsx');
    const Button = require('fcui2/Button.jsx');
    const ColorSetter = require('./dialogContent/ColorSetter.jsx');
    const _ = require('underscore');
    const io = require('../core/io');
    const dialog = new Dialog();


    function formatRGB(v) {
        return parseInt(v * 255, 10);
    }


    function getMtlParam(props) {
        let mesh = props.mesh;
        let dataset = {opacity: 1};
        if (!mesh) dataset;
        dataset.opacity = parseFloat(mesh.material.opacity).toFixed(2) * 1
        return dataset;
    }


    return React.createClass({
        // @override
        contextTypes: {
            dispatch: React.PropTypes.func
        },
        getInitialState() {
            return _.extend({}, getMtlParam(this.props));
        },
        componentWillReceiveProps(nextProps) {
            if (!nextProps.mesh) return;
            if (nextProps.timer !== this.props.timer || nextProps.mesh !== this.props.mesh) {
                this.setState(getMtlParam(nextProps));
                return;
            }
        },
        onPanelCloseIconClick() {
            this.context.dispatch('view-close-panel', this.props.type);
        },
        onPanelToggleIconClick() {
            this.context.dispatch('view-toggle-panel', this.props.type);
        },
        onColorClick() {
            let me = this;
            let mesh = this.props.mesh;
            dialog.pop({
                contentProps: {
                    value: mesh.tc.materialColor,
                    onChange(value) {
                        mesh.tc.materialColor = value;
                        mesh.material.color.setHex(value);
                        me.context.dispatch('updateTimer');
                    }
                },
                content: ColorSetter,
                title: 'Please Choose Material Color'
            });
        },
        onEmissiveChange() {
            let me = this;
            let mesh = this.props.mesh;
            dialog.pop({
                contentProps: {
                    value: mesh.tc.materialEmissive,
                    onChange(value) {
                        mesh.tc.materialEmissive = value;
                        mesh.material.emissive.setHex(value);
                        me.context.dispatch('updateTimer');
                    }
                },
                content: ColorSetter,
                title: 'Please Choose Material Emissive'
            });
        },
        onWireframeChange(e) {
            this.props.mesh.material.wireframe = e.target.checked;
            this.context.dispatch('updateTimer');
        },
        onOpacityChange(e) {
            let value = e.target.value;
            this.setState({opacity: value});
            if (isNaN(value) || value === '') return;
            value = parseFloat(value);
            this.props.mesh.material.setValues({
                opacity: parseFloat(value),
                transparent: value < 1
            });
        },
        onSideChange(e) {
            this.props.mesh.material.setValues({
                side: ~~e.target.value
            });
            this.context.dispatch('updateTimer');
        },
        onTextureChange(e) {
            e.target.blur();
            let me = this;
            let mesh = this.props.mesh;
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
        onTextureClear() {
            let mesh = this.props.mesh;
            mesh.material.map = null;
            mesh.material.needsUpdate = true;
        },
        render() {
            let expendBtnIcon = this.props.expend ? 'icon-down' : 'icon-right';
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
        let mesh = me.props.mesh;
        let mtl = mesh.material;
        let color = new THREE.Color(mesh.tc.materialColor);
        let emissive = new THREE.Color(mesh.tc.materialEmissive);
        let colorContainerStyle = {
            border: '1px solid #FFF',
            padding: '4px',
            cursor: 'pointer'
        };
        let wireframeProps = {
            checked: mtl.wireframe,
            onChange: me.onWireframeChange
        };
        let opacityProps = {
            width: 100,
            value: me.state.opacity,
            type: 'float',
            fixed: 2,
            step: 0.1,
            onChange: me.onOpacityChange
        };
        let sideProps = {
            value: mtl.side,
            onChange: me.onSideChange,
            datasource: [
                {label: 'Front Side', value: THREE.FrontSide},
                {label: 'Back Side', value: THREE.BackSide},
                {label: 'Double Side', value: THREE.DoubleSide}
            ]
        };
        let fileSelectorPlaceholderProps = {
            className: 'file-selector-placeholder',
            style: {
                backgroundColor: me.props.mesh.material.map ? '#D97915' : 'transparent'
            }
        };
        let textureClearBtnProps = {
            label: 'Clear',
            skin: 'trans',
            onClick: me.onTextureClear
        };
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
                    <td>
                        <div className="file-selector-container">
                            <span {...fileSelectorPlaceholderProps}>Browse</span>
                            <input type="file" value="" className="file-selector" onChange={me.onTextureChange}/>
                        </div>
                        <Button {...textureClearBtnProps}/>
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
