/**
 * @file 摄像机控制器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Scene, Mesh, Vector3, WebGLRenderer, Raycaster,
    AmbientLight, TextureLoader, PerspectiveCamera,
    PlaneGeometry, BoxGeometry, MeshLambertMaterial
} from 'three';
import animation from 'core/animation';
import {FACE_CONFIG, ANGLE_CONFIG, TEXTURE_PATH} from './config';


// 渲染器工厂
function animaterFactory(me) {
    return function () {
        me.camera.lookAt(0, 0, 0);
        me.renderer.render(me.scene, me.camera);
    };
}

// 设置摄像机位置
function updateCameraPosition(me, props) {
    props = props || me.props;
    const {cameraAngleA, cameraAngleB, cameraRadius} = props;
    me.camera.position.set(
        cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.cos(Math.PI * cameraAngleB / 180),
        cameraRadius * Math.sin(Math.PI * cameraAngleA / 180),
        cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.sin(Math.PI * cameraAngleB / 180)
    );
}

// 判断是否更新摄像机
function shouldUpdateCamera(nextProps, props) {
    return nextProps.cameraRadius !== props.cameraRadius
        || nextProps.cameraAngleA !== props.cameraAngleA
        || nextProps.cameraAngleB !== props.cameraAngleB;
}


export default class CameraController extends Component {

    static contextTypes = {
        dispatch: PropTypes.func.isRequired
    }

    static propTypes = {
        cameraRadius: PropTypes.number,
        cameraAngleA: PropTypes.number,
        cameraAngleB: PropTypes.number,
        cameraMoveSpeed: PropTypes.number,
        textureColor: PropTypes.number,
        hoverColor: PropTypes.number,
        parentStage: PropTypes.object.isRequired
    }

    static defaultProps = {
        cameraRadius: 90,
        cameraAngleA: 40,
        cameraAngleB: 45,
        cameraMoveSpeed: 2,
        textureColor: 0xffffff,
        hoverColor: 0xD97915
    }

    constructor(props) {
        super(props);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onWindowMouseMove = this.onWindowMouseMove.bind(this);
        this.onWindowMouseUp = this.onWindowMouseUp.bind(this);
    }

    componentDidMount() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        // 舞台部件
        this.camera = new PerspectiveCamera(60, width / height, 1, 10000);
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({alpha: true});
        this.raycaster = new Raycaster();
        this.container.appendChild(this.renderer.domElement);
        this.scene.add(new AmbientLight(0xffffff));
        this.renderer.setSize(width, height);
        this.intersected = null;
        updateCameraPosition(this, this.props);
        // 开启渲染引擎
        animation.add('cameraController', animaterFactory(this));
        // 创建控制面
        const textureloader = new TextureLoader();
        Object.keys(FACE_CONFIG).map(key => {
            const item = FACE_CONFIG[key];
            textureloader.load(TEXTURE_PATH + (key.indexOf('_') < 0 ? key + '_en.png' : 'background.png'), texture => {
                const geometry = key.indexOf('_') < 0
                    ? new PlaneGeometry(item[6], item[7])
                    : new BoxGeometry(item[6], item[7], item[8]);
                const mesh = new Mesh(geometry, new MeshLambertMaterial({
                    map: texture,
                    color: this.props.textureColor
                }));
                mesh.position.set(item[0], item[1], item[2]);
                mesh.rotation.set(Math.PI * item[3], Math.PI * item[4], Math.PI * item[5]);
                mesh.tid = key;
                this.scene.add(mesh);
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (shouldUpdateCamera(nextProps, this.props)) {
            updateCameraPosition(this, nextProps);
        }
    }

    componentWillUnmount() {
        this.intersected = null;
        animation.remove('cameraController');
    }

    onMouseMove(e) {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        const vector = new Vector3((x / width) * 2 - 1, -(y / height) * 2 + 1, 1);
        vector.unproject(this.camera);
        this.raycaster.ray.set(
            this.camera.position,
            vector.sub(this.camera.position).normalize()
        );
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            if (this.intersected !== intersects[0].object) {
                if (this.intersected) {
                    this.intersected.material.setValues({color: this.props.textureColor});
                }
                this.intersected = intersects[0].object;
                this.intersected.material.setValues({color: this.props.hoverColor});
            }
        }
        else if (this.intersected) {
            this.intersected.material.setValues({color: this.props.textureColor});
            this.intersected = null;
        }
    }

    onMouseDown(e) {
        this.mousedown = true;
        this.props.parentStage.isCameraRotating = true;
        this.mousePos = [e.clientX, e.clientY];
        window.addEventListener('mousemove', this.onWindowMouseMove);
        window.addEventListener('mouseup', this.onWindowMouseUp);
    }

    onWindowMouseMove(e) {
        let da = e.clientY - this.mousePos[1];
        let db = e.clientX - this.mousePos[0]; 
        let a = this.props.cameraAngleA;
        let b = this.props.cameraAngleB;
        if (da === 0 && db === 0) return;
        this.mousePos = [e.clientX, e.clientY];
        da = this.props.cameraMoveSpeed * da * 90 / Math.PI / window.screen.availHeight;
        da = a < 90 && a + da > 90 ? 0 : da;
        da = a > -90 && a + da < -90 ? 0 : da;
        a += da;
        b += this.props.cameraMoveSpeed * db * 90 / Math.PI / window.screen.availWidth;
        b = b > 360 ? b - 360 : b;
        b = b < 0 ? b + 360 : b;
        this.props.parentStage.isCameraRotating = true;
        this.context.dispatch('changeCamera3D', {
            cameraAngleA: a,
            cameraAngleB: b
        });
    }

    onWindowMouseUp() {
        this.mousedown = false;
        this.props.parentStage.isCameraRotating = false;
        window.removeEventListener('mousemove', this.onWindowMouseMove);
        window.removeEventListener('mouseup', this.onWindowMouseUp);
    }

    onMouseUp() {
        this.mousedown = false;
        this.props.parentStage.isCameraRotating = false;
        if (this.intersected == null) return;
        const c = ANGLE_CONFIG[this.intersected.tid];
        this.context.dispatch('changeCamera3D', {
            cameraAngleA: c[0] != null ? c[0] : this.props.cameraAngleA,
            cameraAngleB: c[1] != null ? c[1] : this.props.cameraAngleB
        });
    }

    onMouseOut() {
        if (this.intersected) {
            this.intersected.material.setValues({color: this.props.textureColor});
        }
        this.intersected = null;
    }

    render() {
        const containerProps = {
            className: 'tc-camera-controller',
            ref: el => {
                this.container = el;
            },
            onMouseMove: this.onMouseMove,
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp,
            onMouseOut: this.onMouseOut
        };
        return (
            <div {...containerProps}></div>
        );
    }
}
