define(function (require) {
    return [
        {
            label: 'VIEWS',
            enable: 'always',
            children: [
                {
                    label: '3D', class: '', cmd: 'view-3d', title: '3D view (1)',
                    type: 'radio', group: 'cameraview', value: '3d'
                },
                {
                    label: 'XOZ', class: '', cmd: 'view-xoz', title: 'XOZ view (2)',
                    type: 'radio', group: 'cameraview', value: 'xoz'
                },
                {
                    label: 'XOY', class: '', cmd: 'view-xoy', title: 'XOY view (3)',
                    type: 'radio', group: 'cameraview', value: 'xoy'
                },
                {
                    label: 'ZOY', class: '', cmd: 'view-zoy', title: 'ZOY view (4)',
                    type: 'radio', group: 'cameraview', value: 'zoy'
                }
            ]
        },
        {
            label: 'TOOLS',
            enable: 'always',
            children: [
                {
                    label: '', class: ' icon icon-yidong', cmd: 'mouse-pickgeo',
                    type: 'radio', group: 'systemtool', value: 'pickgeo', title: 'pick up geometry (D)'
                },
                {
                    label: '', class: ' icon icon-shuxingxuanze', cmd: 'mouse-pickjoint',
                    type: 'radio', group: 'systemtool', value: 'pickjoint', title: 'pick up joints of geometry (F)'
                },
                {
                    label: '', class: ' icon icon-bulb', cmd: 'mouse-picklight',
                    type: 'radio', group: 'systemtool', value: 'picklight', title: 'pick up light source (L)',
                    disable: {cameraview: 'xoy;xoz;zoy;'}
                }
            ]
        },
        {
            label: 'CAMERA',
            enable: 'always',
            children: [
                {
                    label: '', class: ' icon icon-yidong1', cmd: 'mouse-cameramove',
                    type: 'radio', group: 'systemtool', value: 'cameramove', title: 'move camera (W)'
                },
                {
                    label: '', class: ' icon icon-fangda', cmd: 'tool-camerazoomin',
                    type: 'button', title: 'zoom in (MOUSE WHEEL UP)'
                },
                {
                    label: '', class: ' icon icon-suoxiao', cmd: 'tool-camerazoomout',
                    type: 'button', title: 'zoom out (MOUSE WHEEL DOWN)'
                }
            ]
        },
        {
            label: 'GRID',
            enable: 'always',
            children: [
                {
                    label: '', class: ' icon icon-pingmufangda', cmd: 'tool-gridenlarge',
                    type: 'button', title: 'enlarge grid',
                    disable: {cameraview: 'xoy;xoz;zoy;'}
                },
                {
                    label: '', class: ' icon icon-pingmusuoxiao', cmd: 'tool-gridnarrow',
                    type: 'button', titel: 'narrow grid',
                    disable: {cameraview: 'xoy;xoz;zoy;'}
                },
                {
                    label: '', class: ' icon', cmd: 'tool-gridtoggle',
                    type: 'checkbox', title: 'hide/show grid', value: 0,
                    styles: [' icon-kejian', ' icon-bukejian']  
                }
            ]
        },
        {
            label: 'TRANSFORMER',
            enable: 'transformer',
            children: [
                {
                    label: '', class: ' icon icon-move', cmd: 'trans-move',
                    type: 'radio', group: 'transformer', value: 'move', title: 'move (E)'
                },
                {
                    label: '', class: ' icon icon-llfilterrotate', cmd: 'trans-rotate',
                    type: 'radio', group: 'transformer', value: 'rotate', title: 'rotate (R)',
                    disable: {cameraview: 'xoy;xoz;zoy;'}
                },
                {
                    label: '', class: ' icon icon-icicfangdatubiao', cmd: 'trans-scale',
                    type: 'radio', group: 'transformer', value: 'scale', title: 'scale (T)',
                    disable: {cameraview: 'xoy;xoz;zoy;'}
                },
                {
                    label: '', class: ' icon icon-jiafangda', cmd: 'trans-enlarge',
                    type: 'button', titel: 'enlarge transformer (=)'
                },
                {
                    label: '', class: ' icon icon-jiansuoxiao', cmd: 'trans-narrow',
                    type: 'button', titel: 'narrow transformer (-)'
                },
                {
                    label: '', class: ' icon icon-world', cmd: 'trans-coordinatetoggle',
                    type: 'radio', group: 'transformerspace', value: 'world',
                    title: 'toggle world/local coordinate (G)',
                    disable: {
                        transformer: 'scale;',
                        cameraview: 'xoy;xoz;zoy;'
                    }
                }
            ]
        }
    ];
});
