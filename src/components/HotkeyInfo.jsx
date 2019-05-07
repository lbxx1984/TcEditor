/**
 * @file 快捷键帮助列表
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import Table from 'tcui/Table';
import {KEY, IS_MAC} from '../config';

const datasource = [
    {
        hotkey: `${KEY.C}O`,
        info: 'Open file from browser storage.'
    },
    {
        hotkey: `${KEY.C}S`,
        info: 'Save File.'
    },
    {
        hotkey: `${KEY.C}${KEY.S}S`,
        info: 'Save As'
    },
    {
        hotkey: `${KEY.C}${KEY.S}I`,
        info: 'Import file from os.'
    },
    {
        hotkey: `${KEY.C}${KEY.S}O`,
        info: 'Export file to os.'
    },
    {
        hotkey: `${KEY.A}1`,
        info: 'Switch to 3D stage.'
    },
    {
        hotkey: `${KEY.A}2`,
        info: 'Switch to XOZ stage.'
    },
    {
        hotkey: `${KEY.A}3`,
        info: 'Switch to XOY stage.'
    },
    {
        hotkey: `${KEY.A}4`,
        info: 'Switch to ZOY stage.'
    },
    {
        hotkey: `${KEY.A}5`,
        info: 'Display all stages.'
    },
    {
        hotkey: `${KEY.C}D`,
        info: 'Activate mesh transformer'
    },
    {
        hotkey: `${KEY.C}F`,
        info: 'Activate mesh morpher'
    },
    {
        hotkey: `${KEY.C}G`,
        info: 'Activate light transformer'
    },
    {
        hotkey: `${KEY.C}E`,
        info: 'Move the camera by dragging'
    },
    {
        hotkey: `${KEY.A}Q`,
        info: 'Switch transformer working mode between translating and rotating.'
    },
    {
        hotkey: 'ESC',
        info: 'Unselect mesh or joint.'
    },
    {
        hotkey: 'Delete',
        info: 'Delete selected mesh'
    },
    {
        hotkey: IS_MAC ? `${KEY.C}H` : 'F1',
        info: 'See hotkey config.'
    },
    {
        hotkey: 'Arrow Down',
        info: 'Move the camera downward.'
    },
    {
        hotkey: 'Arrow Up',
        info: 'Move the camera upward.'
    },
    {
        hotkey: 'Arrow Left',
        info: 'Move the camera clockwise.'
    },
    {
        hotkey: 'Arrow Right',
        info: 'Move the camera anticlockwise.'
    }
];

const fields = [
    {
        label: 'hotkey',
        field: 'hotkey',
        width: 200,
        align: 'right'
    },
    {
        label: 'info',
        field: 'info',
        width: 500
    }
];


export default class HotkeyInfo extends Component {
    render() {
        return (
            <div style={{width: 600}}>
                <Table datasource={datasource} fieldConfig={fields} style={{margin: 10}}/>
            </div>
        );
    }
}
