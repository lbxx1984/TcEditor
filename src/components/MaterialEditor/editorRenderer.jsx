/**
 * @file 材质编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import * as THREE from 'three';
import React from 'react';
import Button from 'tcui/Button';
import NumberBox from 'tcui/NumberBox';
import Select from 'tcui/Select';
import CheckBox from 'tcui/CheckBox';


function formatRGB(v) {
    return parseInt(v * 255, 10);
}


export default function MaterialMainEditor(me) {
    const mesh = me.props.mesh;
    const mtl = mesh.material;
    const color = new THREE.Color(mesh.tc.materialColor);
    const emissive = new THREE.Color(mesh.tc.materialEmissive);
    const wireframeProps = {
        checked: mtl.wireframe,
        onChange: me.onWireframeChange
    };
    const opacityProps = {
        value: me.state.opacity,
        type: 'float',
        fixed: 2,
        step: 0.1,
        min: 0,
        max: 1,
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
        className: 'file-selector-placeholder'
    };
    const textureClearBtnProps = {
        label: 'Clear',
        skin: 'trans',
        style: {
            position: 'relative',
            height: 28,
            top: 1
        },
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
                    <span className="color-picker" onClick={me.onColorClick}>
                        {'R:' + formatRGB(color.r) + ' G:' + formatRGB(color.g) + ' B:' + formatRGB(color.b)}
                    </span>
                </td>
            </tr>
            <tr>
                <td>emissive:</td>
                <td>
                    <span className="color-picker" onClick={me.onEmissiveChange}>
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
