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
        contextTypes: {
            dispatch: React.PropTypes.func
        },
        onPanelCloseIconClick: function () {
            this.context.dispatch('view-close-panel', this.props.type);
        },
        onPanelToggleIconClick: function () {
            this.context.dispatch('view-toggle-panel', this.props.type);
        },
        render: function () {
            var expendBtnIcon = this.props.expend ? 'icon-xiashixinjiantou' : 'icon-youshixinjiantou';
            return (
                <div className="tc-meshlist">
                    <div className="tc-panel-title-bar">
                        <span className="iconfont icon-guanbi1" onClick={this.onPanelCloseIconClick}></span>
                        <span className={'iconfont ' + expendBtnIcon} onClick={this.onPanelToggleIconClick}></span>
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
        _.each(me.props.lights, function (light, key) {
            var tc = light.tc;
            var name = tc.name || light.type.replace('Light', ' ') + uiUtil.dateFormat(tc.birth, 'DD/MM hh:mm:ss');
            var containerProps = {
                key: light.uuid,
                className: 'mesh-container',
                'data-id': light.uuid,
                'data-level': 'light'
            };
            var labelProps = {
                className: 'main-label',
                onClick: me.onLabelClick
            };
            var delIconProps = {
                className: 'iconfont icon-shanchu',
                onClick: me.onDelIconClick
            };
            var lockedIconProps = {
                className: 'iconfont ' + (tc.locked ? 'icon-unlock' : 'icon-lock'),
                onClick: me.onLockIconClick
            };
            var visibleIconProps = {
                className: 'visible-icon iconfont ' + (light.visible ? 'icon-kejian' : 'icon-bukejian'),
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
