/**
 * @file 主配置
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    return {
        arrestedHotKey: [
            'ctrl + o',
            'ctrl + s',
            'ctrl + d',
            'ctrl + f',
            'ctrl + g',
            'ctrl + e',
            'ctrl + r',
            'ctrl + t',
            'ctrl + i',
            'alt + e',
            'alt + d',
            'f1',
            'f5'
        ],
        editorTitle: 'TcEditor 5',
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
                        label: 'New', value: 'file-new'
                    },
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
                        label: 'Import', value: 'file-import', hotKey: 'ctrl + shift + i'
                    },
                    {
                        label: 'Export', value: 'file-export', hotKey: 'ctrl + shift + e'
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
                label: '3D', value: 'view-3d', title: '3D view (alt + 1)'
            },
            {
                label: 'XOZ', value: 'view-xoz', title: 'XOZ view (alt + 2)'
            },
            {
                label: 'XOY', value: 'view-xoy', title: 'XOY view (alt + 3)'
            },
            {
                label: 'ZOY', value: 'view-zoy', title: 'ZOY view (alt + 4)'
            },
            {
                icon: 'icon-screen4', value: 'view-all', title: 'ALL view (alt + 5)'
            },
            'TOOLS',
            {
                icon: 'icon-pickup-mesh', value: 'tool-pickGeometry', title: 'pick up geometry (ctrl + d)'
            },
            {
                icon: 'icon-pickup-joint', value: 'tool-pickJoint', title: 'pick up joint (ctrl + f)'
            },
            {
                icon: 'icon-light', value: 'tool-pickLight', title: 'pick up light (ctrl + g)'
            },
            'CAMERA',
            {
                icon: 'icon-trans', value: 'camera-move', title: 'move camera (ctrl + e)'
            },
            {
                icon: 'icon-zoom-in', value: 'camera-zoomIn', title: 'zoom in (MOUSE WHEEL UP)'
            },
            {
                icon: 'icon-zoom-out', value: 'camera-zoomOut', title: 'zoom out (MOUSE WHEEL DOWN)'
            },
            {
                icon: 'icon-reset', value: 'camera-reset', title: 'reset camera'
            },
            'GRID',
            {
                icon: 'icon-enlarge', value: 'stage-enlargeGrid', title: 'enlarge grid'
            },
            {
                icon: 'icon-narrow', value: 'stage-narrowGrid', title: 'narrow grid'
            },
            {
                icon: 'icon-visible', value: 'stage-helperVisible', title: 'hide/show stage helper'
            }
        ],
        // 变形工具集
        transformer3DTools: [
            {icon: 'icon-trans', value: 'transformer-3d-mode-translate', title: '(ctrl + r)'},
            {icon: 'icon-rotate', value: 'transformer-3d-mode-rotate', title: '(ctrl + r)'},
            {icon: 'icon-plus', value: 'transformer-3d-size-enlarge'},
            {icon: 'icon-minus', value: 'transformer-3d-size-narrow'},
            {icon: 'icon-earth', value: 'transformer-3d-space'}
        ],
        morpher3DTools: [
            {icon: 'icon-color', value: 'morpher-3d-anchor-color'},
            {icon: 'icon-plus', value: 'morpher-3d-size-enlarge'},
            {icon: 'icon-minus', value: 'morpher-3d-size-narrow'}
        ]
    };


});
