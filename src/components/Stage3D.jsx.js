/**
 * @file 3D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');   
    var THREE = require('three');


    var Transformer3D = require('three-lib/TransformControls');
    var Morpher3D = require('tools/Morpher3D');
    var CameraController = require('./CameraController.jsx');
    var animation = require('../common/animation');


    return React.createClass({

        contextTypes: {
            dispatch: React.PropTypes.func
        },

        // @override
        getDefaultProps: function () {
            return {
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
            };
        },

        componentDidMount: function () {
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
            // 物体关节编辑工具
            this.morpher = new Morpher3D({
                camera: this.camera,
                scene: this.scene,
                renderer: this.renderer
            });
            // 临时灯光
                var light = new THREE.PointLight(0xffffff, 1, 5000);
                light.position.set(0, 1000, 0);
                this.scene.add(light);
            // 初始化舞台
            this.scene.add(this.grid);
            this.scene.add(this.axis);
            this.scene.add(this.transformer);
            this.scene.add(this.coordinateContainer);
            this.coordinate.rotation.x = Math.PI * 0.5;
            this.coordinateContainer.add(this.coordinate);
            this.renderer.setClearColor(this.props.colorStage);
            this.renderer.setSize(this.refs.container.offsetWidth - 1, this.refs.container.offsetHeight);
            this.transformer.setSpace(this.props.transformer3Dinfo.space);
            this.transformer.setMode(this.props.transformer3Dinfo.mode);
            this.transformer.setSize(this.props.transformer3Dinfo.size);
            updateCameraPosition(this, this.props);
            this.refs.container.appendChild(this.renderer.domElement);
            // 绑定事件
            window.addEventListener('resize', this.onResize);
            this.refs.container.addEventListener('mousewheel', this.onMouseWheel);
            this.transformer.addEventListener('objectChange', function () {
                console.log('objectChange');
            });
            // 开启渲染引擎
            animation.add('stage3d', animaterFactory(this));
        },

        componentWillReceiveProps: function (nextProps) {
            // 热更新摄像机
            if (
                nextProps.cameraRadius !== this.props.cameraRadius
                || nextProps.cameraAngleA !== this.props.cameraAngleA
                || nextProps.cameraAngleB !== this.props.cameraAngleB
                || nextProps.cameraLookAt !== this.props.cameraLookAt
            ) {
                updateCameraPosition(this, nextProps);
            }
            // 热更新坐标纸
            if (nextProps.gridSize !== this.props.gridSize || nextProps.gridStep !== this.props.gridStep) {
                this.scene.remove(this.grid);
                this.grid = new THREE.GridHelper(
                    nextProps.gridSize, nextProps.gridStep,
                    nextProps.colorGrid, nextProps.colorGrid
                );
                this.grid.visible = nextProps.gridVisible;
                this.scene.add(this.grid);
            }
            // 热更新舞台标记
            if (nextProps.gridVisible !== this.props.gridVisible) {
                this.grid.visible = nextProps.gridVisible;
                this.axis.visible = nextProps.gridVisible;
            }
            // 热更新物体
            if (nextProps.mesh3d != this.props.mesh3d) {
                this.meshArray = [];
                for (var key in nextProps.mesh3d) {
                    if (!nextProps.mesh3d.hasOwnProperty(key)) continue;
                    var mesh = nextProps.mesh3d[key];
                    mesh.tc = mesh.tc || {};
                    this.meshArray.push(mesh);
                    if (mesh.tc.add) continue;
                    mesh.tc.add = true;
                    this.scene.add(mesh);
                }

            }
            // 热更新舞台
            if (nextProps.panelCount !== this.props.panelCount && nextProps.panelCount * this.props.panelCount === 0) {
                var me = this;
                setTimeout(function () {
                    me.onResize();
                }, 0);
            }
            // 热更新变形工具
            if (nextProps.selectedMesh !== this.props.selectedMesh && nextProps.tool === 'tool-pickGeometry') {
                this.transformer[nextProps.selectedMesh ? 'attach' : 'detach'](nextProps.selectedMesh);
            }
            if (nextProps.tool !== 'tool-pickGeometry' && this.props.tool === 'tool-pickGeometry') {
                this.transformer.detach();
            }
            if (nextProps.transformer3Dinfo !== this.props.transformer3Dinfo) {
                this.transformer.setSpace(nextProps.transformer3Dinfo.space);
                this.transformer.setMode(nextProps.transformer3Dinfo.mode);
                this.transformer.setSize(nextProps.transformer3Dinfo.size);
            }
        },

        componentWillUnmount: function () {
            animation.remove('stage3d');
            window.removeEventListener('resize', this.onResize);
            this.refs.container.removeEventListener('mousewheel', this.onMouseWheel);
        },

        onMouseWheel: function (evt) {
            var r = this.props.cameraRadius - 0.2 * this.props.cameraRadius * evt.wheelDelta
                * this.props.cameraMoveSpeed / this.refs.container.offsetWidth;
            r = Math.max(r, 50);
            r = Math.min(r, 5000);
            this.context.dispatch('changeCamera3D', {cameraRadius: r});
            evt.stopPropagation();
            return false;
        },

        onResize: function () {
            this.camera.aspect = this.refs.container.offsetWidth / this.refs.container.offsetHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.refs.container.offsetWidth - 1, this.refs.container.offsetHeight);
        },

        onMouseMove: function (e) {
            var mouse2D = {x: e.clientX, y: e.clientY};
            var mouse3D = getMouse3D(e.nativeEvent.offsetX, e.nativeEvent.offsetY, this, this.coordinate);
            var mouseDelta2D = {
                x: mouse2D.x - this.mouseCurrent2D.x,
                y: mouse2D.y - this.mouseCurrent2D.y
            };
            var mouseDelta3D = {
                x: mouse3D.x - this.mouseCurrent3D.x,
                y: mouse3D.y - this.mouseCurrent3D.y,
                z: mouse3D.z - this.mouseCurrent3D.z
            };
            this.mouseCurrent2D = mouse2D;
            this.mouseCurrent3D = mouse3D;
            this.context.dispatch('changeMouse3D', mouse3D);
            var callbackParam = {
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
        },

        onMouseDown: function (e) {
            this.mousedown = true;
            this.mouseDown2D = {x: e.clientX, y: e.clientY};
            this.mouseDown3D = getMouse3D(e.nativeEvent.offsetX, e.nativeEvent.offsetY, this, this.coordinate);
            this.mouseCurrent2D = {x: e.clientX, y: e.clientY};
            this.mouseCurrent3D = this.mouseDown3D.clone();
        },

        onMouseUp: function (e) {
            this.mousedown = false;
            this.mouseDown2D = {x: 0, y: 0};
            this.mouseDown3D = {x: 0, y: 0, z: 0};
            this.mouseCurrent2D = {x: 0, y: 0};
            this.mouseCurrent3D = {x: 0, y: 0, z: 0};
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
        },

        onContextMenu: function (e) {
            this.context.dispatch('stage3d-context-menu', this);
            e.stopPropagation();
            e.preventDefault();
        },

        render: function () {
            var containerProps = {
                className: 'tc-stage-3d',
                ref: 'container',
                style: this.props.style,
                onMouseMove: this.onMouseMove,
                onMouseDown: this.onMouseDown,
                onMouseUp: this.onMouseUp,
                onContextMenu: this.onContextMenu
            };
            var controllerProps = {
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
    });


    // 设置摄像机位置
    function updateCameraPosition(me, props) {
        props = props || me.props;
        var cameraAngleA = props.cameraAngleA;
        var cameraAngleB = props.cameraAngleB;
        var cameraRadius = props.cameraRadius;
        var coordinateContainer = me.coordinateContainer;
        var grid = me.grid;
        var y = cameraRadius * Math.sin(Math.PI * cameraAngleA / 180);
        var x = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.cos(Math.PI * cameraAngleB / 180);
        var z = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.sin(Math.PI * cameraAngleB / 180);
        if (Math.abs(cameraAngleA) < 2) {
            coordinateContainer.rotation.z = grid.rotation.z = Math.PI * 0.5 - Math.PI * cameraAngleB / 180;
            coordinateContainer.rotation.x = grid.rotation.x = Math.PI * 1.5;
        }
        else {
            coordinateContainer.rotation.z = grid.rotation.z = 0;
            coordinateContainer.rotation.x = grid.rotation.x = 0;
        }
        me.camera.position.set(
            x + props.cameraLookAt.x,
            y + props.cameraLookAt.y,
            z + props.cameraLookAt.z
        );
    }


    // 渲染器工厂
    function animaterFactory(me) {
        return function () {
            me.camera.lookAt(me.props.cameraLookAt);
            me.transformer.update();
            me.renderer.render(me.scene, me.camera);
        };
    }


    // 获取根据坐标纸获取3D鼠标位置
    function getMouse3D(x, y, me, geo) {
        var width = me.refs.container.offsetWidth;
        var height = me.refs.container.offsetHeight;
        me.raycaster.setFromCamera(new THREE.Vector3((x / width) * 2 - 1, - (y / height) * 2 + 1, 0), me.camera);
        var intersects = me.raycaster.intersectObjects([geo]);
        return intersects.length > 0 ? intersects[0].point.clone() : new THREE.Vector3();
    }


});
