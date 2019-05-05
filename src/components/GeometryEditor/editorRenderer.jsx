/**
 * @file 物体编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React from 'react';
import TextBox from 'tcui/TextBox';
import NumberBox from 'tcui/NumberBox';
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
            : (mesh.geometry.type.replace('Geometry', ' ') + mesh.tc.birth.format('DD/MM hh:mm:ss')),
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
        className: isNaN(me.state.step) || me.state.step === '' ? 'tcui-numberbox-reject' : '',
        width: 65,
        type: 'float',
        fixed: 2,
        value: me.state.step,
        onChange: me.onStepChange
    };
    const scaleXProps = {
        ...SCALE_EDITOR_PROPS,
        className: isScaleAvailable(me.state.scalex) ? '' : 'tcui-numberbox-reject',
        value: me.state.scalex,
        onChange: getScaleChangeHandler(me, 'x')
    };
    const scaleYProps = {
        ...SCALE_EDITOR_PROPS,
        className: isScaleAvailable(me.state.scaley) ? '' : 'tcui-numberbox-reject',
        value: me.state.scaley,
        onChange: getScaleChangeHandler(me, 'y')
    };
    const scaleZProps = {
        ...SCALE_EDITOR_PROPS,
        className: isScaleAvailable(me.state.scalez) ? '' : 'tcui-numberbox-reject',
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
                    x&nbsp;<NumberBox {...positionXProps}/><br/>
                    y&nbsp;<NumberBox {...positionYProps}/><br/>
                    z&nbsp;<NumberBox {...positionZProps}/>
                </td>
            </tr>
            <tr>
                <td>scale:</td>
                <td style={{lineHeight: '30px'}}>
                    x&nbsp;<NumberBox {...scaleXProps}/><br/>
                    y&nbsp;<NumberBox {...scaleYProps}/><br/>
                    z&nbsp;<NumberBox {...scaleZProps}/>
                </td>
            </tr>
            <tr>
                <td>rotation:</td>
                <td style={{lineHeight: '30px'}}>
                    <span style={{float: 'right'}}>
                        step:&nbsp;<NumberBox {...stepProps}/>&nbsp;
                    </span>
                    <div {...rotationContainerProps}>
                        <span data-type="X" data-value="-1" className="tc-icon tc-icon-left"/>x
                        <span data-type="X" data-value="1" className="tc-icon tc-icon-right"/><br/>
                        <span data-type="Y" data-value="-1" className="tc-icon tc-icon-left"/>y
                        <span data-type="Y" data-value="1" className="tc-icon tc-icon-right"/><br/>
                        <span data-type="Z" data-value="-1" className="tc-icon tc-icon-left"/>z
                        <span data-type="Z" data-value="1" className="tc-icon tc-icon-right"/>
                    </div>
                </td>
            </tr>
            {me.props.selectedVectorIndex > -1 ? vectorEditorRenderer(me) : null}
        </tbody></table>
    );
}
