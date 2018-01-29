/**
 * @file 主配置
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export const SELECTED_MESH_OPACITY = 1;
export const CAMERA_RADIUS_FOR_2D_SCALE = 0.5;

export default {
    // 浏览器显示的默认标题
    editorTitle: 'TcEditor 5',
    // 需要阻止默认行为的快捷键
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
                    label: 'Open', value: 'file-open', hotKey: 'Ctrl + O'
                },
                {
                    label: 'Save', value: 'file-save', hotKey: 'Ctrl + S'
                },
                {
                    label: 'Save As', value: 'file-saveAs', hotKey: 'Ctrl + Shift + S'
                },
                {
                    label: 'Import', value: 'file-import', hotKey: 'Ctrl + Shift + I'
                },
                {
                    label: 'Export', value: 'file-export', hotKey: 'Ctrl + Shift + E'
                }
            ]
        },
        {
            label: 'View',
            key: 'view',
            children: [
                {
                    label: 'Mesh List', value: 'openPanel meshPanel', key: 'meshPanel'
                },
                {
                    label: 'Light List', value: 'openPanel lightPanel', key: 'lightPanel'
                },
                {
                    label: 'Geometry Editor', value: 'openPanel geoEditor', key: 'geoEditor'
                },
                {
                    label: 'Material Editor', value: 'openPanel mtlEditor', key: 'mtlEditor'
                }
            ]
        },
        {
            label: 'Geometry',
            children: [
                {
                    label: 'Plane', value: 'changeTool createPlane'
                },
                {
                    label: 'Sphere', value: 'changeTool createSphere'
                }
            ]
        },
        {
            label: 'Help',
            children: [
                {
                    label: 'Hotkey', value: 'popHotkeyInfo', hotKey: 'F1'
                }
            ]
        }
    ],
    // 命令栏配置
    command: [
        'VIEWS',
        {
            label: '3D', value: 'changeView 3d', title: '3D view (Alt + 1)'
        },
        {
            label: 'XOZ', value: 'changeView xoz', title: 'XOZ view (Alt + 2)'
        },
        {
            label: 'XOY', value: 'changeView xoy', title: 'XOY view (Alt + 3)'
        },
        {
            label: 'ZOY', value: 'changeView zoy', title: 'ZOY view (Alt + 4)'
        },
        {
            icon: 'tc-icon-screen4', value: 'changeView all', title: 'ALL view (Alt + 5)'
        },
        'TOOLS',
        {
            icon: 'tc-icon-pickup-mesh', value: 'changeTool pickMesh', title: 'pick up geometry (Ctrl + D)'
        },
        {
            icon: 'tc-icon-pickup-joint', value: 'changeTool pickJoint', title: 'pick up joint (Ctrl + F)'
        },
        {
            icon: 'tc-icon-light', value: 'pickLight', title: 'pick up light (Ctrl + G)'
        },
        'CAMERA',
        {
            icon: 'tc-icon-trans', value: 'moveCamera', title: 'move camera (Ctrl + E)'
        },
        {
            icon: 'tc-icon-zoom-in', value: 'zoomInCamera', title: 'zoom in (MOUSE WHEEL UP)'
        },
        {
            icon: 'tc-icon-zoom-out', value: 'zoomOutCamera', title: 'zoom out (MOUSE WHEEL DOWN)'
        },
        {
            icon: 'tc-icon-reset', value: 'resetCamera', title: 'reset camera'
        },
        'GRID',
        {
            icon: 'tc-icon-enlarge', value: 'enlargeGrid', title: 'enlarge grid'
        },
        {
            icon: 'tc-icon-narrow', value: 'narrowGrid', title: 'narrow grid'
        },
        {
            icon: 'tc-icon-visible', value: 'toggleHelper', title: 'hide/show stage helper'
        }
    ],
    // 变形工具集
    transformer3DTools: [
        {icon: 'tc-icon-trans', value: 'setTransformerMode translate', title: '(Ctrl + R)'},
        {icon: 'tc-icon-rotate', value: 'setTransformerMode rotate', title: '(Ctrl + R)'},
        {icon: 'tc-icon-plus', value: 'setTransformerSize enlarge'},
        {icon: 'tc-icon-minus', value: 'setTransformerSize'},
        {icon: 'tc-icon-earth', value: 'toggleTransformerSpace space'}
    ],
    morpher3DTools: [
        {icon: 'tc-icon-color', value: 'morpher-3d-anchor-color'},
        {icon: 'tc-icon-plus', value: 'morpher-3d-size-enlarge'},
        {icon: 'tc-icon-minus', value: 'morpher-3d-size-narrow'}
    ]
}
