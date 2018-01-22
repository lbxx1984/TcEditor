/**
 * @file 3D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */
/* eslint-disable  react/no-string-refs */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import CameraController from '../CameraController';
import Morpher3D from '../../tools/Morpher3D';
import LightHelper from '../../tools/LightHelper';
import animation from '../../core/animation';
import animaterFactory from './animaterFactory';
import getMouse3D from './getMouse3D';
import updateCameraPosition from './updateCameraPosition';
import updateCameraInfo from './updateCameraInfo';
import updateScene from './updateScene';
import updateMeshList from './updateMeshList';
import updateLightList from './updateLightList';
import updateTransformer from './updateTransformer';
import updateMorpher from './updateMorpher';
import updateLightHelper from './updateLightHelper';
import load3DObject from './load3DObject';
import loadTools from './loadTools';


export default class Stage3D extends Component {

    static contextTypes = {
        dispatch: PropTypes.func
    }

    static propTypes = {
        tool: PropTypes.string.isRequired,
        style: PropTypes.object.isRequired,
        lights: PropTypes.object.isRequired,
        morpher3Dinfo: PropTypes.object.isRequired,
        transformer3Dinfo: PropTypes.object.isRequired,
        cameraRadius: PropTypes.number,
        cameraMoveSpeed: PropTypes.number,
        cameraAngleA: PropTypes.number,
        cameraAngleB: PropTypes.number,
        cameraLookAt: PropTypes.object,
        gridSize: PropTypes.number,
        gridStep: PropTypes.number,
        colorGrid: PropTypes.number,
        colorStage: PropTypes.number,
        gridVisible: PropTypes.bool,
        selectedMesh: PropTypes.object
    }

    static defaultProps = {
        // 被选中的物体
        selectedMesh: null,
        // 摄像机到期观察点的距离，可以理解为焦距
        cameraRadius: 1000,
        // 摄像机视线与XOZ平面夹角
        cameraAngleA: 40,
        // 摄像机视线在XOZ平面投影与X轴夹角
        cameraAngleB: 45,
        // 摄像机的观察点，3D坐标
        cameraLookAt: {x: 0, y: 0, z: 0},
        // 鼠标拖拽舞台时，摄像机的移动速度
        cameraMoveSpeed: 4,
        // 是否显示网格
        gridVisible: true,
        // 网格的总尺寸
        gridSize: 2500,
        // 网格的单元格大小
        gridStep: 50,
        // 编辑器背景颜色
        colorStage: 0xffffff,
        // 网格的颜色
        colorGrid: 0xffffff
    }

    constructor(props) {
        super(props);
        this.onResize = this.onResize.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    componentDidMount() {
        const me = this;
        this.mousedown = false;
        this.mouseCurrent2D = {x: 0, y: 0};
        this.mouseCurrent3D = {x: 0, y: 0, z: 0};
        // 射线，用于鼠标拾取物体
        this.raycaster = new THREE.Raycaster();
        // 网格
        this.grid = new THREE.GridHelper(
            this.props.gridSize, this.props.gridStep,
            this.props.colorGrid, this.props.colorGrid
        );
        // 坐标轴
        this.axis = new THREE.AxisHelper(200);
        // 坐标纸，不可见，专门显示鼠标事件
        this.coordinate = new THREE.Mesh(
            new THREE.PlaneGeometry(10000, 10000, 1, 1),
            new THREE.MeshBasicMaterial({visible: false, side: THREE.DoubleSide})
        );
        // 坐标纸容器，主要作用是接受对网格的操作
        this.coordinateContainer = new THREE.Object3D();
        // 3D摄像机
        this.camera = new THREE.PerspectiveCamera(
            60, this.refs.container.offsetWidth / this.refs.container.offsetHeight, 1, 20000
        );
        // 3D场景
        this.scene = new THREE.Scene();
        // WebGL渲染器
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        // 物体变形工具
        this.transformer = new THREE.TransformControls(this.camera, this.renderer.domElement);
        // 灯光系统控制器
        this.lightHelper = new LightHelper({
            scene: this.scene,
            camera: this.camera,
            renderer: this.renderer,
            lights: this.props.lights
        });
        // 物体关节编辑工具
        this.morpher = new Morpher3D({
            camera: this.camera,
            scene: this.scene,
            renderer: this.renderer,
            anchorColor: this.props.morpher3Dinfo.anchorColor,
            anchorSize: this.props.morpher3Dinfo.anchorSize
        });
        // 初始化舞台
        this.scene.add(this.grid);
        this.scene.add(this.axis)
        this.scene.add(this.transformer);
        this.scene.add(this.morpher.controller);
        this.scene.add(this.lightHelper.controller);
        this.scene.add(this.coordinateContainer);
        this.grid.visible = this.props.gridVisible;
        this.axis.visible = this.props.gridVisible;
        this.coordinate.rotation.x = Math.PI * 0.5;
        this.coordinateContainer.add(this.coordinate);
        this.renderer.setClearColor(this.props.colorStage);
        this.renderer.setSize(this.refs.container.offsetWidth - 1, this.refs.container.offsetHeight);
        this.transformer.setSpace(this.props.transformer3Dinfo.space);
        this.transformer.setMode(this.props.transformer3Dinfo.mode);
        this.transformer.setSize(this.props.transformer3Dinfo.size);
        this.refs.container.appendChild(this.renderer.domElement);
        updateCameraPosition(this, this.props);
        // 绑定事件
        window.addEventListener('resize', this.onResize);
        this.refs.container.addEventListener('mousewheel', this.onMouseWheel);
        this.transformer.addEventListener('objectChange', objectChangeHandler);
        this.morpher.controller.addEventListener('objectChange', objectChangeHandler);
        this.lightHelper.controller.addEventListener('objectChange', objectChangeHandler);
        function objectChangeHandler() {
            me.isDragging = true;
            if (me.props.selectedMesh && me.props.selectedMesh.tc) {
                me.props.selectedMesh.tc.needUpdate = me.props.view === 'view-all' ? 4 : 1;
                me.context.dispatch('updateTimer');
            }
        }
        // 开启渲染引擎
        animation.add('stage3d', animaterFactory(this));  
        // 加载3D对象
        load3DObject(this);
        loadTools(this);
    }

    componentWillReceiveProps(nextProps) {
        updateCameraInfo(nextProps, this);
        updateScene(nextProps, this);
        updateMeshList(nextProps, this);
        updateLightList(nextProps, this);
        updateTransformer(nextProps, this);
        updateMorpher(nextProps, this);
        updateLightHelper(nextProps, this);
        if (nextProps.selectedMesh && nextProps.selectedMesh.tc.needUpdate) {
            nextProps.selectedMesh.tc.needUpdate--;
        }
    }

    componentWillUnmount() {
        animation.remove('stage3d');
        window.removeEventListener('resize', this.onResize);
        this.refs.container.removeEventListener('mousewheel', this.onMouseWheel);
    }

    onMouseWheel(evt) {
        let r = this.props.cameraRadius - 0.2 * this.props.cameraRadius * evt.wheelDelta
            * this.props.cameraMoveSpeed / this.refs.container.offsetWidth;
        r = Math.max(r, 50);
        r = Math.min(r, 5000);
        this.context.dispatch('changeCamera3D', {cameraRadius: r});
        evt.stopPropagation();
        return false;
    }

    onResize() {
        this.camera.aspect = this.refs.container.offsetWidth / this.refs.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.refs.container.offsetWidth - 1, this.refs.container.offsetHeight);
    }

