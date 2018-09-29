/**
 * @file 物体列表
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'tcui/Dialog';
import MeshGroupCreator from '../NameCreator';
import getMeshGroupData from './getMeshGroupData';
import meshListRenderer from './meshListRenderer';


const dialog = new Dialog();


function getLabelDom(target) {
    while(!target.dataset.level && target.parentNode) target = target.parentNode;
    return target.dataset.level ? target : null;
}


export default class MeshList extends Component {

    static contextTypes = {
        dispatch: PropTypes.func
    }

    static propTypes = {
        type: PropTypes.string.isRequired,
        group: PropTypes.array.isRequired,
        mesh: PropTypes.object.isRequired,
        expend: PropTypes.bool.isRequired
    }

    constructor(props) {
        super(props);
        this.onPanelCloseIconClick = this.onPanelCloseIconClick.bind(this);
        this.onPanelToggleIconClick = this.onPanelToggleIconClick.bind(this);
        this.onAddGroupIconClick = this.onAddGroupIconClick.bind(this);
        this.onFolderIconClick = this.onFolderIconClick.bind(this);
        this.onEditIconClick = this.onEditIconClick.bind(this);
        this.onDelIconClick = this.onDelIconClick.bind(this);
        this.onLockIconClick = this.onLockIconClick.bind(this);
        this.onLabelClick = this.onLabelClick.bind(this);
        this.onVisibleIconClick = this.onVisibleIconClick.bind(this);
        this.onDragIconEnter = this.onDragIconEnter.bind(this);
        this.onDragIconLeave = this.onDragIconLeave.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.dragingTarget = null;
        this.dragingOver = null;
    }

    componentDidMount() {
        this.dragingTarget = null;
        this.dragingOver = null;
    }

    onPanelCloseIconClick() {
        this.context.dispatch('closePanel', this.props.type);
    }

    onPanelToggleIconClick() {
        this.context.dispatch('togglePanel', this.props.type);
    }

    onAddGroupIconClick() {
        dialog.pop({
            contentProps: {
                group: this.props.group,
                initialName: '',
                onEnter: groupname => {
                    this.context.dispatch('addGroup', groupname);
                }
            },
            content: MeshGroupCreator,
            title: 'Create New Mesh Group'
        });
    }

    onFolderIconClick(e) {
        this.context.dispatch('toggleGroup', getLabelDom(e.target).dataset.id);
    }

    onEditIconClick(e) {
        const dom = getLabelDom(e.target);
        dialog.pop({
            contentProps: {
                group: this.props.group,
                initialName: dom.dataset.id,
                onEnter: groupname => {
                    this.context.dispatch('renameGroup', dom.dataset.id, groupname);
                }
            },
            content: MeshGroupCreator,
            title: 'Rename Mesh Group'
        });
    }

    onDelIconClick(e) {
        const dom = getLabelDom(e.target);
        const dispatch = this.context.dispatch;
        if (dom.dataset.level === 'mesh') {
            dispatch('deleteMesh', dom.dataset.id);
        }
        else {
            dialog.confirm({
                title: 'Please Confirm',
                message: '<h4>Are you sure to remove the group\'s meshes after droping it?</h4>'
                    + 'If you press \'Yes\', the locked meshes will be moved to default group.<br>'
                    + 'If you press \'No\', all meshes will be moved to default group.<br>'
                    + 'Press close button to cancel.',
                appSkin: 'oneux3',
                labels: {
                    enter: 'Yes',
                    cancel: 'No'
                },
                onEnter() {
                    dispatch('deleteGroup', dom.dataset.id, true);
                },
                onCancel() {
                    dispatch('deleteGroup', dom.dataset.id, false);
                }
            });
        }
    }

    onLockIconClick(e) {
        const dom = getLabelDom(e.target);
        if (dom.dataset.level === 'mesh') {
            this.context.dispatch('lockMesh', dom.dataset.id);
        }
        else {
            this.context.dispatch('lockGroup', dom.dataset.id, e.target.className.indexOf('tc-icon-unlock') > -1);
        }
    }

    onLabelClick(e) {
        const dom = getLabelDom(e.target);
        if (dom.dataset.level === 'mesh') {
            this.context.dispatch('selectMesh', dom.dataset.id);
        }
        else {
            this.context.dispatch('changeActiveGroup', dom.dataset.id);
        }
    }

    onVisibleIconClick(e) {
        const dom = getLabelDom(e.target);
        const id = dom.dataset.id;
        if (dom.dataset.level === 'mesh') {
            this.context.dispatch('toggleMeshVisibility', id);
        }
        else {
            this.context.dispatch('toggleGroupVisibility', id, e.target.className.indexOf('tc-icon-invisible') > -1);
        }
    }

    onDragIconEnter(e) {
        e.target.parentNode.draggable = true;
    }

    onDragIconLeave(e) {
        e.target.parentNode.draggable = false;
    }

    onDragStart(event) {
        if (event.dataTransfer && event.dataTransfer.setData) {
            event.dataTransfer.setData('text', '');
        }
        event.stopPropagation();
        const target = getLabelDom(event.target);
        if (!target) return;
        this.dragingTarget = {
            isMesh: target.dataset.level === 'mesh',
            id: target.dataset.id
        };
    }

    onDragOver(event) {
        event.stopPropagation();
        const target = getLabelDom(event.target);
        if (!target) return;
        this.dragingOver = {
            isMesh: target.dataset.level === 'mesh',
            id: target.dataset.id
        };
    }

    onDragEnd() {
        if (!this.dragingTarget || !this.dragingOver) return;
        if (this.dragingTarget.id === this.dragingOver.id) return;
        const type = (this.dragingTarget.isMesh ? '1' : '0') + (this.dragingOver.isMesh ? '1' : '0');
        const id1 = this.dragingTarget.id;
        let id2 = this.dragingOver.id;
        this.dragingTarget = null;
        this.dragingOver = null;
        switch (type) {
            case '00':
                this.context.dispatch('moveGroup', id1, id2);
                break;
            case '01':
                const mesh = this.props.mesh[id2];
                id2 = mesh.tc.group ? mesh.tc.group : 'default group';
                if (id1 === id2) return;
                this.context.dispatch('moveGroup', id1, id2);
                break;
            case '10':
                this.context.dispatch('changeMeshGroup', id1, id2);
                break;
            case '11':
                const mesh1 = this.props.mesh[id1];
                const mesh2 = this.props.mesh[id2];
                id2 = mesh2.tc.group ? mesh2.tc.group : 'default group';
                if (mesh1.tc.group === id2) return;
                this.context.dispatch('changeMeshGroup', id1, id2);
                break;
            default:
                break;
        }
    }

    render() {
        const expendBtnIcon = this.props.expend ? 'tc-icon-down' : 'tc-icon-right';
        const meshData = getMeshGroupData(this.props.group, this.props.mesh);
        return (
            <div className="tc-meshlist" onDragEnd={this.onDragEnd}>
                <div className="tc-panel-title-bar">
                    <span className="tc-icon tc-icon-close" onClick={this.onPanelCloseIconClick}></span>
                    <span className="tc-icon tc-icon-create-folder" onClick={this.onAddGroupIconClick}></span>
                    <span className={'tc-icon ' + expendBtnIcon} onClick={this.onPanelToggleIconClick}></span>
                    Mesh List
                </div>
                <div className="tc-panel-content-container">
                    {this.props.expend ? meshListRenderer(meshData, this) : null}
                </div>
            </div>
        );
    }
}
