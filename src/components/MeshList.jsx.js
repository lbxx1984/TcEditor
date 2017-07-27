/**
 * @file 物体列表
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');   
    var _ = require('underscore');
    var uiUtil = require('fcui2/core/util');
    var MeshGroupCreator = require('../components/dialogContent/NameCreator.jsx');
    var Dialog = require('fcui2/Dialog.jsx');
    var dialog = new Dialog();


    function getLabelDom(target) {
        while(!target.dataset.level && target.parentNode) target = target.parentNode;
        return target.dataset.level ? target : null;
    }


    return React.createClass({
        // @override
        contextTypes: {
            dispatch: React.PropTypes.func
        },
        // @override
        componentDidMount: function () {
            this.dragingTarget = null;
            this.dragingOver = null;
        },
        onPanelCloseIconClick: function () {
            this.context.dispatch('view-close-panel', this.props.type);
        },
        onPanelToggleIconClick: function () {
            this.context.dispatch('view-toggle-panel', this.props.type);
        },
        onAddGroupIconClick: function () {
            var me = this;
            dialog.pop({
                contentProps: {
                    group: me.props.group,
                    initialName: '',
                    onEnter: function (groupname) {
                        me.context.dispatch('addGroup', groupname);
                    }
                },
                content: MeshGroupCreator,
                title: 'Create New Mesh Group'
            });
        },
        onFolderIconClick: function (e) {
            var dom = getLabelDom(e.target);
            this.context.dispatch('view-toggle-group', dom.dataset.id);
        },
        onEditIconClick: function (e) {
            var dom = getLabelDom(e.target);
            var me = this;
            dialog.pop({
                contentProps: {
                    group: me.props.group,
                    initialName: dom.dataset.id,
                    onEnter: function (groupname) {
                        me.context.dispatch('renameGroup', dom.dataset.id, groupname);
                    }
                },
                content: MeshGroupCreator,
                title: 'Rename Mesh Group'
            });
        },
        onDelIconClick: function (e) {
            var dom = getLabelDom(e.target);
            var dispatch = this.context.dispatch;
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
                    onEnter: function () {
                        dispatch('deleteGroup', dom.dataset.id, true);
                    },
                    onCancel: function () {
                        dispatch('deleteGroup', dom.dataset.id, false);
                    }
                });
            }
        },
        onLockIconClick: function (e) {
            var dom = getLabelDom(e.target);
            if (dom.dataset.level === 'mesh') {
                this.context.dispatch('lockMesh', dom.dataset.id);
            }
            else {
                this.context.dispatch('lockGroup', dom.dataset.id, e.target.className.indexOf('icon-unlock') > -1);
            }
        },
        onLabelClick: function (e) {
            var dom = getLabelDom(e.target);
            if (dom.dataset.level === 'mesh') {
                this.context.dispatch('tool-select-mesh-by-uuid', dom.dataset.id);
            }
            else {
                this.context.dispatch('changeActiveGroup', dom.dataset.id);
            }
        },
        onVisibleIconClick: function (e) {
            var dom = getLabelDom(e.target);
            if (dom.dataset.level === 'mesh') {
                this.context.dispatch('visibleMesh', dom.dataset.id);
            }
            else {
                this.context.dispatch('visibleGroup', dom.dataset.id, e.target.className.indexOf('icon-invisible') > -1);
            }
        },
        onDragIconEnter: function (e) {
            e.target.parentNode.draggable = true;
        },
        onDragIconLeave: function (e) {
            e.target.parentNode.draggable = false;
        },
        onDragStart: function (event) {
            if (event.dataTransfer && event.dataTransfer.setData) {
                event.dataTransfer.setData('text', '');
            }
            event.stopPropagation();
            var target = getLabelDom(event.target);
            if (!target) return;
            this.dragingTarget = {
                isMesh: target.dataset.level === 'mesh',
                id: target.dataset.id
            };
        },
        onDragOver: function (event) {
            event.stopPropagation();
            var target = getLabelDom(event.target);
            if (!target) return;
            this.dragingOver = {
                isMesh: target.dataset.level === 'mesh',
                id: target.dataset.id
            };
        },
        onDragEnd: function () {
            if (!this.dragingTarget || !this.dragingOver) return;
            if (this.dragingTarget.id === this.dragingOver.id) return;
            var type = (this.dragingTarget.isMesh ? '1' : '0') + (this.dragingOver.isMesh ? '1' : '0');
            var id1 = this.dragingTarget.id;
            var id2 = this.dragingOver.id;
            this.dragingTarget = null;
            this.dragingOver = null;
            switch (type) {
                case '00':
                    this.context.dispatch('view-move-group', id1, id2);
                    break;
                case '01':
                    var mesh = this.props.mesh[id2];
                    id2 = mesh.tc.group ? mesh.tc.group : 'default group';
                    if (id1 === id2) return;
                    this.context.dispatch('view-move-group', id1, id2);
                    break;
                case '10':
                    this.context.dispatch('changeMeshGroup', id1, id2);
                    break;
                case '11':
                    var mesh1 = this.props.mesh[id1];
                    var mesh2 = this.props.mesh[id2];
                    id2 = mesh2.tc.group ? mesh2.tc.group : 'default group';
                    if (mesh1.tc.group === id2) return;
                    this.context.dispatch('changeMeshGroup', id1, id2);
                    break;
                default:
                    break;
            }
        },
        render: function () {
            var expendBtnIcon = this.props.expend ? 'icon-down' : 'icon-right';
            var meshData = getMeshGroupData(this.props.group, this.props.mesh);
            return (
                <div className="tc-meshlist" onDragEnd={this.onDragEnd}>
                    <div className="tc-panel-title-bar">
                        <span className="tc-icon icon-close" onClick={this.onPanelCloseIconClick}></span>
                        <span className="tc-icon icon-create-folder" onClick={this.onAddGroupIconClick}></span>
                        <span className={'tc-icon ' + expendBtnIcon} onClick={this.onPanelToggleIconClick}></span>
                        Mesh List
                    </div>
                    <div className="tc-panel-content-container">
                        {this.props.expend ? listFactory(meshData, this) : null}
                    </div>
                </div>
            );
        }
    });


    function getMeshGroupData(group, mesh) {
        var result = [];
        var hash = {};
        group.map(function (item) {
            var newItem = _.extend({}, item, {
                locked: true,
                visible: false,
                children: []
            });
            result.push(newItem);
            hash[item.label] = newItem;
        });
        for (var key in mesh) {
            if (!mesh.hasOwnProperty(key)) continue;
            var item = mesh[key];
            var groupId = hash[item.tc.group] ? item.tc.group : 'default group';
            var groupItem = hash[groupId];
            groupItem.children.push(item);
            groupItem.locked = groupItem.locked && item.tc.locked;
            groupItem.visible = groupItem.visible || item.visible;
        }
        result.map(function (item) {
            if (item.children.length === 0) {
                item.locked = false;
                item.visible = true;
            }
        });
        return result;
    }


    function listFactory(data, me) {
        var doms = [];
        data.map(function (group) {
            var delIcon = group.label === 'default group' || group.locked ? ' icon-disabled' : '';
            var groupContainerProps = {
                key: 'group-contianer-' + group.label,
                'data-id': group.label,
                'data-level': 'group',
                className: 'folder-container' + (group.label === me.props.activeGroup ? ' active' : ''),
                onDragStart: me.onDragStart,
                onDragOver: me.onDragOver
            };
            var folderIconProps = {
                className: 'folder-icon tc-icon ' + (group.expend ? 'icon-open-folder' : 'icon-folder'),
                onClick: me.onFolderIconClick
            };
            var visibleIconProps = {
                className: 'visible-icon tc-icon ' + (group.visible ? 'icon-visible' : 'icon-invisible'),
                onClick: me.onVisibleIconClick
            };
            var lockIconProps = {
                className: 'tc-icon ' + (group.locked ? 'icon-lock' : 'icon-unlock'),
                onClick: me.onLockIconClick
            };
            var dragIconProps = {
                onMouseEnter: me.onDragIconEnter,
                onMouseLeave: me.onDragIconLeave,
                className: 'tc-icon icon-drag'
            };
            var editIconProps = {
                className: 'tc-icon icon-edit' + delIcon,
                onClick: delIcon ? undefined : me.onEditIconClick
            };
            var delIconProps = {
                className: 'tc-icon icon-delete' + delIcon,
                onClick: delIcon ? undefined : me.onDelIconClick
            };
            var labelProps = {
                className: 'main-label',
                onClick: me.onLabelClick
            };
            doms.push(
                <div {...groupContainerProps}>
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
            group.expend && group.children.map(meshFactory);
        });
        return doms;
        function meshFactory(mesh) {
            var tc = mesh.tc;
            var name = tc.name || mesh.geometry.type.replace('Geometry', ' ')
                + uiUtil.dateFormat(tc.birth, 'DD/MM hh:mm:ss');
            var containerProps = {
                key: mesh.uuid,
                className: 'mesh-container'
                    + (me.props.selectedMesh && me.props.selectedMesh.uuid === mesh.uuid ? ' mesh-selected' : ''),
                'data-id': mesh.uuid,
                'data-level': 'mesh',
                onDragStart: me.onDragStart,
                onDragOver: me.onDragOver
            };
            var visibleIconProps = {
                className: 'visible-icon tc-icon ' + (mesh.visible ? 'icon-visible' : 'icon-invisible'),
                onClick: me.onVisibleIconClick
            };
            var dragIconProps = {
                onMouseEnter: me.onDragIconEnter,
                onMouseLeave: me.onDragIconLeave,
                className: 'tc-icon icon-drag'
            };
            var delIconProps = {
                className: 'tc-icon icon-delete',
                onClick: me.onDelIconClick
            };
            var lockedIconProps = {
                className: 'tc-icon ' + (tc.locked ? 'icon-lock' : 'icon-unlock'),
                onClick: me.onLockIconClick
            };
            var labelProps = {
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
    }


});
