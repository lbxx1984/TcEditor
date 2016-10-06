/**
 * @file 3D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');   
    var THREE = require('three');
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
                cameraMoveSpeed: 2,
                // 是否显示网格
                gridVisible: true,
                // 网格的总尺寸
                gridSize: 2500,
                // 网格的单元格大小
                gridStep: 50,
                // 编辑器背景颜色
                colorStage: 0xffffff,
                // 网格的颜色
                colorGrid: 0xffffff,
                // 当前的命令
                tool: ''
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
            // 初始化舞台
            this.scene.add(this.grid);
            this.scene.add(this.axis);
            this.coordinate.rotation.x = Math.PI * 0.5;
            this.coordinateContainer.add(this.coordinate);
            this.scene.add(this.coordinateContainer);
            this.renderer.setClearColor(this.props.colorStage);
            this.renderer.setSize(this.refs.container.offsetWidth, this.refs.container.offsetHeight);
            this.refs.container.appendChild(this.renderer.domElement);
            updateCameraPosition(this, this.props);
            // 开启渲染引擎
            animation.add('stage3d', animaterFactory(this));
            // 绑定事件
            window.addEventListener('resize', this.onResize);
            this.refs.container.addEventListener('mousewheel', this.onMouseWheel);
        },

        componentWillReceiveProps: function (nextProps) {
            if (
                nextProps.cameraRadius !== this.props.cameraRadius
                || nextProps.cameraAngleA !== this.props.cameraAngleA
                || nextProps.cameraAngleB !== this.props.cameraAngleB
                || nextProps.cameraLookAt !== this.props.cameraLookAt
            ) {
                updateCameraPosition(this, nextProps);
            }
            if (nextProps.gridSize !== this.props.gridSize || nextProps.gridStep !== this.props.gridStep) {
                this.scene.remove(this.grid);
                this.grid = new THREE.GridHelper(
                    nextProps.gridSize, nextProps.gridStep,
                    nextProps.colorGrid, nextProps.colorGrid
                );
                this.grid.visible = nextProps.gridVisible;
                this.scene.add(this.grid);
            }
            if (nextProps.gridVisible !== this.props.gridVisible) {
                this.grid.visible = nextProps.gridVisible;
                this.axis.visible = nextProps.gridVisible;
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
            this.renderer.setSize(this.refs.container.offsetWidth, this.refs.container.offsetHeight);
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
            // 拖拽命令
            if (this.props.tool && this.mousedown && !this.isCameraRotating) {
                this.context.dispatch(this.props.tool, {
                    stage3D: this,
                    mouseDown2D: this.mouseDown2D,
                    mouseDown3D: this.mouseDown3D,
                    mouseCurrent2D: mouse2D,
                    mouseCurrent3D: mouse3D,
                    mouseDelta2D: mouseDelta2D,
                    mouseDelta3D: mouseDelta3D
                }, true);
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
        },

        render: function () {
            var containerProps = {
                className: 'tc-stage-3d',
                ref: 'container',
                onMouseMove: this.onMouseMove,
                onMouseDown: this.onMouseDown,
                onMouseUp: this.onMouseUp
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
        var cameraLookAt = props.cameraLookAt;
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
            x + cameraLookAt.x,
            y + cameraLookAt.y,
            z + cameraLookAt.z
        );
    }


    // 渲染器工厂
    function animaterFactory(me) {
        return function () {
            me.camera.lookAt(me.props.cameraLookAt);
            me.renderer.render(me.scene, me.camera);
        };
    }


    // 获取根据坐标纸获取3D鼠标位置
    function getMouse3D(x, y, me, geo) {
        var width = me.refs.container.offsetWidth;
        var height = me.refs.container.offsetHeight;
        me.raycaster.setFromCamera(new THREE.Vector3((x / width) * 2 - 1, - (y / height) * 2 + 1, 0), me.camera);
        var intersects = me.raycaster.intersectObjects([geo]);
        var point = new THREE.Vector3();
        if (intersects.length > 0) {
            point = intersects[0].point;
            if (Math.abs(point.x) < 5) {
                point.x = 0;
            }
            if (Math.abs(point.y) < 5) {
                point.y = 0;
            }
            if (Math.abs(point.z) < 5) {
                point.z = 0;
            }
        }
        return point.clone();
    }


});
