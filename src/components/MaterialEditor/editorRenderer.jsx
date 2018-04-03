/**
 * @file 材质编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import * as THREE from 'three';
import React from 'react';
import Button from 'fcui2/src/Button.jsx';
import NumberBox from 'fcui2/src/NumberBox.jsx';
import Select from 'fcui2/src/Select.jsx';
import CheckBox from 'fcui2/src/CheckBox.jsx';


function formatRGB(v) {
    return parseInt(v * 255, 10);
}


export default function MaterialMainEditor(me) {
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
