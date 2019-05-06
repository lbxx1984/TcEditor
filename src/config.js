/**
 * @file 主配置
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import {PointLight} from 'three';

const defaultLight = new PointLight(0xffffff);
defaultLight.position.set(0, 2000, 0);
defaultLight.tc = {birth: new Date(), add: true};


export const SELECTED_MESH_OPACITY = 1;
export const CAMERA_RADIUS_FOR_2D_SCALE = 0.5;
export const EMPTY_EDITOR_DATASET = {
    // 系统稳定态时间戳
    timer: 0,
    // 本地文件系统的目录前缀
    rootPrefix: '/__tceditor__',
    // 本地文件系统的目录
    root: '',
    // 当前打开的文件绝对路径
    path: '',
    // 保存时的模型压缩等级：0，不压缩；2，vectory保留两位小数；4，vectory保留四位小数
    compressMode: 2,
    // 舞台中的物体hash
    mesh3d: {},
    // 舞台中的灯光hash
    lights: {defaultLight},
    // 当前选中的物体
    selectedMesh: null,
    // 当前选中的物体的关节
    selectedVector: null,
    // 当前选中的物体关节的索引号
    selectedVectorIndex: -1,
    // 当前选中的灯光
    selectedLight: null,
    // 当前激活的分组，物体默认会被添加到这个分组里
    activeGroup: 'default group',
    // 右侧处于显示状态的工作卡片
    panel: [
        // {type: 'meshPanel', expend: true},
        // {type: 'geoEditor', expend: true}
        // {type: 'mtlEditor', expend: true}
    ],
    // 物体分组信息
    group: [
        {label: 'default group', expend: true}
    ],
    // 舞台配置信息
    stage: {
        // 舞台背景色
        colorStage: ['#3D3D3D', 0x3d3d3d],
        // 舞台坐标纸颜色
        colorGrid: ['#8F908A', 0x8F908A],
        // 3D摄像机配置
        camera3D: {
            // 摄像机到观察点的距离，可以理解为焦距
            cameraRadius: 2500,
            // 摄像机视线与XOZ平面夹角
            cameraAngleA: 40,
            // 摄像机视线在XOZ平面投影与X轴夹角
            cameraAngleB: 45,
            // 摄像机观察点
            lookAt: {x: 0, y: 0, z: 0}
        },
        // 舞台中网格是否显示
        gridVisible: true,
        // 舞台中3D网格大小
        gridSize3D: 5000,
        // 舞台中3D网格单元格大小
        gridStep3D: 50
    },
    // 当前鼠标的3D位置
    mouse3d: {x: 0, y: 0, z: 0},
    // 编辑器当前显示模式
    view: 'all',
    // 编辑器当前处于响应拖拽事件的命令
    tool: 'moveCamera',
    // 变形工具工作状态
    transformer3Dinfo: {
        mode: 'translate',
        size: 1,
        space: 'world'
    },
    // 修改工具工作状态
    morpher3Dinfo: {
        anchorColor: 0x00CD00,
        anchorSize: 1000
    }
};
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
                    label: 'New', value: 'newFile'
                },
                {
                    label: 'Open', value: 'openFile', hotKey: 'Ctrl + O'
                },
                {
                    label: 'Save', value: 'saveFile', hotKey: 'Ctrl + S'
                },
                {
                    label: 'Save As', value: 'saveFileAs', hotKey: 'Ctrl + Shift + S'
                },
                {
                    label: 'Import', value: 'importFile', hotKey: 'Ctrl + Shift + I'
                },
                {
                    label: 'Export', value: 'exportFile', hotKey: 'Ctrl + Shift + E'
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
            key: 'geometry',
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
        {icon: 'tc-icon-color', value: 'setMorpherColor'},
        {icon: 'tc-icon-plus', value: 'setMorpherSize enlarge'},
        {icon: 'tc-icon-minus', value: 'setMorpherSize'}
    ]
}
