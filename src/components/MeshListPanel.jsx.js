/**
 * @file 物体列表
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');   
    var _ = require('underscore');
    var uiUtil = require('fcui2/core/util');


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            return {};
        },
        // @override
        shouldComponentUpdate: function(nextProps, nextState) {
            if (nextProps.mesh === this.props.mesh && nextProps.group === this.props.group) {
                return false;
            }
            return true;
        },
        render: function () {
            var expendBtnIcon = this.props.item.expend ? 'icon-xiashixinjiantou' : 'icon-youshixinjiantou';
            var meshData = getMeshGroupData(this.props.group, this.props.mesh);
            return (
                <div className="tc-meshlist">
                    <div className="tc-panel-title-bar">
                        <span className="iconfont icon-guanbi1"></span>
                        <span className={'iconfont ' + expendBtnIcon}></span>
                        Mesh
                    </div>
                    <div className="tc-panel-content-container">
                        {listFactory(meshData, this)}
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
        return result;
    }


    function listFactory(data, me) {
        var doms = [];
        data.map(function (group) {
            var delIcon = group.label === 'default group' ? ' icon-disabled' : '';
            var folderIcon = group.expend ? 'icon-iconfont90' : 'icon-wenjianjia';
            var visibleIcon = group.visible ? 'icon-kejian' : 'icon-bukejian';
            var lockedIcon = group.locked ? 'icon-suo1' : 'icon-suo';
            doms.push(
                <div className="folder-container" key={'group-contianer-' + group.label}>
                    <span className={'del-icon iconfont icon-shanchu' + delIcon}></span>
                    <span className={'visible-icon iconfont ' + visibleIcon}></span>
                    <span className={'lock-icon iconfont ' + lockedIcon}></span>
                    <span className={'folder-icon iconfont ' + folderIcon}></span>
                    <div className="main-label">{group.label}</div>
                </div>
            );
            group.expend && group.children.map(meshFactory);
        });
        return doms;
        function meshFactory(mesh) {
            var tc = mesh.tc || {};
            var visibleIcon = mesh.visible ? 'icon-kejian' : 'icon-bukejian';
            var lockedIcon = tc.locked ? 'icon-suo1' : 'icon-suo';
            tc.birth = tc.birth || new Date();
            var name = tc.name || mesh.geometry.type.replace('Geometry', ' ')
                + uiUtil.dateFormat(tc.birth, 'YYYY-MM-DD hh:mm');
            doms.push(
                <div className="mesh-container" key={mesh.uuid}>
                    <span className={'del-icon iconfont icon-shanchu'}></span>
                    <span className={'visible-icon iconfont ' + visibleIcon}></span>
                    <span className={'lock-icon iconfont ' + lockedIcon}></span>
                    <div className="main-label">{name}</div>
                </div>
            );
        }
    }

});
