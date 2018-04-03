/**
 * @file 物体编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React from 'react';
import NumberBox from 'fcui2/src/NumberBox.jsx';
import {getVectorChangeHandler} from './getEditorHandlers';
import {POSITION_EDITOR_PROPS} from './config';


export default function vectorEditorRenderer(me) {
    const xProps = {
        ...POSITION_EDITOR_PROPS,
        value: me.state.vectorx,
        onChange: getVectorChangeHandler(me, 'x')
    };
    const yProps = {
        ...POSITION_EDITOR_PROPS,
        value: me.state.vectory,
        onChange: getVectorChangeHandler(me, 'y')
    };
    const zProps = {
        ...POSITION_EDITOR_PROPS,
        value: me.state.vectorz,
        onChange: getVectorChangeHandler(me, 'z')
    };
    return (
        <tr style={{marginTop: 5}}>
            <td>Vector:</td>
            <td style={{lineHeight: '30px'}}>
                <NumberBox {...xProps}/>&nbsp;x<br/>
                <NumberBox {...yProps}/>&nbsp;y<br/>
                <NumberBox {...zProps}/>&nbsp;z
            </td>
        </tr>
    );
}
