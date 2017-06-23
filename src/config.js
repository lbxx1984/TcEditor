/**
 * @file 主配置
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    return {
        // 物体主要色配置
        colors: {
            normalMeshHover: [0xffff00, '#d97915'],
            selectedMesh: [0xd97915, '#d97915']
        },
        // 菜单配置
        menu: [
            {
                label: 'File',
                children: [
                    {
                        label: 'Open', value: 'file-open', hotKey: 'ctrl + o'
                    },
                    {
                        label: 'Save', value: 'file-save', hotKey: 'ctrl + s'
                    },
                    {
                        label: 'Save As', value: 'file-saveAs', hotKey: 'ctrl + shift + s'
                    },
                    {
                        label: 'Import', value: 'file-import'
                    },
                    {
                        label: 'Export', value: 'file-export'
                    }
                ]
            },
            {
                label: 'View',
                key: 'view',
                children: [
                    {
                        label: 'Mesh List', value: 'view-meshPanel', key: 'meshPanel'
                    },
                    {
                        label: 'Light List', value: 'view-lightPanel', key: 'lightPanel'
                    },
                    {
                        label: 'Geometry Editor', value: 'view-geoEditor', key: 'geoEditor'
                    },
                    {
                        label: 'Material Editor', value: 'view-mtlEditor', key: 'mtlEditor'
                    }
                ]
            },
            {
                label: 'Geometry',
                children: [
                    {
                        label: 'Plane', value: 'geometry-plane;tool'
                    }
                ]
            }
        ],
        // 命令栏配置
        command: [
            'VIEWS',
            {
                label: '3D', value: 'view-3d', title: '3D view (1)'
            },
            {
                label: 'XOZ', value: 'view-xoz', title: 'XOZ view (2)'
            },
            {
                label: 'XOY', value: 'view-xoy', title: 'XOY view (3)'
            },
            {
                label: 'ZOY', value: 'view-zoy', title: 'ZOY view (4)'
            },
            {
                icon: 'icon-siping', value: 'view-all', title: 'ALL view (5)'
            },
            'TOOLS',
            {
                icon: 'icon-yidong', value: 'tool-pickGeometry', title: 'pick up geometry (D)'
            },
            {
                icon: 'icon-shuxingxuanze', value: 'tool-pickJoint', title: 'pick up joints of geometry (F)'
            },
            {
                icon: 'icon-bulb', value: 'tool-pickLight', title: 'pick up light source (L)'
            },
            'CAMERA',
            {
                icon: 'icon-yidong1', value: 'camera-move', title: 'move camera (M)'
            },
            {
                icon: 'icon-fangda', value: 'camera-zoomIn', title: 'zoom in (MOUSE WHEEL UP)'
            },
            {
                icon: 'icon-suoxiao', value: 'camera-zoomOut', title: 'zoom out (MOUSE WHEEL DOWN)'
            },
            {
                icon: 'icon-reset', value: 'camera-reset', title: 'reset camera'
            },
            'GRID',
            {
                icon: 'icon-pingmufangda', value: 'stage-enlargeGrid', title: 'enlarge grid'
            },
            {
                icon: 'icon-pingmusuoxiao', value: 'stage-narrowGrid', title: 'narrow grid'
            },
            {
                icon: 'icon-kejian', value: 'stage-helperVisible', title: 'hide/show stage helper'
            }
        ],
        // 变形工具集
        transformer3DTools: [
            {icon: 'icon-move', value: 'transformer-3d-mode-translate'},
            {icon: 'icon-llfilterrotate', value: 'transformer-3d-mode-rotate'},
            // 这个工具不好用，变化太剧烈，暂时下线
            // {icon: 'icon-icicfangdatubiao', value: 'transformer-3d-mode-scale'},
            {icon: 'icon-jiafangda', value: 'transformer-3d-size-enlarge'},
            {icon: 'icon-jiansuoxiao', value: 'transformer-3d-size-narrow'},
            {icon: 'icon-world', value: 'transformer-3d-space'}
        ],
        morpher3DTools: [
            {icon: 'icon-color', value: 'morpher-3d-anchor-color'},
            {icon: 'icon-jiafangda', value: 'morpher-3d-size-enlarge'},
            {icon: 'icon-jiansuoxiao', value: 'morpher-3d-size-narrow'}
        ]
    };


});
