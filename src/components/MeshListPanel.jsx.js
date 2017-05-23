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
        while(!target.dataset.dragLevel && target.parentNode) target = target.parentNode;
        return target.dataset.dragLevel ? target : null;
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
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            return {};
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
                isMesh: target.dataset.dragLevel === 'mesh',
                id: target.dataset.dragId
            };
        },
        onDragOver: function (event) {
            event.stopPropagation();
            var target = getLabelDom(event.target);
            if (!target) return;
            this.dragingOver = {
                isMesh: target.dataset.dragLevel === 'mesh',
                id: target.dataset.dragId
            };
        },
        onDragEnd: function () {
            console.log(JSON.stringify(this.dragingTarget));
            console.log(JSON.stringify(this.dragingOver));
            this.dragingTarget = null;
            this.dragingOver = null;
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
            item.tc = item.tc || {};
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
            var lockedIcon = group.locked ? 'icon-suo1' : 'icon-suo';
            var dragIconProps = {
                onMouseEnter: me.onDragIconEnter,
                onMouseLeave: me.onDragIconLeave,
                className: 'iconfont icon-drag'
            };
            var groupContainerProps = {
                key: 'group-contianer-' + group.label,
                'data-drag-id': group.label,
                'data-drag-level': 'group',
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
            var tc = mesh.tc || {};
            tc.birth = tc.birth || new Date();
            var visibleIcon = mesh.visible ? 'icon-kejian' : 'icon-bukejian';
            var lockedIcon = tc.locked ? 'icon-suo1' : 'icon-suo';
            var name = tc.name || mesh.geometry.type.replace('Geometry', ' ')
                + uiUtil.dateFormat(tc.birth, 'DD/MM hh:mm:ss');
            var dragIconProps = {
                onMouseEnter: me.onDragIconEnter,
                onMouseLeave: me.onDragIconLeave,
                className: 'iconfont icon-drag'
            };
            var containerProps = {
                key: mesh.uuid,
                className: 'mesh-container'
                    + (me.props.selectedMesh && me.props.selectedMesh.uuid === mesh.uuid ? ' mesh-selected' : ''),
                'data-drag-id': mesh.uuid,
                'data-drag-level': 'mesh',
                onDragStart: me.onDragStart,
                onDragOver: me.onDragOver
            };
            doms.push(
                <div {...containerProps}>
                    <span className={'iconfont icon-shanchu'}></span>
                    <span {...dragIconProps}></span>
                    <span className={'visible-icon iconfont ' + visibleIcon}></span>
                    <span className={'iconfont ' + lockedIcon}></span>
                    <div className="main-label">{name}</div>
                </div>
            );
        }
    }


});
