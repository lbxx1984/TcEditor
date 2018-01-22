/**
 * @file 材质编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import * as THREE from 'three';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'fcui2/Dialog.jsx';
import ColorSetter from '../ColorSetter';
import io from '../../core/io';
import editorRenderer from './editorRenderer';


const dialog = new Dialog();

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
