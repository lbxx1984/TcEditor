/**
 * @file 物体列表
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'fcui2/Dialog.jsx';
import util from 'fcui2/core/util';
import MeshGroupCreator from '../components/dialogContent/NameCreator.jsx';


const dialog = new Dialog();

function getLabelDom(target) {
    while(!target.dataset.level && target.parentNode) target = target.parentNode;
    return target.dataset.level ? target : null;
}

function getMeshGroupData(group, mesh) {
    const result = [];
    const hash = {};
    group.map(function (item) {
        const newItem = {
            ...item,
            locked: true,
            visible: false,
            children: []
        };
        result.push(newItem);
        hash[item.label] = newItem;
    });
    Object.keys(mesh).map(key => {
        const item = mesh[key];
        const groupId = hash[item.tc.group] ? item.tc.group : 'default group';
        const groupItem = hash[groupId];
        groupItem.children.push(item);
        groupItem.locked = groupItem.locked && item.tc.locked;
        groupItem.visible = groupItem.visible || item.visible;
    });
    result.map(item => {
        if (item.children.length === 0) {
            item.locked = false;
            item.visible = true;
        }
    });
    return result;
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
        this.context.dispatch('view-close-panel', this.props.type);
    }

    onPanelToggleIconClick() {
        this.context.dispatch('view-toggle-panel', this.props.type);
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
        this.context.dispatch('view-toggle-group', getLabelDom(e.target).dataset.id);
    }

    onEditIconClick(e) {
        const dom = getLabelDom(e.target);
        dialog.pop({
            contentProps: {
                group: me.props.group,
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
            this.context.dispatch('tool-select-mesh-by-uuid', dom.dataset.id);
        }
        else {
            this.context.dispatch('changeActiveGroup', dom.dataset.id);
        }
    }

    onVisibleIconClick(e) {
        const dom = getLabelDom(e.target);
        if (dom.dataset.level === 'mesh') {
            this.context.dispatch('visibleMesh', dom.dataset.id);
        }
        else {
            this.context.dispatch('visibleGroup', dom.dataset.id, e.target.className.indexOf('tc-icon-invisible') > -1);
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
                this.context.dispatch('view-move-group', id1, id2);
                break;
            case '01':
                const mesh = this.props.mesh[id2];
                id2 = mesh.tc.group ? mesh.tc.group : 'default group';
                if (id1 === id2) return;
                this.context.dispatch('view-move-group', id1, id2);
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


function meshRenderer(mesh, doms, me) {
    const tc = mesh.tc;
    const name = tc.name || mesh.geometry.type.replace('Geometry', ' ')
        + util.dateFormat(tc.birth, 'DD/MM hh:mm:ss');
    const containerProps = {
        key: mesh.uuid,
        className: 'mesh-container'
            + (me.props.selectedMesh && me.props.selectedMesh.uuid === mesh.uuid ? ' mesh-selected' : ''),
        'data-id': mesh.uuid,
        'data-level': 'mesh',
        onDragStart: me.onDragStart,
        onDragOver: me.onDragOver
    };
    const visibleIconProps = {
        className: 'visible-icon tc-icon ' + (mesh.visible ? 'tc-icon-visible' : 'tc-icon-invisible'),
        onClick: me.onVisibleIconClick
    };
    const dragIconProps = {
        onMouseEnter: me.onDragIconEnter,
        onMouseLeave: me.onDragIconLeave,
        className: 'tc-icon tc-icon-drag'
    };
    const delIconProps = {
        className: 'tc-icon tc-icon-delete',
        onClick: me.onDelIconClick
    };
    const lockedIconProps = {
        className: 'tc-icon ' + (tc.locked ? 'tc-icon-lock' : 'tc-icon-unlock'),
        onClick: me.onLockIconClick
    };
    const labelProps = {
        className: 'main-label',
        onClick: me.onLabelClick
    };
    doms.push(
        <div {...containerProps}>
            <span {...delIconProps}></span>
            <span {...dragIconProps}></span>
            <span {...visibleIconProps}></span>
            <span {...lockedIconProps}></span>
            <div {...labelProps}>{name}</div>
        </div>
    );
}


function meshListRenderer(data, me) {
    const doms = [];
    data.map(function (group) {
        const delIcon = group.label === 'default group' || group.locked ? ' tc-icon-disabled' : '';
        const groupContainerProps = {
            'data-id': group.label,
            'data-level': 'group',
            className: 'folder-container' + (group.label === me.props.activeGroup ? ' active' : ''),
            onDragStart: me.onDragStart,
            onDragOver: me.onDragOver
        };
        const folderIconProps = {
            className: 'folder-icon tc-icon ' + (group.expend ? 'tc-icon-open-folder' : 'tc-icon-folder'),
            onClick: me.onFolderIconClick
        };
        const visibleIconProps = {
            className: 'visible-icon tc-icon ' + (group.visible ? 'tc-icon-visible' : 'tc-icon-invisible'),
            onClick: me.onVisibleIconClick
        };
        const lockIconProps = {
            className: 'tc-icon ' + (group.locked ? 'tc-icon-lock' : 'tc-icon-unlock'),
            onClick: me.onLockIconClick
        };
        const dragIconProps = {
            onMouseEnter: me.onDragIconEnter,
            onMouseLeave: me.onDragIconLeave,
            className: 'tc-icon tc-icon-drag'
        };
        const editIconProps = {
            className: 'tc-icon tc-icon-edit' + delIcon,
            onClick: delIcon ? undefined : me.onEditIconClick
        };
        const delIconProps = {
            className: 'tc-icon tc-icon-delete' + delIcon,
            onClick: delIcon ? undefined : me.onDelIconClick
        };
        const labelProps = {
            className: 'main-label',
            onClick: me.onLabelClick
        };
        doms.push(
            <div {...groupContainerProps} key={'group-contianer-' + group.label}>
                <span {...delIconProps}></span>
                <span {...dragIconProps}></span>
                <span {...editIconProps}></span>
                <span className="border-left">&nbsp;</span>
                <span {...folderIconProps}></span>
                <span {...visibleIconProps}></span>
                <span {...lockIconProps}></span>
                <div {...labelProps}>{group.label}</div>
            </div>
        );
        group.expend && group.children.map(mesh => meshRenderer(mesh, doms, me));
    });
    return doms;
}