    onMouseMove(e) {
        const mouse2D = {x: e.clientX, y: e.clientY};
        const mouse3D = getMouse3D(e.nativeEvent.offsetX, e.nativeEvent.offsetY, this, this.coordinate);
        const mouseDelta2D = {
            x: mouse2D.x - this.mouseCurrent2D.x,
            y: mouse2D.y - this.mouseCurrent2D.y
        };
        const mouseDelta3D = {
            x: mouse3D.x - this.mouseCurrent3D.x,
            y: mouse3D.y - this.mouseCurrent3D.y,
            z: mouse3D.z - this.mouseCurrent3D.z
        };
        this.mouseCurrent2D = mouse2D;
        this.mouseCurrent3D = mouse3D;
        this.context.dispatch('changeMouse3D', mouse3D);
        const callbackParam = {
            event: e,
            cameraInfo: {
                radius: this.props.cameraRadius,
                angleA: this.props.cameraAngleA,
                angleB: this.props.cameraAngleB,
                lookAt: this.props.cameraLookAt
            },
            stage3D: this,
            mouseDown2D: this.mouseDown2D,
            mouseDown3D: this.mouseDown3D,
            mouseCurrent2D: mouse2D,
            mouseCurrent3D: mouse3D,
            mouseDelta2D: mouseDelta2D,
            mouseDelta3D: mouseDelta3D
        };
        // 拖拽命令
        if (this.props.tool && this.mousedown && !this.isCameraRotating) {
            this.context.dispatch(this.props.tool, callbackParam, true);
            return;
        }
        // 普通鼠标移动
        if (this.props.tool && !this.isCameraRotating) {
            this.context.dispatch(this.props.tool, callbackParam, false);
        }
    }

    onMouseDown(e) {
        this.mousedown = e.nativeEvent.button === 0;
        this.mouseDown2D = {x: e.clientX, y: e.clientY};
        this.mouseDown3D = getMouse3D(e.nativeEvent.offsetX, e.nativeEvent.offsetY, this, this.coordinate);
        this.mouseCurrent2D = {x: e.clientX, y: e.clientY};
        this.mouseCurrent3D = this.mouseDown3D.clone();
    }

    onMouseUp() {
        this.mousedown = false;
        this.mouseDown2D = {x: 0, y: 0};
        this.mouseDown3D = {x: 0, y: 0, z: 0};
        this.mouseCurrent2D = {x: 0, y: 0};
        this.mouseCurrent3D = {x: 0, y: 0, z: 0};
        // 发生了物体操作
        if (this.isDragging) {
            this.isDragging = false;
            return;
        }
        // 拖拽生成了新的mesh
        if (this.tempMesh && !this.isCameraRotating) {
            this.context.dispatch('addMesh', this.tempMesh);
            this.tempMesh = null;
            return;
        }
        // 普通mouseup
        if (typeof this.props.tool === 'string') {
            this.context.dispatch(this.props.tool, 'mouseup');
        }
    }

    onContextMenu(e) {
        this.context.dispatch('stage3d-context-menu');
        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        const containerProps = {
            className: 'tc-stage',
            ref: 'container',
            style: this.props.style,
            onMouseMove: this.onMouseMove,
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp,
            onContextMenu: this.onContextMenu
        };
        const controllerProps = {
            parentStage: this,
            cameraAngleA: this.props.cameraAngleA,
            cameraAngleB: this.props.cameraAngleB
        };
        return (
            <div {...containerProps}>
                <CameraController {...controllerProps}/>
            </div>
        );
    }
}
