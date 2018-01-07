/**
 * @file 材质编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import * as THREE from 'three';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'fcui2/Dialog.jsx';
import NumberBox from 'fcui2/NumberBox.jsx';
import Select from 'fcui2/Select.jsx';
import CheckBox from 'fcui2/CheckBox.jsx';
import Button from 'fcui2/Button.jsx';
import ColorSetter from './dialogContent/ColorSetter.jsx';
import io from '../core/io';


const dialog = new Dialog();

function formatRGB(v) {
    return parseInt(v * 255, 10);
}

function getMtlParam(props) {
    const mesh = props.mesh;
    const dataset = {opacity: 1};
    if (!mesh) return dataset;
    dataset.opacity = parseFloat(mesh.tc.materialOpacity).toFixed(2) * 1
    return dataset;
}

function shouldUpdateEditor(nextProps, props) {
    return nextProps.mesh && (nextProps.timer !== props.timer || nextProps.mesh !== props.mesh);
}


export default class MaterialEditor extends Component {

    static contextTypes = {
        dispatch: PropTypes.func
    }

    static propTypes = {
        type: PropTypes.string.isRequired,
        expend: PropTypes.bool.isRequired,
        mesh: PropTypes.object
    }

    static defaultProps = {
        mesh: {}
    }

    constructor(props) {
        super(props);
        this.onPanelCloseIconClick = this.onPanelCloseIconClick.bind(this);
        this.onPanelToggleIconClick = this.onPanelToggleIconClick.bind(this);
        this.onColorClick = this.onColorClick.bind(this);
        this.onEmissiveChange = this.onEmissiveChange.bind(this);
        this.onWireframeChange = this.onWireframeChange.bind(this);
        this.onOpacityChange = this.onOpacityChange.bind(this);
        this.onSideChange = this.onSideChange.bind(this);
        this.onTextureChange = this.onTextureChange.bind(this);
        this.onTextureClear = this.onTextureClear.bind(this);
        this.state = {
            ...getMtlParam(props)
        };
    }

    componentWillReceiveProps(nextProps) {
        if (shouldUpdateEditor(nextProps, this.props)) {
            this.setState(getMtlParam(nextProps));
        }
    }

    onPanelCloseIconClick() {
        this.context.dispatch('view-close-panel', this.props.type);
    }

    onPanelToggleIconClick() {
        this.context.dispatch('view-toggle-panel', this.props.type);
    }

    onColorClick() {
        const mesh = this.props.mesh;
        dialog.pop({
            contentProps: {
                value: mesh.tc.materialColor,
                onChange: value => {
                    mesh.tc.materialColor = value;
                    mesh.material.color.setHex(value);
                    this.context.dispatch('updateTimer');
                }
            },
            content: ColorSetter,
            title: 'Please Choose Material Color'
        });
    }

    onEmissiveChange() {
        const mesh = this.props.mesh;
        dialog.pop({
            contentProps: {
                value: mesh.tc.materialEmissive,
                onChange: value => {
                    mesh.tc.materialEmissive = value;
                    mesh.material.emissive.setHex(value);
                    this.context.dispatch('updateTimer');
                }
            },
            content: ColorSetter,
            title: 'Please Choose Material Emissive'
        });
    }

    onWireframeChange(e) {
        this.props.mesh.material.wireframe = e.target.checked;
        this.context.dispatch('updateTimer');
    }

    onOpacityChange(e) {
        let value = e.target.value;
        const mesh = this.props.mesh;
        this.setState({opacity: value});
        if (isNaN(value) || value === '') return;
        value = parseFloat(value);
        mesh.tc.materialOpacity = value;
        mesh.material.setValues({
            opacity: parseFloat(value),
            transparent: value < 1
        });
    }

    onSideChange(e) {
        this.props.mesh.material.setValues({
            side: ~~e.target.value
        });
        this.context.dispatch('updateTimer');
    }

    onTextureChange(e) {
        e.target.blur();
        const mesh = this.props.mesh;
        io.uploadImage(e.target, 'image/').then(img => {
            if (mesh.material.map) {
                mesh.material.map.image = img;
            }
            else {
                mesh.material.map = new THREE.Texture(img);
            }
            mesh.material.map.needsUpdate = true;
            mesh.material.needsUpdate = true;
            this.context.dispatch('updateTimer');
        });
    }

    onTextureClear() {
        const mesh = this.props.mesh;
        mesh.material.map = null;
        mesh.material.needsUpdate = true;
    }

    render() {
        const expendBtnIcon = this.props.expend ? 'tc-icon-down' : 'tc-icon-right';
        return (
            <div className="tc-meshlist">
                <div className="tc-panel-title-bar">
                    <span className="tc-icon tc-icon-close" onClick={this.onPanelCloseIconClick}></span>
                    <span className={'tc-icon ' + expendBtnIcon} onClick={this.onPanelToggleIconClick}></span>
                    Material Properties
                </div>
                <div className="tc-panel-content-container">
                    {this.props.expend ? editorRenderer(this) : null}
                </div>
            </div>
        );
    }
}


function editorRenderer(me) {
    const mesh = me.props.mesh;
    const mtl = mesh.material;
    const color = new THREE.Color(mesh.tc.materialColor);
    const emissive = new THREE.Color(mesh.tc.materialEmissive);
    const colorContainerStyle = {
        border: '1px solid #FFF',
        padding: '4px',
        cursor: 'pointer'
    };
    const wireframeProps = {
        checked: mtl.wireframe,
        onChange: me.onWireframeChange
    };
    const opacityProps = {
        width: 100,
        value: me.state.opacity,
        type: 'float',
        fixed: 2,
        step: 0.1,
        onChange: me.onOpacityChange
    };
    const sideProps = {
        value: mtl.side,
        onChange: me.onSideChange,
        datasource: [
            {label: 'Front Side', value: THREE.FrontSide},
            {label: 'Back Side', value: THREE.BackSide},
            {label: 'Double Side', value: THREE.DoubleSide}
        ]
    };
    const fileSelectorPlaceholderProps = {
        className: 'file-selector-placeholder',
        style: {
            backgroundColor: mesh.material.map ? '#D97915' : 'transparent'
        }
    };
    const textureClearBtnProps = {
        label: 'Clear',
        skin: 'trans',
        onClick: me.onTextureClear
    };
    return (
        <table className="tc-geometry-editor"><tbody>
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
        </tbody></table>
    );
}
