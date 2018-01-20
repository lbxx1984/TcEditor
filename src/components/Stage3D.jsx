/**
 * @file 3D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */
/* eslint-disable  react/no-string-refs */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import CameraController from './CameraController';
import Morpher3D from '../tools/Morpher3D';
import LightHelper from '../tools/LightHelper';
import animation from '../core/animation';


// 舞台技术测试
function test() {
    // var renderer = me.renderer;
    // var camera = me.camera;
    // var scene = me.scene;
    // var mshBox = new THREE.Mesh(
    //     new THREE.SphereGeometry(20, 20, 20),
    //     new THREE.MeshPhongMaterial({color: 0x4080ff})
    // );
    // mshBox.position.set(100, 0, 200);
    // scene.add(mshBox);
    // console.log(camera.rotation);
}


// 渲染器工厂
function animaterFactory(me) {
    return function () {
        me.camera.lookAt(me.props.cameraLookAt);
        me.renderer.render(me.scene, me.camera);
        if (me.props.tool === 'tool-pickLight') {
            me.lightHelper.update();
        }
        if (me.props.tool === 'tool-pickLight' && me.props.selectedLight) {
            me.lightHelper.controller.update();
        }
        if (me.props.tool === 'tool-pickGeometry' && me.props.selectedMesh) {
            me.transformer.update();
        }
        if (me.props.tool === 'tool-pickJoint' && me.props.selectedVector) {
            me.morpher.controller.update();
        }
    };
}

// 获取根据坐标纸获取3D鼠标位置
function getMouse3D(x, y, me, geo) {
    const width = me.refs.container.offsetWidth;
    const height = me.refs.container.offsetHeight;
    me.raycaster.setFromCamera(new THREE.Vector3((x / width) * 2 - 1, - (y / height) * 2 + 1, 0), me.camera);
    const intersects = me.raycaster.intersectObjects([geo]);
    return intersects.length > 0 ? intersects[0].point.clone() : new THREE.Vector3();
}

// 更新摄像机位置
function updateCameraPosition(me, props) {
    props = props || me.props;
    const {cameraAngleA, cameraAngleB, cameraRadius, cameraLookAt} = props;
    const {coordinateContainer, grid, camera} = me;
    const y = cameraRadius * Math.sin(Math.PI * cameraAngleA / 180);
    const x = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.cos(Math.PI * cameraAngleB / 180);
    const z = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.sin(Math.PI * cameraAngleB / 180);
    if (Math.abs(cameraAngleA) < 2) {
        coordinateContainer.rotation.z = grid.rotation.z = Math.PI * 0.5 - Math.PI * cameraAngleB / 180;
        coordinateContainer.rotation.x = grid.rotation.x = Math.PI * 1.5;
    }
    else {
        coordinateContainer.rotation.z = grid.rotation.z = 0;
        coordinateContainer.rotation.x = grid.rotation.x = 0;
    }
    camera.position.set(
        x + cameraLookAt.x,
        y + cameraLookAt.y,
        z + cameraLookAt.z
    );
}

// 更新摄像机属性
function updateCameraInfo(nextProps, me) {
    if (
        nextProps.cameraRadius !== me.props.cameraRadius
        || nextProps.cameraAngleA !== me.props.cameraAngleA
        || nextProps.cameraAngleB !== me.props.cameraAngleB
        || nextProps.cameraLookAt !== me.props.cameraLookAt
    ) {
        updateCameraPosition(me, nextProps);
        if (nextProps.tool === 'tool-pickJoint' && nextProps.selectedMesh) {
            me.morpher.updateAnchors();
        }
    }
}

