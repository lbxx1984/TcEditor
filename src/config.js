/**
 * @file 主配置
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    return {
        stage: {
            colorStage: ['#3D3D3D', 0x3d3d3d],
            colorGrid: ['#8F908A', 0x8F908A],
            camera3D: {
                cameraRadius: 1000,
                cameraAngleA: 40,
                cameraAngleB: 45
            }
        },
        menu: [
            {
                label: 'File',
                children: [
                    {
                        label: 'Open　　　　　ctrl + o', value: 'file-open'
                    },
                    {
                        label: 'Save　　 　　　ctrl + s', value: 'file-save'
                    },
                    {
                        label: 'Save As　　　　ctrl + shift + s', value: 'file-saveAs'
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
                label: 'Geometry',
                children: [
                    {
                        label: 'Plane', value: 'geometry-plane'
                    }
                ]
            }
        ],
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
            'TOOLS',
            {
                icon: 'icon-yidong', value: 'tools-pickGeometry', title: 'pick up geometry (D)'
            },
            {
                icon: 'icon-shuxingxuanze', value: 'tools-pickJoint', title: 'pick up joints of geometry (F)'
            },
            {
                icon: 'icon-bulb', value: 'tools-pickLight', title: 'pick up light source (L)'
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
        ]
    };


});
