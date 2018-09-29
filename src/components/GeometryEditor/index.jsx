/**
 * @file 物体编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import getEditorTempValue from './getEditorTempValue';
import editorRenderer from './editorRenderer';


function shouldUpdateEditor(nextProps, props) {
    return nextProps.mesh && (
        nextProps.timer !== props.timer
        || nextProps.mesh !== props.mesh
        || nextProps.selectedVectorIndex !== props.selectedVectorIndex
    );
}


export default class GeometryEditor extends Component {

    static contextTypes = {
        dispatch: PropTypes.func
    }

    static propTypes = {
        type: PropTypes.string.isRequired,
        view: PropTypes.string.isRequired,
        expend: PropTypes.bool.isRequired,
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

    componentDidUpdate(prevProps) {
        if (shouldUpdateEditor(prevProps, this.props)) {
            this.setState(getEditorTempValue(this.props));
        }
    }

    onPanelCloseIconClick() {
        this.context.dispatch('closePanel', this.props.type);
    }

    onPanelToggleIconClick() {
        this.context.dispatch('togglePanel', this.props.type);
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
            mesh.tc.needUpdate = view === 'all' ? 4 : 1;
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
