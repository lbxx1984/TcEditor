define(function (Require) {
    return [
        {
            label: 'VIEWS',
            enable: 'always',
            children: [
                {
                    label: '3D', class: '', cmd: 'view-3d', title: 'Press (1)',
                    type: 'radio', group: 'cameraview', value: '3d'
                },
                {
                    label: 'XOZ', class: '', cmd: 'view-xoz', title: 'Press (2)',
                    type: 'radio', group: 'cameraview', value: 'xoz'
                },
                {
                    label: 'XOY', class: '', cmd: 'view-xoy', title: 'Press (3)',
                    type: 'radio', group: 'cameraview', value: 'xoy'
                },
                {
                    label: 'ZOY', class: '', cmd: 'view-zoy', title: 'Press (4)',
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
                    type: 'radio', group: 'systemtool', value: 'pickgeo', title: 'pick up geometry (S)'
                },
                {
                    label: '', class: ' icon icon-shuxingxuanze', cmd: 'mouse-pickjoint',
                    type: 'radio', group: 'systemtool', value: 'pickjoint', title: 'pick up joints of geometry (B)'
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
                    type: 'radio', group: 'systemtool', value: 'cameramove', title: 'move camera (M)'
                },
                {
                    label: '', class: ' icon icon-fangda', cmd: 'tool-camerazoomin',
                    type: 'button', title: 'zoom in (MOUSE WHEEL)'
                },
                {
                    label: '', class: ' icon icon-suoxiao', cmd: 'tool-camerazoomout',
                    type: 'button', title: 'zoom out (MOUSE WHEEL)'
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
                    styles: [' icon-kejian', ' icon-bukejian2']  
                }
            ]
        },
        {
            label: 'TRANSFORMER',
            enable: 'transformer',
            children: [
                {
                    label: '', class: ' icon icon-yidong', cmd: 'mouse-pickgeo',
                    type: 'radio', group: 'systemtool', value: 'pickgeo', title: 'pick up geometry (S)'
                },
                {
                    label: '', class: ' icon icon-move', cmd: 'trans-move',
                    type: 'radio', group: 'transformer', value: 'move', title: 'move'
                },
                {
                    label: '', class: ' icon icon-llfilterrotate', cmd: 'trans-rotate',
                    type: 'radio', group: 'transformer', value: 'rotate', title: 'rotate',
                    disable: {cameraview: 'xoy;xoz;zoy;'}
                },
                {
                    label: '', class: ' icon icon-icicfangdatubiao', cmd: 'trans-scale',
                    type: 'radio', group: 'transformer', value: 'scale', title: 'scale',
                    disable: {cameraview: 'xoy;xoz;zoy;'}
                },
                {
                    label: '', class: ' icon icon-jiafangda', cmd: 'trans-enlarge',
                    type: 'button', titel: 'enlarge transformer'
                },
                {
                    label: '', class: ' icon icon-jiansuoxiao', cmd: 'trans-narrow',
                    type: 'button', titel: 'narrow transformer'
                },
                {
                    label: '', class: ' icon icon-world', cmd: 'trans-coordinatetoggle',
                    type: 'radio', group: 'transformerspace', value: 'world',
                    title: 'toggle world/local coordinate',
                    disable: {
                        transformer: 'scale;',
                        cameraview: 'xoy;xoz;zoy;'
                    }
                }
            ]
        }
    ];
});