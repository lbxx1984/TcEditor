/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import raphael from 'raphael';
import Grid2D from '../../tools/Grid2D';
import Renderer2D from '../../tools/Renderer2D';
import Transformer2D from '../../tools/Transformer2D';
import Morpher2D from '../../tools/Morpher2D';
import updateCamera from './updateCamera';
import updateMesh from './updateMesh';
import updateTransformer from './updateTransformer';
import updateMorpher from './updateMorpher';
import {CAMERA_RADIUS_FOR_2D_SCALE} from '../../config';


export default class Stage2D extends Component {

    static contextTypes = {
        dispatch: PropTypes.func
    }

    static propTypes = {
        style: PropTypes.object.isRequired,
        view: PropTypes.string.isRequired,
        tool: PropTypes.string.isRequired,
        mesh3d: PropTypes.object.isRequired,
        morpher3Dinfo: PropTypes.object.isRequired,
        transformer3Dinfo: PropTypes.object.isRequired,
        axis: PropTypes.array,
        gridColor: PropTypes.string,
        gridVisible: PropTypes.bool,
        selectedMesh: PropTypes.object,
        selectedVector: PropTypes.object,
        selectedVectorIndex: PropTypes.number,
        cameraLookAt: PropTypes.object,
        cameraAngleA: PropTypes.number,
        cameraAngleB: PropTypes.number,
        cameraRadius: PropTypes.number,
        cameraMoveSpeed: PropTypes.number
    }

    static defaultProps = {
        axis: ['x', 'z'],
        cameraRadius: 1000,
        cameraAngleA: 40,
        cameraAngleB: 45,
        cameraLookAt: {x: 0, y: 0, z: 0},
        cameraMoveSpeed: 4,
        gridColor: '#8F908A',
        gridVisible: true,
        selectedMesh: null,
        selectedVector: null,
        selectedVectorIndex: null
    }

