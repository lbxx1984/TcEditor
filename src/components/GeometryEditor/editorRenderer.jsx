/**
 * @file 物体编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React from 'react';
import util from 'fcui2/src/core/util';
import TextBox from 'fcui2/src/TextBox.jsx';
import NumberBox from 'fcui2/src/NumberBox.jsx';
import {getPositionChangeHandler, getScaleChangeHandler} from './getEditorHandlers';
import {POSITION_EDITOR_PROPS, SCALE_EDITOR_PROPS} from './config';
import vectorEditorRenderer from './vectorEditorRenderer';
import isScaleAvailable from './isScaleAvailable';


export default function GeometryMainEditor (me) {
    const mesh = me.props.mesh;
    const geo = mesh.geometry;
    const nameEditorProps = {
        value: typeof mesh.tc.name === 'string'
            ? mesh.tc.name
            : (mesh.geometry.type.replace('Geometry', ' ') + util.dateFormat(mesh.tc.birth, 'DD/MM hh:mm:ss')),
        onChange: me.onNameChange
    };
    const positionXProps = {
        ...POSITION_EDITOR_PROPS,
        value: me.state.posx,
        onChange: getPositionChangeHandler(me, 'x')
    };
    const positionYProps = {
        ...POSITION_EDITOR_PROPS,
        value: me.state.posy,
        onChange: getPositionChangeHandler(me, 'y')
    };
    const positionZProps = {
        ...POSITION_EDITOR_PROPS,
        value: me.state.posz,
        onChange: getPositionChangeHandler(me, 'z')
    };
    const rotationContainerProps = {
        onMouseDown: me.onRotationMouseDown,
        onMouseUp: me.onRotationMouseUp,
        onMouseMove: me.onRotationMouseUp
    };
    const stepProps = {
        className: isNaN(me.state.step) || me.state.step === '' ? 'fcui2-numberbox-reject' : '',
        width: 65,
        type: 'float',
        fixed: 2,
        value: me.state.step,
        onChange: me.onStepChange
    };
    const scaleXProps = {
        ...SCALE_EDITOR_PROPS,
        className: isScaleAvailable(me.state.scalex) ? '' : 'fcui2-numberbox-reject',
        value: me.state.scalex,
        onChange: getScaleChangeHandler(me, 'x')
    };
    const scaleYProps = {
        ...SCALE_EDITOR_PROPS,
        className: isScaleAvailable(me.state.scaley) ? '' : 'fcui2-numberbox-reject',
        value: me.state.scaley,
        onChange: getScaleChangeHandler(me, 'y')
    };
    const scaleZProps = {
        ...SCALE_EDITOR_PROPS,
        className: isScaleAvailable(me.state.scalez) ? '' : 'fcui2-numberbox-reject',
        value: me.state.scalez,
        onChange: getScaleChangeHandler(me, 'z')
    };
    return (
        <table className="tc-geometry-editor"><tbody>
            <tr>
                <td>type:</td>
                <td>{geo.type}</td>
            </tr>
            <tr>
                <td>name:</td>
                <td><TextBox {...nameEditorProps}/></td>
            </tr>
            <tr style={{marginTop: 5}}>
                <td>position:</td>
                <td style={{lineHeight: '30px'}}>
                    <NumberBox {...positionXProps}/>&nbsp;x<br/>
                    <NumberBox {...positionYProps}/>&nbsp;y<br/>
                    <NumberBox {...positionZProps}/>&nbsp;z
                </td>
            </tr>
            <tr>
                <td>scale:</td>
                <td style={{lineHeight: '30px'}}>
                    <NumberBox {...scaleXProps}/>&nbsp;x<br/>
                    <NumberBox {...scaleYProps}/>&nbsp;y<br/>
                    <NumberBox {...scaleZProps}/>&nbsp;z
                </td>
            </tr>
            <tr>
                <td>rotation:</td>
                <td style={{lineHeight: '30px'}}>
                    <span style={{float: 'right'}}>
                        step:&nbsp;<NumberBox {...stepProps}/>&nbsp;
                    </span>
                    <div {...rotationContainerProps}>
                        <span data-type="X" data-value="-1" className="tc-icon tc-icon-left"></span>x
                        <span data-type="X" data-value="1" className="tc-icon tc-icon-right"></span><br/>
                        <span data-type="Y" data-value="-1" className="tc-icon tc-icon-left"></span>y
                        <span data-type="Y" data-value="1" className="tc-icon tc-icon-right"></span><br/>
                        <span data-type="Z" data-value="-1" className="tc-icon tc-icon-left"></span>z
                        <span data-type="Z" data-value="1" className="tc-icon tc-icon-right"></span>
                    </div>
                </td>
            </tr>
            {me.props.selectedVectorIndex > -1 ? vectorEditorRenderer(me) : null}
        </tbody></table>
    );
}