// 更新坐标值
function updateScene(nextProps, me) {
    if (nextProps.gridSize !== me.props.gridSize || nextProps.gridStep !== me.props.gridStep) {
        me.scene.remove(me.grid);
        me.grid = new THREE.GridHelper(
            nextProps.gridSize, nextProps.gridStep,
            nextProps.colorGrid, nextProps.colorGrid
        );
        me.grid.visible = nextProps.gridVisible;
        me.scene.add(me.grid);
    }
    if (nextProps.gridVisible !== me.props.gridVisible) {
        me.grid.visible = nextProps.gridVisible;
        me.axis.visible = nextProps.gridVisible;
    }
    if (nextProps.panelCount !== me.props.panelCount && nextProps.panelCount * me.props.panelCount === 0) {
        setTimeout(function () {
            me.onResize();
        }, 0);
    }
}

// 更新物体列表
function updateMeshList(nextProps, me) {
    if (nextProps.mesh3d === me.props.mesh3d) return;
    const oldMeshHash = {
        ...me.props.mesh3d
    };
    Object.keys(nextProps.mesh3d).map(key => {
        const mesh = nextProps.mesh3d[key];
        delete oldMeshHash[mesh.uuid];
        if (mesh.tc.add) return;
        mesh.tc.add = true;
        me.scene.add(mesh);
    });
    Object.keys(oldMeshHash).map(key => {
        me.scene.remove(oldMeshHash[key]);
    });
}

// 更新灯光列表
function updateLightList(nextProps, me) {
    if (nextProps.lights === me.props.lights) return;
    me.lightHelper.lights = nextProps.lights;
    const oldLightHash = {
        ...me.props.lights
    };
    me.lightArray = [];
    Object.keys(nextProps.lights).map(key => {
        const light = nextProps.lights[key];
        me.lightArray.push(light);
        delete oldLightHash[key];
        if (light.tc.add) return;
        light.tc.add = true;
        me.scene.add(light);
    });
    Object.keys(oldLightHash).map(key => {
        const light = oldLightHash[key];
        me.scene.remove(light);
        let anchor = null;
        me.lightHelper.anchorArray.map(function (item) {
            if (item.tc.lightKey === key) anchor = item;
        });
        anchor && me.scene.remove(anchor);
    });
}

// 更新变形工具
function updateTransformer(nextProps, me) {
    if (
        nextProps.tool === 'tool-pickGeometry' && me.props.tool !== 'tool-pickGeometry'
        || (nextProps.selectedMesh !== me.props.selectedMesh && nextProps.tool === 'tool-pickGeometry')
    ) {
        me.transformer[nextProps.selectedMesh ? 'attach' : 'detach'](nextProps.selectedMesh);
    }
    if (nextProps.tool !== 'tool-pickGeometry' && me.props.tool === 'tool-pickGeometry') {
        me.transformer.detach();
    }
    if (nextProps.transformer3Dinfo !== me.props.transformer3Dinfo) {
        me.transformer.setSpace(
            nextProps.transformer3Dinfo.mode === 'rotate' ? 'local' : nextProps.transformer3Dinfo.space
        );
        me.transformer.setMode(nextProps.transformer3Dinfo.mode);
        me.transformer.setSize(nextProps.transformer3Dinfo.size);
    }
}

// 更新修改工具
function updateMorpher(nextProps, me) {
    if (
        nextProps.tool === 'tool-pickJoint' && me.props.tool === 'tool-pickJoint'
        && nextProps.selectedMesh && nextProps.selectedMesh === me.props.selectedMesh
        && nextProps.selectedMesh.tc.needUpdate
    ) {
        me.morpher.attach(nextProps.selectedMesh);
        nextProps.selectedVector && me.morpher.attachAnchor(nextProps.selectedVector);
    }
    if (
        nextProps.tool === 'tool-pickJoint' && me.props.tool !== 'tool-pickJoint'
        || (nextProps.selectedMesh !== me.props.selectedMesh && nextProps.tool === 'tool-pickJoint')
    ) {
        me.morpher[nextProps.selectedMesh ? 'attach' : 'detach'](nextProps.selectedMesh);
        me.morpher.detachAnchor();
    }
    if (nextProps.selectedVector !== me.props.selectedVector && nextProps.tool === 'tool-pickJoint') {
        me.morpher[nextProps.selectedVector ? 'attachAnchor' : 'detachAnchor'](nextProps.selectedVector);
    }
    if (nextProps.tool !== 'tool-pickJoint' && me.props.tool === 'tool-pickJoint') {
        me.morpher.detach();
        me.morpher.detachAnchor();
    }
    if (
        nextProps.tool === 'tool-pickJoint'
        && nextProps.selectedVectorIndex !== me.props.selectedVectorIndex
        && me.morpher.mesh
        && me.morpher.anchors[nextProps.selectedVectorIndex]
        && me.morpher.anchors[nextProps.selectedVectorIndex].added
        && (
            !nextProps.selectedVector
            || (nextProps.selectedVector && nextProps.selectedVector.tc.index !== nextProps.selectedVectorIndex)
        )
    ) {
        me.context.dispatch('morpher-3d-pick-anchor', me.morpher.anchors[nextProps.selectedVectorIndex]);
    }
    if (nextProps.morpher3Dinfo !== me.props.morpher3Dinfo) {
        me.morpher.setAnchorColor(nextProps.morpher3Dinfo.anchorColor);
        me.morpher.setAnchorSize(nextProps.morpher3Dinfo.anchorSize);
    }
}