    constructor(props) {
        super(props);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    componentDidMount() {
        /* eslint-disable react/no-string-refs */
        const {container, grid, svg, renderer, morpher} = this.refs;
        const {
            tool, axis, gridColor, mesh3d, selectedMesh, selectedVector, selectedVectorIndex,
            cameraLookAt, cameraAngleA, cameraAngleB,
            morpher3Dinfo, transformer3Dinfo
        } = this.props;
        let cameraRadius = this.props.cameraRadius / CAMERA_RADIUS_FOR_2D_SCALE;
        this.mousedown = false;
        this.mouseCurrent2D = {x: 0, y: 0};
        this.mouseCurrent3D = {x: 0, y: 0, z: 0};
        this.svgRenderer = raphael(svg, container.offsetWidth, container.offsetHeight);
        // 初始化网格
        this.grid2D = new Grid2D({
            axis,
            cameraRadius,
            cameraLookAt,
            cameraAngleA,
            cameraAngleB,
            container,
            canvas: grid,
            lineColor: gridColor
        });
        // 初始化渲染器
        this.renderer2D = new Renderer2D({
            axis,
            cameraRadius,
            cameraLookAt,
            cameraAngleA,
            cameraAngleB,
            mesh3d,
            container,
            canvas: renderer
        });
        // 初始化骨骼编辑器
        this.morpher2D = new Morpher2D({
            axis,
            cameraRadius,
            cameraLookAt,
            cameraAngleA,
            cameraAngleB,
            container,
            svg: this.svgRenderer,
            canvas: morpher,
            size: morpher3Dinfo.anchorSize,
            color: morpher3Dinfo.anchorColor,
            selectedVector: selectedVector,
            onAnchorClick: i => {
                this.context.dispatch('morpher-2d-pick-anchor', i);
            },
            onObjectChange: () => {
                if (this.props.selectedMesh && this.props.selectedMesh.tc) {
                    this.isDragging = true;
                    this.props.selectedMesh.tc.needUpdate = this.props.view === 'all' ? 4 : 1;
                    this.context.dispatch('updateTimer');
                }
            }
        });
        // 初始化变形器
        this.transformer2D = new Transformer2D({
            axis,
            cameraRadius,
            cameraLookAt,
            cameraAngleA,
            cameraAngleB,
            container,
            svg: this.svgRenderer,
            mode: transformer3Dinfo.mode,
            size: transformer3Dinfo.size,
            space: transformer3Dinfo.space,
            onChange: () => {
                if (this.props.selectedMesh && this.props.selectedMesh.tc) {
                    this.props.selectedMesh.tc.needUpdate = this.props.view === 'all' ? 4 : 1;
                    this.isDragging = true;
                    this.context.dispatch('updateTimer');
                }
            }
        });
        // 初始化舞台
        this.grid2D.render();
        this.renderer2D.render();
        if (tool === 'pickMesh' && selectedMesh) {
            this.transformer2D.attach(selectedMesh);
        }
        if (tool === 'pickJoint' && selectedMesh) {
            this.morpher2D.attach(selectedMesh);
            this.morpher2D.attachAnchor(selectedVectorIndex);
        }
        // 绑定事件
        container.addEventListener('mousewheel', this.onMouseWheel);
        window.addEventListener('resize', this.onResize);
    }

    componentWillReceiveProps(nextProps) {
        updateCamera(nextProps, this);
        updateMesh(nextProps, this);
        updateTransformer(nextProps, this);
        updateMorpher(nextProps, this);
        if (nextProps.selectedMesh && nextProps.selectedMesh.tc.needUpdate) {
            nextProps.selectedMesh.tc.needUpdate--;
        }
    }

    componentWillUnmount() {
        this.refs.container.removeEventListener('mousewheel', this.onMouseWheel);
        window.removeEventListener('resize', this.onResize);
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
        this.grid2D.render();
        this.renderer2D.render();
        this.svgRenderer.setSize(this.refs.container.offsetWidth, this.refs.container.offsetHeight);
    }

    onMouseMove(e) {
        const mouse2D = {x: e.clientX, y: e.clientY};
        const mouse3D = {x: 0, y: 0, z: 0};
        const tmpMouse3D = this.grid2D.getMouse3D(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        mouse3D[this.props.axis[0]] = tmpMouse3D[0];
        mouse3D[this.props.axis[1]] = tmpMouse3D[1];
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
            stage2D: this,
            mouseDown2D: this.mouseDown2D,
            mouseDown3D: this.mouseDown3D,
            mouseCurrent2D: mouse2D,
            mouseCurrent3D: mouse3D,
            mouseDelta2D: mouseDelta2D,
            mouseDelta3D: mouseDelta3D
        };
        // 拖拽命令
        if (this.props.tool && this.mousedown && !this.isCameraRotating) {
            this.context.dispatch(this.props.tool + '2D', callbackParam, true);
            return;
        }
        // 普通鼠标移动
        if (this.props.tool && !this.isCameraRotating) {
            this.context.dispatch(this.props.tool + '2D', callbackParam, false);
        }
    }

    onMouseDown(e) {
        const tmpMouse3D = this.grid2D.getMouse3D(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        this.mousedown = true;
        this.mouseDown2D = {x: e.clientX, y: e.clientY};
        this.mouseDown3D = {x: 0, y: 0, z: 0};
        this.mouseDown3D[this.props.axis[0]] = tmpMouse3D[0];
        this.mouseDown3D[this.props.axis[1]] = tmpMouse3D[1];
        this.mouseCurrent2D = {x: e.clientX, y: e.clientY};
        this.mouseCurrent3D = JSON.parse(JSON.stringify(this.mouseDown3D));
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
        // 普通mouseup
        if (typeof this.props.tool === 'string') {
            this.context.dispatch(this.props.tool + '2D', 'mouseup', this);
        }
    }

    onContextMenu(e) {
        this.context.dispatch('clearSelected');
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
        const gridCanvasProps = {
            ref: 'grid',
            className: 'fixed-canvas',
            style: this.props.gridVisible ? undefined : {
                display: 'none'
            }
        };
        const rendererCanvasProps = {
            ref: 'renderer',
            className: 'fixed-canvas'
        };
        const morpherCanvasProps = {
            ref: 'morpher',
            className: 'fixed-canvas'
        };
        const svgProps = {
            ref: 'svg',
            className: 'fixed-canvas'
        };
        return (
            <div {...containerProps}>
                <canvas {...rendererCanvasProps}/>
                <canvas {...gridCanvasProps}/>
                <canvas {...morpherCanvasProps}/>
                <div {...svgProps}></div>
            </div>
        );
    }
}
