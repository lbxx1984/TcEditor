/**
 * @file 快捷键帮助列表
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import Table from 'fcui2/Table.jsx';


const datasource = [
    {
        hotkey: 'Ctrl + O',
        info: 'Open file from browser storage.'
    },
    {
        hotkey: 'Ctrl + S',
        info: 'Save File.'
    },
    {
        hotkey: 'Ctrl + Shift + S',
        info: 'Save As'
    },
    {
        hotkey: 'Ctrl + Shift + I',
        info: 'Import file from os.'
    },
    {
        hotkey: 'Ctrl + Shift + E',
        info: 'Export file to os.'
    },
    {
        hotkey: 'Alt + 1',
        info: 'Switch to 3D stage.'
    },
    {
        hotkey: 'Alt + 2',
        info: 'Switch to XOZ stage.'
    },
    {
        hotkey: 'Alt + 3',
        info: 'Switch to XOY stage.'
    },
    {
        hotkey: 'Alt + 4',
        info: 'Switch to ZOY stage.'
    },
    {
        hotkey: 'Alt + 5',
        info: 'Display all stages.'
    },
    {
        hotkey: 'Ctrl + D',
        info: 'Activate mesh transformer'
    },
    {
        hotkey: 'Ctrl + F',
        info: 'Activate mesh morpher'
    },
    {
        hotkey: 'Ctrl + G',
        info: 'Activate light transformer'
    },
    {
        hotkey: 'Ctrl + E',
        info: 'Move the camera by dragging'
    },
    {
        hotkey: 'Ctrl + R',
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
        hotkey: 'F1',
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
        field: 'hotkey',
        width: 100,
        align: 'right'
    },
    {
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