// 更新灯光控制器
function updateLightHelper(nextProps, me) {
    if (nextProps.tool === 'tool-pickLight' && me.props.tool !== 'tool-pickLight') {
        me.lightHelper.attach();
    }
    if (typeof nextProps.selectedLight === 'string') {
        switchAnchorType();
        return;
    }
    if (nextProps.tool !== 'tool-pickLight' && me.props.tool === 'tool-pickLight') {
        me.lightHelper.detach();
        me.lightHelper.controller.detach();
    }
    if (nextProps.selectedLight !== me.props.selectedLight && nextProps.tool === 'tool-pickLight') {
        me.lightHelper.controller[nextProps.selectedLight ? 'attach' : 'detach'](nextProps.selectedLight);
    }
    function switchAnchorType() {
        var anchor = null;
        me.lightHelper.anchorArray.map(function (item) {
            if (item.tc.lightKey === nextProps.selectedLight) {
                anchor = item;
            }
        });
        if (anchor) {
            me.context.dispatch('tool-select-light-by-key', null, anchor);
        }
    }
}

// 加载灯光
function loadLights(me) {
    Object.keys(me.props.lights).map(key => {
        me.scene.add(me.props.lights[key]);
    });
}

// 加载物体
function loadMeshes(me) {
    Object.keys(me.props.mesh3d).map(key => {
        me.scene.add(me.props.mesh3d[key]);
    });
}

// 加载工具
function loadTools(me) {
    if (me.props.tool === 'tool-pickGeometry') {
        me.transformer[me.props.selectedMesh ? 'attach' : 'detach'](me.props.selectedMesh);
    }
    if (me.props.tool === 'tool-pickJoint') {
        me.morpher[me.props.selectedMesh ? 'attach' : 'detach'](me.props.selectedMesh);
        if (me.props.selectedMesh && me.props.selectedVector) {
            me.morpher.attachAnchor(me.morpher.anchors[me.props.selectedVector.tc.index]);
        }
        else if (
            me.props.selectedMesh && me.props.selectedVectorIndex > -1
            && me.morpher.anchors[me.props.selectedVectorIndex]
            && me.morpher.anchors[me.props.selectedVectorIndex].added
        ) {
            me.context.dispatch('morpher-3d-pick-anchor', me.morpher.anchors[me.props.selectedVectorIndex]);
        }
        else {
            me.morpher.detachAnchor();
        }
    }
    if (me.props.tool === 'tool-pickLight') {
        me.lightHelper.attach();
        if (me.props.selectedLight) {
            me.lightHelper.controller.attach(me.lightHelper.anchors[me.props.selectedLight.tc.lightKey]);
        }
        else {
            me.lightHelper.controller.detach();
        }
    }
}


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
        cameraLookAt: PropTypes.number,
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
        // 加载自定义对象
        loadLights(this);
        loadMeshes(this);
        loadTools(this);
        // 测试
        test(this);
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
