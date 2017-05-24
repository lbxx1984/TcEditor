/**
 * @file 物体列表
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');   
    var _ = require('underscore');
    var uiUtil = require('fcui2/core/util');


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
        onPanelClose: function () {
            this.context.dispatch('view-close-panel', this.props.type);
        },
        onPanelToggle: function () {
            this.context.dispatch('view-toggle-panel', this.props.type);
        },
        onPanelAdd: function () {
            this.context.dispatch('view-add-group', this.props.type);
        },
        onDelIconClick: function (e) {
            var dom = getLabelDom(e.target);
            if (dom.dataset.level === 'mesh') {
                this.context.dispatch('deleteMesh', dom.dataset.id);
            }
        },
        onLockIconClick: function (e) {
            var dom = getLabelDom(e.target);
            if (dom.dataset.level === 'mesh') {
                this.context.dispatch('lockMesh', dom.dataset.id);
            }
        },
        onLabelClick: function (e) {
            var dom = getLabelDom(e.target);
            if (dom.dataset.level === 'mesh') {
                this.context.dispatch('tool-select-mesh-by-uuid', dom.dataset.id);
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
            var expendBtnIcon = this.props.expend ? 'icon-xiashixinjiantou' : 'icon-youshixinjiantou';
            var meshData = getMeshGroupData(this.props.group, this.props.mesh);
            return (
                <div className="tc-meshlist" onDragEnd={this.onDragEnd}>
                    <div className="tc-panel-title-bar">
                        <span className="iconfont icon-guanbi1" onClick={this.onPanelClose}></span>
                        <span className="iconfont icon-xinjianwenjianjia" onClick={this.onPanelAdd}></span>
                        <span className={'iconfont ' + expendBtnIcon} onClick={this.onPanelToggle}></span>
                        Mesh
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
            var delIcon = group.label === 'default group' ? ' icon-disabled' : '';
            var folderIcon = group.expend ? 'icon-iconfont90' : 'icon-wenjianjia';
            var visibleIcon = group.visible ? 'icon-kejian' : 'icon-bukejian';
            var lockedIcon = group.locked ? 'icon-unlock' : 'icon-lock';
            var dragIconProps = {
                onMouseEnter: me.onDragIconEnter,
                onMouseLeave: me.onDragIconLeave,
                className: 'iconfont icon-drag'
            };
            var groupContainerProps = {
                key: 'group-contianer-' + group.label,
                'data-id': group.label,
                'data-level': 'group',
                className: 'folder-container',
                onDragStart: me.onDragStart,
                onDragOver: me.onDragOver
            };
            doms.push(
                <div {...groupContainerProps}>
                    <span className={'iconfont icon-shanchu' + delIcon}></span>
                    <span {...dragIconProps}></span>
                    <span className={'folder-icon iconfont ' + folderIcon}></span>
                    <span className={'visible-icon iconfont ' + visibleIcon}></span>
                    <span className={'iconfont ' + lockedIcon}></span>
                    <div className="main-label">{group.label}</div>
                </div>
            );
            group.expend && group.children.map(meshFactory);
        });
        return doms;
        function meshFactory(mesh) {
            var tc = mesh.tc;
            var visibleIcon = mesh.visible ? 'icon-kejian' : 'icon-bukejian';
            var name = tc.name || mesh.geometry.type.replace('Geometry', ' ')
                + uiUtil.dateFormat(tc.birth, 'DD/MM hh:mm:ss');
            var dragIconProps = {
                onMouseEnter: me.onDragIconEnter,
                onMouseLeave: me.onDragIconLeave,
                className: 'iconfont icon-drag'
            };
            var delIconProps = {
                className: 'iconfont icon-shanchu',
                onClick: me.onDelIconClick
            };
            var lockedIconProps = {
                className: 'iconfont ' + (tc.locked ? 'icon-unlock' : 'icon-lock'),
                onClick: me.onLockIconClick
            };
            var labelProps = {
                className: 'main-label',
                onClick: me.onLabelClick
            };
            var containerProps = {
                key: mesh.uuid,
                className: 'mesh-container'
                    + (me.props.selectedMesh && me.props.selectedMesh.uuid === mesh.uuid ? ' mesh-selected' : ''),
                'data-id': mesh.uuid,
                'data-level': 'mesh',
                onDragStart: me.onDragStart,
                onDragOver: me.onDragOver
            };
            doms.push(
                <div {...containerProps}>
                    <span {...delIconProps}></span>
                    <span {...dragIconProps}></span>
                    <span className={'visible-icon iconfont ' + visibleIcon}></span>
                    <span {...lockedIconProps}></span>
                    <div {...labelProps}>{name}</div>
                </div>
            );
        }
    }


});
