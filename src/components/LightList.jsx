/**
 * @file 灯光列表
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
        onPanelCloseIconClick: function () {
            this.context.dispatch('view-close-panel', this.props.type);
        },
        onPanelToggleIconClick: function () {
            this.context.dispatch('view-toggle-panel', this.props.type);
        },
        onDelIconClick: function (e) {
            var dom = getLabelDom(e.target);
            var dispatch = this.context.dispatch;
        },
        onVisibleIconClick: function (e) {
            var dom = getLabelDom(e.target);
            var dispatch = this.context.dispatch;
            this.context.dispatch('visibleLight', dom.dataset.key);
        },
        onLockIconClick: function (e) {
            var dom = getLabelDom(e.target);
            var dispatch = this.context.dispatch;
            this.context.dispatch('lockLight', dom.dataset.key);
        },
        onDelIconClick: function (e) {
            var dom = getLabelDom(e.target);
            var dispatch = this.context.dispatch;
            this.context.dispatch('deleteLight', dom.dataset.key);
        },
        onLabelClick: function (e) {
            var dom = getLabelDom(e.target);
            var dispatch = this.context.dispatch;
            this.context.dispatch('tool-select-light-by-key', dom.dataset.key);
        },
        render: function () {
            var expendBtnIcon = this.props.expend ? 'tc-icon-down' : 'tc-icon-right';
            return (
                <div className="tc-meshlist">
                    <div className="tc-panel-title-bar">
                        <span className="tc-icon tc-icon-close" onClick={this.onPanelCloseIconClick}></span>
                        <span className={'tc-icon ' + expendBtnIcon} onClick={this.onPanelToggleIconClick}></span>
                        Light List
                    </div>
                    <div className="tc-panel-content-container">
                        {this.props.expend ? listFactory(this) : null}
                    </div>
                </div>
            );
        }
    });


    function listFactory(me) {
        var doms = [];
        var selectedLight = me.props.selectedLight;
        if (selectedLight && selectedLight.tc) {
            selectedLight = selectedLight.tc.lightKey;
        }
        _.each(me.props.lights, function (light, key) {
            var tc = light.tc;
            var name = tc.name || light.type.replace('Light', ' ') + uiUtil.dateFormat(tc.birth, 'DD/MM hh:mm:ss');
            var containerProps = {
                key: light.uuid,
                className: 'mesh-container' + (key ===  selectedLight ? ' mesh-selected' : ''),
                'data-id': light.uuid,
                'data-key': key,
                'data-level': 'light'
            };
            var labelProps = {
                className: 'main-label',
                onClick: me.onLabelClick
            };
            var delIconProps = {
                className: 'tc-icon tc-icon-delete',
                onClick: me.onDelIconClick
            };
            var lockedIconProps = {
                className: 'tc-icon ' + (tc.locked ? 'tc-icon-lock' : 'tc-icon-unlock'),
                onClick: me.onLockIconClick
            };
            var visibleIconProps = {
                className: 'visible-icon tc-icon ' + (light.visible ? 'tc-icon-visible' : 'tc-icon-invisible'),
                onClick: me.onVisibleIconClick
            };
            doms.push(
                <div {...containerProps}>
                    <span {...delIconProps}></span>
                    <span {...visibleIconProps}></span>
                    <span {...lockedIconProps}></span>
                    <div {...labelProps}>{name}</div>
                </div>
            );
        });
        return doms;
    }


});
