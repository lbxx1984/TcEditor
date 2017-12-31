/**
 * @file 物体编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextBox from 'fcui2/TextBox.jsx';
import NumberBox from 'fcui2/NumberBox.jsx';
import uiUtil from 'fcui2/core/util';
import math from '../core/math';


const POSITION_EDITOR_PROPS = {
    width: 80,
    type: 'int',
    step: 1
};
const SCALE_EDITOR_PROPS = {
    width: 80,
    type: 'float',
    step: 0.01,
    fixed: 2
};


function getEditorTempValue(props) {
    const mesh = props.mesh;
    const dataset = {
        posx: 0,
        posy: 0,
        posz: 0,
        scalex: 1,
        scaley: 1,
        scalez: 1,
        vectorx: 0,
        vectory: 0,
        vectorz: 0
    };
    if (!mesh) dataset;
    if (props.selectedVectorIndex > -1 && mesh.geometry.vertices[props.selectedVectorIndex]) {
        const matrix = math.getRotateMatrix(mesh);
        const vector = mesh.geometry.vertices[props.selectedVectorIndex];
        const pos = math.local2world(vector.x, vector.y, vector.z, matrix, mesh);
        dataset.vectorx = parseInt(pos[0], 10);
        dataset.vectory = parseInt(pos[1], 10);
        dataset.vectorz = parseInt(pos[2], 10);
    }
    dataset.posx = mesh.position.x;
    dataset.posy = mesh.position.y;
    dataset.posz = mesh.position.z;
    dataset.scalex = mesh.scale.x;
    dataset.scaley = mesh.scale.y;
    dataset.scalez = mesh.scale.z;
    return dataset;
}


function getPositionChangeHandler(me, type) {
    const mesh = me.props.mesh;
    return function (e) {
        me.setState({
            ['pos' + type]: e.target.value
        });
        if (isNaN(e.target.value) || e.target.value === '') return;
        const pos = {
            x: mesh.position.x,
            y: mesh.position.y,
            z: mesh.position.z
        };
        pos[type] = +e.target.value;
        mesh.position.set(pos.x, pos.y, pos.z);
        mesh.tc.needUpdate = me.props.view === 'view-all' ? 4 : 1;
        me.context.dispatch('updateTimer');
    };
}


function getScaleChangeHandler(me, type) {
    const mesh = me.props.mesh;
    return function (e) {
        me.setState({
            ['scale' + type]: e.target.value
        });
        if (!isScaleAvailable(e.target.value)) return;
        mesh.scale[type] = +e.target.value;
        mesh.tc.needUpdate = me.props.view === 'view-all' ? 4 : 1;
        me.context.dispatch('updateTimer');
    };
}


function getVectorChangeHandler(me, type) {
    const mesh = me.props.mesh;
    const index = me.props.selectedVectorIndex;
    return function (e) {
        me.setState({
            ['vector' + type]: e.target.value
        });
        if (isNaN(e.target.value) || e.target.value === '') return;
        const vector = {
            x: me.state.vectorx,
            y: me.state.vectory,
            z: me.state.vectorz
        };
        vector[type] = +e.target.value;
        const pos = math.world2local(vector.x, vector.y, vector.z, mesh);
        mesh.geometry.vertices[index].x = pos[0];
        mesh.geometry.vertices[index].y = pos[1];
        mesh.geometry.vertices[index].z = pos[2];
        mesh.geometry.verticesNeedUpdate = true;
        mesh.tc.needUpdate = me.props.view === 'view-all' ? 4 : 1;
        me.context.dispatch('updateTimer');
    };
}


function shouldUpdateEditor(nextProps, props) {
    return nextProps.mesh && (
        nextProps.timer !== props.timer
        || nextProps.mesh !== props.mesh
        || nextProps.selectedVectorIndex !== props.selectedVectorIndex
    );
}


function isScaleAvailable(a) {
    a = a + '';
    if (isNaN(a) || a === '' || a === '0' || a.charAt(a.length - 1) === '.') return false;
    a = a * 1;
    if (a <= 0) return false;
    return true; 
}


export default class GeometryEditor extends Component {

    static contextTypes = {
        dispatch: PropTypes.func
    }

    static propTypes = {
        type: PropTypes.string.isRequired,
        view: PropTypes.string.isRequired,
        expend: PropTypes.boolean.isRequired,
        mesh: PropTypes.object
    }

    static defaultProps = {
        mesh: {}
    }

    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            step: 1,
            ...getEditorTempValue(this.props)
        };
        this.onPanelCloseIconClick = this.onPanelCloseIconClick.bind(this);
        this.onPanelToggleIconClick = this.onPanelToggleIconClick.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onStepChange = this.onStepChange.bind(this);
        this.onRotationMouseDown = this.onRotationMouseDown.bind(this);
        this.onRotationMouseUp = this.onRotationMouseUp.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (shouldUpdateEditor(nextProps, this.props)) {
            this.setState(getEditorTempValue(nextProps));
        }
    }

    onPanelCloseIconClick() {
        this.context.dispatch('view-close-panel', this.props.type);
    }

    onPanelToggleIconClick() {
        this.context.dispatch('view-toggle-panel', this.props.type);
    }

    onNameChange(e) {
        this.props.mesh.tc.name = e.target.value;
        this.context.dispatch('updateTimer');
    }

    onStepChange(e) {
        this.setState({step: e.target.value});
    }

    onRotationMouseDown(e) {
        const type = e.target.dataset.type;
        const value = +e.target.dataset.value;
        const {mesh, view} = this.props;
        const dispatch = this.context.dispatch;
        let step = this.state.step;
        if (!type || !mesh || isNaN(step) || step === '') return;
        step *= value / 57.3;
        moving();
        clearInterval(this.timer);
        this.timer = setInterval(moving, 100);
        function moving() {
            mesh['rotate' + type](step);
            mesh.tc.needUpdate = view === 'view-all' ? 4 : 1;
            dispatch('updateTimer');
        }
    }

    onRotationMouseUp() {
        clearInterval(this.timer);
    }

    render() {
        const expendBtnIcon = this.props.expend ? 'tc-icon-down' : 'tc-icon-right';
        return (
            <div className="tc-meshlist">
                <div className="tc-panel-title-bar">
                    <span className="tc-icon tc-icon-close" onClick={this.onPanelCloseIconClick}></span>
                    <span className={'tc-icon ' + expendBtnIcon} onClick={this.onPanelToggleIconClick}></span>
                    Geometry Properties
                </div>
                <div className="tc-panel-content-container">
                    {this.props.expend ? editorRenderer(this) : null}
                </div>
            </div>
        );
    }
}


function editorRenderer(me) {
    const mesh = me.props.mesh;
    const geo = mesh.geometry;
    const nameEditorProps = {
        value: typeof mesh.tc.name === 'string'
            ? mesh.tc.name
            : (mesh.geometry.type.replace('Geometry', ' ') + uiUtil.dateFormat(mesh.tc.birth, 'DD/MM hh:mm:ss')),
        onChange: me.onNameChange
    };
    const positionXProps = {
        ...POSITION_EDITOR_PROPS,
        value: me.state.posx,
        onChange: getPositionChangeHandler(me, 'x')
    };
    const positionYProps = {
        ...POSITION_EDITOR_PROPS,
        value: me.state.posy,
        onChange: getPositionChangeHandler(me, 'y')
    };
    const positionZProps = {
        ...POSITION_EDITOR_PROPS,
        value: me.state.posz,
        onChange: getPositionChangeHandler(me, 'z')
    };
    const rotationContainerProps = {
        onMouseDown: me.onRotationMouseDown,
        onMouseUp: me.onRotationMouseUp,
        onMouseMove: me.onRotationMouseUp
    };
    const stepProps = {
        className: isNaN(me.state.step) || me.state.step === '' ? 'fcui2-numberbox-reject' : '',
        width: 65,
        type: 'float',
        fixed: 2,
        value: me.state.step,
        onChange: me.onStepChange
    };
    const scaleXProps = {
        ...SCALE_EDITOR_PROPS,
        className: isScaleAvailable(me.state.scalex) ? '' : 'fcui2-numberbox-reject',
        value: me.state.scalex,
        onChange: getScaleChangeHandler(me, 'x')
    };
    const scaleYProps = {
        ...SCALE_EDITOR_PROPS,
        className: isScaleAvailable(me.state.scaley) ? '' : 'fcui2-numberbox-reject',
        value: me.state.scaley,
        onChange: getScaleChangeHandler(me, 'y')
    };
    const scaleZProps = {
        ...SCALE_EDITOR_PROPS,
        className: isScaleAvailable(me.state.scalez) ? '' : 'fcui2-numberbox-reject',
        value: me.state.scalez,
        onChange: getScaleChangeHandler(me, 'z')
    };
    return (
        <table className="tc-geometry-editor"><tbody>
            <tr>
                <td>type:</td>
                <td>{geo.type}</td>
            </tr>
            <tr>
                <td>name:</td>
                <td><TextBox {...nameEditorProps}/></td>
            </tr>
            <tr style={{marginTop: 5}}>
                <td>position:</td>
                <td style={{lineHeight: '30px'}}>
                    <NumberBox {...positionXProps}/>&nbsp;x<br/>
                    <NumberBox {...positionYProps}/>&nbsp;y<br/>
                    <NumberBox {...positionZProps}/>&nbsp;z
                </td>
            </tr>
            <tr>
                <td>scale:</td>
                <td style={{lineHeight: '30px'}}>
                    <NumberBox {...scaleXProps}/>&nbsp;x<br/>
                    <NumberBox {...scaleYProps}/>&nbsp;y<br/>
                    <NumberBox {...scaleZProps}/>&nbsp;z
                </td>
            </tr>
            <tr>
                <td>rotation:</td>
                <td style={{lineHeight: '30px'}}>
                    <span style={{float: 'right'}}>
                        step:&nbsp;<NumberBox {...stepProps}/>&nbsp;
                    </span>
                    <div {...rotationContainerProps}>
                        <span data-type="X" data-value="-1" className="tc-icon tc-icon-left"></span>x
                        <span data-type="X" data-value="1" className="tc-icon tc-icon-right"></span><br/>
                        <span data-type="Y" data-value="-1" className="tc-icon tc-icon-left"></span>y
                        <span data-type="Y" data-value="1" className="tc-icon tc-icon-right"></span><br/>
                        <span data-type="Z" data-value="-1" className="tc-icon tc-icon-left"></span>z
                        <span data-type="Z" data-value="1" className="tc-icon tc-icon-right"></span>
                    </div>
                </td>
            </tr>
            {me.props.selectedVectorIndex > -1 ? vectorEditorRenderer(me) : null}
        </tbody></table>
    );
}


function vectorEditorRenderer(me) {
    const xProps = {
        ...POSITION_EDITOR_PROPS,
        value: me.state.vectorx,
        onChange: getVectorChangeHandler(me, 'x')
    };
    const yProps = {
        ...POSITION_EDITOR_PROPS,
        value: me.state.vectory,
        onChange: getVectorChangeHandler(me, 'y')
    };
    const zProps = {
        ...POSITION_EDITOR_PROPS,
        value: me.state.vectorz,
        onChange: getVectorChangeHandler(me, 'z')
    };
    return (
        <tr style={{marginTop: 5}}>
            <td>Vector:</td>
            <td style={{lineHeight: '30px'}}>
                <NumberBox {...xProps}/>&nbsp;x<br/>
                <NumberBox {...yProps}/>&nbsp;y<br/>
                <NumberBox {...zProps}/>&nbsp;z
            </td>
        </tr>
    );
}
